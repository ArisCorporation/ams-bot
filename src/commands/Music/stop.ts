import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import { QueryType, useMainPlayer, useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { musicConfig } from '@/configs'
import { Discord, Slash, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicStopCommand {

	@Slash({ name: 'stop', description: 'Stoppe die Musikwiedergabe' })
	@Guard(GuildOnly)
	async stopHandler (
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
			.setAuthor({ name: '✅ Musik gestoppt!' })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})

		return interaction.editReply({ embeds: [embed] })
	}

}