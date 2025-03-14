import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import { QueryType, useMainPlayer } from 'discord-player'

import { Client, Guard } from 'discordx'

import { musicConfig } from '@/configs'
import { Discord, Slash, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'
const player = useMainPlayer()

@Discord()
@Category('General')
export default class MusicPlayCommand {
	
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

		const member = interaction.member as GuildMember

		const res = await player.search(song, {
			requestedBy: member,
			searchEngine: QueryType.AUTO,
		})

		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'Zur Warteschlange hinzugefügt:',
				iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
			})
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})

		if (!res?.tracks.length) {
			embed.setAuthor({ name: 'Keine Ergebnisse gefunden' })

			return interaction.editReply({ embeds: [embed] })
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

				embed
					.setTitle(track.title)
					.setURL(track.url)
					.setThumbnail(track.thumbnail)
					.setFields([
						{
							name: ':microphone: Interpreter',
							value: track.author,
							inline: false,
						},
						{
							name: ':hourglass: Länge',
							value: `${track.duration} Minuten`,
							inline: true,
						},
						{
							name: ':eyes: Aufrufe',
							value: `\`${Number(track.views).toLocaleString()}\``,
							inline: true,
						},
						{
							name: ':control_knobs: Abgespielt von',
							value: `<@${interaction.user.id || ''}>`,
							inline: true,
						},
					])

				return interaction.editReply({ embeds: [embed] })
			} else {
				embed.setAuthor({ name: 'Du bist nicht in einem Sprachkanal' })

				return interaction.editReply({ embeds: [embed] })
			}
		} catch (error) {
			console.error(`Play error: ${error}`)
			embed.setAuthor({ name: 'Ich kann dem Kanal nich beitreten' })

			return interaction.editReply({ embeds: [embed] })
		}
	}

}