import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicBackCommand {

	@Slash({ name: 'back', description: 'Spiele vorheriges Lied ab' })

	@Guard(GuildOnly)
	async backHandler(
		interaction: CommandInteraction,
		client: Client
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		if (!queue?.isPlaying()) return interaction.editReply({ content: `Aktuell wird keine Musik abgespielt <${interaction.member}>... <❌>` })

		if (!queue.history.previousTrack) return interaction.editReply({ content: `Es gibt kein vorheriges Lied <${interaction.member}>... <❌>` })

		await queue.history.back()

		const backEmbed = new EmbedBuilder()
			.setAuthor({ name: await `Spiele vorheriges Lied.. <✅>` })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		interaction.editReply({ embeds: [backEmbed] })
	}

}
