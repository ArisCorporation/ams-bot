import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
import { useQueue } from 'discord-player'
import { Client, Guard } from 'discordx'

import { Discord, Slash } from '@/decorators'
import { GuildOnly } from '@/guards'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class MusicSaveCommand {

	@Slash({ name: 'save', description: 'Speichere dir das aktuelle Lied' })

	@Guard(GuildOnly)
	async saveHandler(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		// Defer the reply immediately to prevent timeouts
		await interaction.deferReply({ ephemeral: true })

		const queue = useQueue(interaction.guild || '')

		if (!queue?.isPlaying() || !queue.currentTrack) return interaction.editReply({ content: `:x: Aktuell wird keine Musik abgespielt <${interaction.member}>...` })

		const embed = new EmbedBuilder()
			.setColor(getColor('primary'))
			.setAuthor({ name: 'Gespeichertes Lied' })
			.setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
			.setURL(queue.currentTrack.url)
			.addFields(
				{
					name: ':microphone: Interpreter',
					value: queue.currentTrack.author,
					inline: false,
				},
				{ name: ':hourglass: Länge', value: `\`${queue.currentTrack.duration}\``, inline: true },
				{ name: ':eyes: Aufrufe', value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
				{ name: ':control_knobs: Abgespielt von', value: `\`${queue.currentTrack.requestedBy}\``, inline: true },
				{ name: ':globe_with_meridians: Lied URL', value: `\`${queue.currentTrack.url}\`` }
			)
			.setThumbnail(queue.currentTrack.thumbnail)
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		await (interaction.member as GuildMember).send({ embeds: [embed] })
			.then(async () => {
				return interaction.editReply({ content: `:white_check_mark: Ich habe dir eine Privatnachricht geschickt!` })
			}).catch(async () => {
				return interaction.editReply({ content: `:x: Ich kann dir leider keine Privatnachricht schicken..` })
			})
	}

}
