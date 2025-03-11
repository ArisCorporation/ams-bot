import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash, SlashChoice, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicBackCommand {

	@Slash({ name: 'loop', description: 'Wiederhole das Lied oder die Warteschlange' })

	@Guard(GuildOnly)
	async historyHandler(
		@SlashChoice({ name: 'Queue', value: 'enable_loop_queue' })
		@SlashChoice({ name: 'Disable', value: 'disable_loop' })
		@SlashChoice({ name: 'Song', value: 'enable_loop_song' })
		@SlashChoice({ name: 'Autoplay', value: 'enable_autoplay' })
		@SlashOption({ name: 'action', type: ApplicationCommandOptionType.String, required: true }) action: string,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		const errorMessage = await `Something went wrong <${interaction.member}>... try again ? <❌>`
		const baseEmbed = new EmbedBuilder()
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		if (!queue?.isPlaying()) return interaction.editReply({ content: await `No music currently playing <${interaction.member}>... try again ? <❌>` })

		// @ts-expect-error
		switch (interaction.options._hoistedOptions.map(x => x.value).toString()) {
			case 'enable_loop_queue': {
				if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.editReply({ content: `You must first disable the current music in the loop mode (\`/loop Disable\`) ${interaction.member}... try again ? ❌` })

				queue.setRepeatMode(QueueRepeatMode.QUEUE)
				baseEmbed.setAuthor({ name: queue.repeatMode === QueueRepeatMode.QUEUE ? await `Repeat mode enabled the whole queue will be repeated endlessly <🔁>` : errorMessage })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'disable_loop': {
				if (queue.repeatMode === QueueRepeatMode.OFF) return interaction.editReply({ content: await `You must first enable the loop mode <(/loop Queue or /loop Song)> <${interaction.member}>... try again ? <❌>` })

				queue.setRepeatMode(QueueRepeatMode.OFF)
				baseEmbed.setAuthor({ name: await `Repeat mode disabled the queue will no longer be repeated <🔁>` })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'enable_loop_song': {
				if (queue.repeatMode === QueueRepeatMode.QUEUE) return interaction.editReply({ content: await `You must first disable the current music in the loop mode <(\`/loop Disable\`)> <${interaction.member}>... try again ? <❌>` })

				queue.setRepeatMode(QueueRepeatMode.TRACK)
				baseEmbed.setAuthor({ name: queue.repeatMode === QueueRepeatMode.TRACK ? await `Repeat mode enabled the current song will be repeated endlessly (you can end the loop with <\`/loop disable\` >)` : errorMessage })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'enable_autoplay': {
				if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) return interaction.editReply({ content: await `You must first disable the current music in the loop mode <(\`/loop Disable\`)> <${interaction.member}>... try again ? <❌>` })

				queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
				baseEmbed.setAuthor({ name: await `Autoplay enabled the queue will be automatically filled with similar songs to the current one <🔁>` })

				return interaction.editReply({ embeds: [baseEmbed] })
			}
		}
	}

}
