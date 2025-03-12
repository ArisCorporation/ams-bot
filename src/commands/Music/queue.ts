import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash, SlashOption } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicQueueCommand {

	@Slash({ name: 'queue', description: 'Zeigt die Warteschlange' })
	@Guard(GuildOnly)
	async queueHandler(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply()

		const queue = useQueue(interaction.guild || '')
		if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Aktuell wird keine Musik abgespielt` })
		if (!queue.tracks.toArray()[0]) return interaction.editReply({ content: 'Es wird aktuell das einzige Lied in der Wartechlange gespielt' })

		const methods = ['', ':repeat:', '🔂']
		const songs = queue.tracks.size

		const nextSongs = songs > 5 ? `Und **${songs - 5}** andere Lieder...` : `In der Warteschlange **${songs}** Lieder...`
		const tracks = queue.tracks.toArray()

		const embed = new EmbedBuilder()
			.setColor(getColor('primary'))
			.setAuthor({ name: `Warteschlange - ${methods[queue.repeatMode]}`, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
			.setTitle(`Aktuell: ${queue.currentTrack?.title || 'N/A'}`)
			.setDescription(`${tracks.slice(0, 5).map((t, index) => `**${index + 1}.** [${t.title}](${t.url}) von **${t.author}**`).join('\r\n\r\n')} \n\n ${nextSongs}`)
			.setTimestamp()
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})

		return interaction.editReply({ embeds: [embed] })
	}

}