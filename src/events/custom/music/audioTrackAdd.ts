import { EmbedBuilder } from 'discord.js'
import { Client } from 'discordx'

import { Discord, OnCustom } from '@/decorators'
import { getColor } from '@/utils/functions'

@Discord()
export default class MusicTrackAddEvent {

	// =============================
	// ========= Handlers ==========
	// =============================

	@OnCustom('musicTrackAdd')
	async MusicTrackAddHandler(
		[queue, track]: [any, any],
		client: Client
	) {
		const embed = new EmbedBuilder()
			.setAuthor({ name: await `Lied <${track.title}> zur Warteschlange hinzugefügt <:white_check_mark:>`, iconURL: track.thumbnail })
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		queue.metadata.channel.send({ embeds: [embed] })
	}

}
