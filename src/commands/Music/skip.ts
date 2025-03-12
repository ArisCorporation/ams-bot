import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicSkipCommand {

	@Slash({ name: 'skip', description: 'Spiele das nächste Lied ab' })

	@Guard(GuildOnly)
	async skipHandler(
		interaction: CommandInteraction,
		client: Client
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		if (!queue?.isPlaying()) return interaction.editReply({ content: `:x: Aktuell wird keine Musik abgespielt <${interaction.member}...` })

		if (!queue.history.nextTrack) return interaction.editReply({ content: `:x: Es gibt kein nächstes Lied <${interaction.member}...` })

		await queue.history.next()

		const embed = new EmbedBuilder()
			.setAuthor({ name: await `:white_check_mark: Spiele nächstes Lied...` })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		interaction.editReply({ embeds: [embed] })
	}

}
