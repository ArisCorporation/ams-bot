import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicHistoryCommand {

	@Slash({ name: 'history', description: 'Spiele vorheriges Lied ab' })

	@Guard(GuildOnly)
	async historyHandler(
		interaction: CommandInteraction,
		client: Client
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')

		if (!queue || queue.history.tracks.toArray().length === 0) return interaction.editReply({ content: 'Bisher wurde noch keine Musik gespielt' })

		const tracks = queue.history.tracks.toArray()

		const description = tracks
			.slice(0, 20)
			.map((track, index) => {
				return `**${index + 1}.** [${track.title}](${track.url}) von **${track.author}**`
			})
			.join('\r\n\r\n')

		const historyEmbed = new EmbedBuilder()
			.setTitle(`Verlauf`)
			.setDescription(description)
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		interaction.editReply({ embeds: [historyEmbed] })
	}

}
