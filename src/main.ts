import 'reflect-metadata'
import 'dotenv/config'

import process from 'node:process'

import { resolve } from '@discordx/importer'
import { RequestContext } from '@mikro-orm/core'
import chalk from 'chalk'
import chokidar from 'chokidar'
import discordLogs from 'discord-logs'
import { Player, PlayerInitOptions } from 'discord-player'
import { DeezerExtractor } from "discord-player-deezer"

import { Client, DIService, MetadataStorage, tsyringeDependencyRegistryEngine } from 'discordx'
import { container } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'

import { Server } from '@/api/server'
import { apiConfig, generalConfig, musicConfig } from '@/configs'
import { keptInstances } from '@/decorators'
import { checkEnvironmentVariables, env } from '@/env'
import { NoBotTokenError } from '@/errors'
import { Database, ErrorHandler, EventManager, Logger, PluginsManager, Store } from '@/services'
import { initDataTable, resolveDependency } from '@/utils/functions'

import { clientConfig } from './client'

// eslint-disable-next-line node/no-path-concat
const importPattern = `${__dirname}/{events,commands}/**/*.{ts,js}`

/**
 * Import files
 * @param path glob pattern
 */
async function loadFiles(path: string): Promise<void> {
	const files = await resolve(path)
	await Promise.all(
		// eslint-disable-next-line array-callback-return
		files.map((file) => {
			const newFileName = file.replace('file://', '')
			delete require.cache[newFileName]
			import(newFileName)
		})
	)
}

/**
 * Hot reload
 */
async function reload(client: Client) {
	const store = await resolveDependency(Store)
	store.set('botHasBeenReloaded', true)

	const logger = await resolveDependency(Logger)
	console.log('\n')
	logger.startSpinner('Hot reloading...')

	// remove events
	client.removeEvents()

	// get all instances to keep
	const instancesToKeep: Map<constructor<any>, any> = new Map()
	for (const target of keptInstances) {
		const instance = await resolveDependency(target)
		instancesToKeep.set(target, instance)
	}

	// cleanup
	MetadataStorage.clear()
	DIService.engine.clearAllServices()

	// transfer store instance to the new container in order to keep the same states
	for (const [target, instance] of instancesToKeep) {
		container.registerInstance(target, instance)
	}

	// re-register the client instance
	container.registerInstance(Client, client)

	// reload files
	await loadFiles(importPattern)

	// rebuild
	await MetadataStorage.instance.build()
	await client.initApplicationCommands()
	client.initEvents()

	// re-init services

	const pluginManager = await resolveDependency(PluginsManager)
	await pluginManager.loadPlugins()

	const db = await resolveDependency(Database)
	await db.initialize()

	logger.log(chalk.whiteBright('Hot reloaded\n'))
}

async function init() {
	const logger = await resolveDependency(Logger)

	// check environment variables
	checkEnvironmentVariables()

	// init error handler
	await resolveDependency(ErrorHandler)

	// init plugins
	const pluginManager = await resolveDependency(PluginsManager)
	await pluginManager.loadPlugins()
	await pluginManager.syncTranslations()

	// strart spinner
	console.log('\n')
	logger.startSpinner('Starting...')

	// init the database
	const db = await resolveDependency(Database)
	await db.initialize()

	// init the client
	DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)
	const client = new Client(clientConfig())

	// init the player
	const player = new Player(client, musicConfig.discordPlayer as PlayerInitOptions)

	// register the player instance
	// player.extractors.register(SoundCloudExtractor, {})

	await player.extractors.register(DeezerExtractor, {
		decryptionKey: "g4el58wc0zvf9na1",
		arl: "b5d4ef623d6a5ad19ebf8d13b6105b31f4ad48afd7e9adf49f459eb47745fc0ff98b8b557a5ce813b3b016f3c78449750f964966b753dd37f58930ad9b0e40d9fa63489b406e5ca85f9a15bf1b3d2767e79977b0dd69fece379837528936877e",
	});

	// Load all new events
	discordLogs(client, { debug: false })
	container.registerInstance(Client, client)

	// import all the commands and events
	await loadFiles(importPattern)
	await pluginManager.importCommands()
	await pluginManager.importEvents()

	RequestContext.create(db.orm.em, async () => {
		const watcher = env.NODE_ENV === 'development' ? chokidar.watch(importPattern) : null

		// init the data table if it doesn't exist
		await initDataTable()

		// init plugins services
		await pluginManager.initServices()

		// init the plugin main file
		await pluginManager.execMains()

		// log in with the bot token
		if (!env.BOT_TOKEN) throw new NoBotTokenError()
		client.login(env.BOT_TOKEN)
			.then(async () => {
				if (env.NODE_ENV === 'development') {
					// reload commands and events when a file changes
					watcher?.on('change', () => reload(client))

					// reload commands and events when a file is added
					watcher?.on('add', () => reload(client))

					// reload commands and events when a file is deleted
					watcher?.on('unlink', () => reload(client))
				}

				// start the api server
				if (apiConfig.enabled) {
					const server = await resolveDependency(Server)
					await server.start()
				}

				const store = await container.resolve(Store)
				store.select('ready').subscribe(async (ready) => {
					// check that all properties that are not null are set to true
					if (
						Object
							.values(ready)
							.filter(value => value !== null)
							.every(value => value === true)
					) {
						const eventManager = await resolveDependency(EventManager)
						eventManager.emit('templateReady') // the template is fully ready!
					}
				})
			})
			.catch((err) => {
				console.error(err)
				process.exit(1)
			})
	})
}

init()
