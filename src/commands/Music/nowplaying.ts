import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, GuildMember, InteractionCallback } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
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
	async nowplayingHandler (
		interaction: CommandInteraction,
		client: Client,
		data: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		const track = queue?.currentTrack

		if (!queue?.isPlaying() || !track) return interaction.editReply({ content: `❌ Aktuell wird keine Musik abgespielt <${interaction.member}...` })

		const methods = ['disabled', 'track', 'queue']
		const timestamp = track.duration
		const trackDuration = track.duration === 'Infinity' ? 'infinity (live)' : track.duration
		const progress = queue.node.createProgressBar()

		const embed = new EmbedBuilder()
			.setAuthor({ name: track.title, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
			.setThumbnail(track.thumbnail)
			.setDescription(await `Lautstärke **${queue.node.volume}**% \n Länge **${trackDuration}** \n Fortschritt ${progress} \n Schleifenmodus **${methods[queue.repeatMode] ? 'Aktiviert' : 'Deaktiviert'}**`)
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
