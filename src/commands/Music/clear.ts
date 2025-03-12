import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, ComponentOptions, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicClearCommand {

	@Slash({ name: 'clear', description: 'Lösche alle Lieder in der Warteschlange' })

	@Guard(GuildOnly)
	async clearHandler(
		interaction: CommandInteraction,
		client: Client
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		if (!queue?.isPlaying()) return interaction.editReply({ content: `:x: Aktuell wird keine Musik abgespielt ${interaction.member}...` })

		if (!queue.tracks.toArray()[1]) return interaction.editReply({ content: `:x: Es gibt keine weiteren Lieder in der Warteschlange ${interaction.member}...` })

		await queue.tracks.clear()

		const backEmbed = new EmbedBuilder()
			.setAuthor({ name: await `🗑️ Die Warteschlange wurde geleert!` })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		interaction.editReply({ embeds: [backEmbed] })
	}

}
