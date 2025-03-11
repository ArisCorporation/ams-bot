import { Category } from '@discordx/utilities'
import { ButtonInteraction, CommandInteraction, EmbedBuilder, ModalSubmitInteraction, TextChannel } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, ComponentOptions, Guard } from 'discordx'

import { ButtonComponent, Discord, ModalComponent, Slash } from '@/decorators'
import { env } from '@/env'
import { GuildOnly } from '@/guards'
import { getLocaleFromInteraction, L } from '@/i18n'
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
		if (!queue?.isPlaying()) return interaction.editReply({ content: `❌ Aktuell wird keine Musik abgespielt ${interaction.member}...` })

		if (!queue.tracks.toArray()[1]) return interaction.editReply({ content: `❌ Es gibt keine weiteren Lieder in der Warteschlange ${interaction.member}...` })

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
