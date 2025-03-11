import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicBackCommand {

	@Slash({ name: 'nowplaying', description: 'Sieh welches Lied gerade gespielt wird!' })

	@Guard(GuildOnly)
	async nowplayingHandler(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		const track = queue?.currentTrack

		if (!queue?.isPlaying() || !track) return interaction.editReply({ content: await `No music currently playing <${interaction.member}>... try again ? <❌>` })

		const methods = ['disabled', 'track', 'queue']
		const timestamp = track.duration
		const trackDuration = track.duration === 'Infinity' ? 'infinity (live)' : track.duration
		const progress = queue.node.createProgressBar()

		const embed = new EmbedBuilder()
			.setAuthor({ name: track.title, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
			.setThumbnail(track.thumbnail)
			.setDescription(await `Volume <**${queue.node.volume}**%> <\n> <Duration **${trackDuration}**> <\n> Progress <${progress}> <\n >Loop mode <**${methods[queue.repeatMode]}**> <\n>Requested by <${track.requestedBy}>`)
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		const saveButton = new ButtonBuilder()
			.setLabel('Save this track')
			.setCustomId('savetrack')
			.setStyle(ButtonStyle.Danger)

		const volumeup = new ButtonBuilder()
			.setLabel('Volume Up')
			.setCustomId('volumeup')
			.setStyle(ButtonStyle.Primary)

		const volumedown = new ButtonBuilder()
			.setLabel('Volume Down')
			.setCustomId('volumedown')
			.setStyle(ButtonStyle.Primary)

		const loop = new ButtonBuilder()
			.setLabel('Loop')
			.setCustomId('loop')
			.setStyle(ButtonStyle.Danger)

		const resumepause = new ButtonBuilder()
			.setLabel('Resume <&> Pause')
			.setCustomId('resume&pause')
			.setStyle(ButtonStyle.Success)

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(volumedown, resumepause, volumeup, loop, saveButton)
		interaction.editReply({ embeds: [embed], components: [row] })
	}

}
