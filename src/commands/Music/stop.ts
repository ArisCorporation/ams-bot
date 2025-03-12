import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicStopCommand {

	@Slash({ name: 'stop', description: 'Stoppe die Musikwiedergabe' })
	@Guard(GuildOnly)
	async stopHandler(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Aktuell wird keine Musik abgespielt` })

		queue.delete()

		const embed = new EmbedBuilder()
			.setAuthor({ name: ':white_check_mark: Musik gestoppt!' })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})

		return interaction.editReply({ embeds: [embed] })
	}

}