import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import { QueryType, useMainPlayer } from 'discord-player'
import { Client, Guard } from 'discordx'

import { musicConfig } from '@/configs'
import { Discord, Slash, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicClearCommand {

	@Slash({ name: 'play', description: 'Spiele ein Song ab' })
	@Guard(GuildOnly)
	async playHandler(
    @SlashOption({ name: 'song', type: ApplicationCommandOptionType.String, required: true }) song: string,
    	interaction: CommandInteraction,
    	client: Client,
    	{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const player = useMainPlayer()
		const member = interaction.member as GuildMember

		const res = await player.search(song, {
			requestedBy: member,
			searchEngine: QueryType.AUTO,
		})

		const defaultEmbed = new EmbedBuilder()
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})

		if (!res?.tracks.length) {
			defaultEmbed.setAuthor({ name: 'Keine Ergebnisse gefunden' })

			return interaction.editReply({ embeds: [defaultEmbed] })
		}

		try {
			if (member.voice.channel) {
				const { track } = await player.play(member.voice.channel, song, {
					nodeOptions: {
						metadata: {
							channel: interaction.channel as TextChannel,
						},
						volume: musicConfig.volume,
						leaveOnEmpty: musicConfig.leaveOnEmpty,
						leaveOnEmptyCooldown: musicConfig.leaveOnEmptyCooldown,
						leaveOnEnd: musicConfig.leaveOnEnd,
						leaveOnEndCooldown: musicConfig.leaveOnEndCooldown,
					},
				})

				defaultEmbed.setAuthor({ name: `Lied <${track.title}> zur Warteschlange hinzugefügt <✅>`, iconURL: track.thumbnail })

				return interaction.editReply({ embeds: [defaultEmbed] })
			} else {
				defaultEmbed.setAuthor({ name: 'Du bist nicht in einem Sprachkanal' })

				return interaction.editReply({ embeds: [defaultEmbed] })
			}
		} catch (error) {
			console.error(`Play error: ${error}`)
			defaultEmbed.setAuthor({ name: 'Ich kann dem Kanal nich beitreten' })

			return interaction.editReply({ embeds: [defaultEmbed] })
		}
	}

}