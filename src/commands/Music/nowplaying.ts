import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicNPCommand {

	@Slash({ name: 'nowplaying', description: 'Sieh welches Lied gerade gespielt wird!' })
	@Slash({ name: 'np', description: 'Sieh welches Lied gerade gespielt wird!' })
	@Guard(GuildOnly)
	async nowplayingHandler(
		interaction: CommandInteraction,
		client: Client,
		data: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		const track = queue?.currentTrack

		if (!queue?.isPlaying() || !track) return interaction.editReply({ content: `:x: Aktuell wird keine Musik abgespielt <${interaction.member}...` })

		const methods = ['disabled', 'track', 'queue']
		const timestamp = track.duration
		const trackDuration = track.duration === 'Infinity' ? 'infinity (live)' : track.duration
		const progress = queue.node.createProgressBar()

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Aktuelles Lied:', iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
			.setTitle(track.title)
			.setURL(track.url)
			.setThumbnail(track.thumbnail)
			.setDescription(await `Lautstärke **${queue.node.volume}**% \n Länge **${trackDuration}** \n Fortschritt ${progress} \n Schleifenmodus **${methods[queue.repeatMode] ? 'Aktiviert' : 'Deaktiviert'}**`)
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
				{ name: ':globe_with_meridians: Lied URL', value: `\`${queue.currentTrack.url}\`` },
			])
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		const saveButton = new ButtonBuilder()
			.setLabel('Lied speichern')
			.setCustomId('savetrack')
			.setStyle(ButtonStyle.Danger)

		const loop = new ButtonBuilder()
			.setLabel('Schleife')
			.setCustomId('loop')
			.setStyle(ButtonStyle.Danger)

		const resumepause = new ButtonBuilder()
			.setLabel('Play / Pause')
			.setCustomId('resume&pause')
			.setStyle(ButtonStyle.Success)

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(resumepause, loop, saveButton)
		interaction.editReply({ embeds: [embed], components: [row] })
	}

}
