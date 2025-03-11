import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash, SlashChoice, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicSaveCommand {

	@Slash({ name: 'save', description: 'Speichere dir das aktuelle Lied' })

	@Guard(GuildOnly)
	async saveHandler(
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		const errorMessage = await `❌ Es ist ein Fehler aufgetreten <${interaction.member}>...`
		const baseEmbed = new EmbedBuilder()
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

			if (!queue?.isPlaying()) return interaction.editReply({ content: `❌ Aktuell wird keine Musik abgespielt <${interaction.member}>...` })

		// @ts-expect-error
		switch (interaction.options._hoistedOptions.map(x => x.value).toString()) {
			case 'enable_loop_queue': {
				if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.editReply({ content: `❌ Der Schleifenmodus ist bereits aktiviert! ${interaction.member}` })

				queue.setRepeatMode(QueueRepeatMode.QUEUE)
				baseEmbed.setAuthor({ name: queue.repeatMode === QueueRepeatMode.QUEUE ? await `Der Schleifenmodus wurde auf die gesamte Warteschlange angewendet (🔁)` : errorMessage })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'disable_loop': {
				if (queue.repeatMode === QueueRepeatMode.OFF) return interaction.editReply({ content: await `❌ Der Schleifenmodus ist bereits deaktiviert! ${interaction.member}` })

				queue.setRepeatMode(QueueRepeatMode.OFF)
				baseEmbed.setAuthor({ name: await `Der Schleifenmodus wurde deaktiviert (🔁)` })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'enable_loop_song': {
				if (queue.repeatMode === QueueRepeatMode.QUEUE) return interaction.editReply({ content: `❌ Der Schleifenmodus ist bereits aktiviert! ${interaction.member}` })

				queue.setRepeatMode(QueueRepeatMode.TRACK)
				baseEmbed.setAuthor({ name: queue.repeatMode === QueueRepeatMode.TRACK ? `Der Schleifenmodus wurde auf das aktuelle Lied angewendet!` : errorMessage })

				return interaction.editReply({ embeds: [baseEmbed] })
			}

			case 'enable_autoplay': {
				if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) return interaction.editReply({ content: `❌ Der Schleifenmodus ist bereits aktiviert! ${interaction.member}` })

				queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
				baseEmbed.setAuthor({ name: `Autoplay aktiviert. Die Warteschlange wird nun automatisch mit ähnlichen Liedern gefüllt (🔁)` })

				return interaction.editReply({ embeds: [baseEmbed] })
			}
		}
	}

}
