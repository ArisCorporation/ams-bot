import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Client, ComponentOptions } from 'discordx'

import { ButtonComponent, Discord, ModalComponent, Slash } from '@/decorators'
import { getColor } from '@/utils/functions'

@Discord()
@Category('General')
export default class PingCommand {

	@ButtonComponent({ id: 'acceptApplication' })
	async handleAcceptButton(interaction: ButtonInteraction): Promise<void> {
		// Process the acceptance here, then send a response
	}

	@ButtonComponent({ id: 'rejectApplication' })
	async handleRejectButton(interaction: ButtonInteraction): Promise<void> {
		// Process the rejection here, then send a response
	}

	@Slash({
		name: 'application',
	})
	async application(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		// Create a new modal
		const modal = new ModalBuilder()
			.setCustomId('applicationModal')
			.setTitle(localize.COMMANDS.APPLICATION.MODAL_TITLE())

		// Name Input
		const nameInput = new TextInputBuilder()
			.setCustomId('modalNameInput')
			.setLabel(localize.COMMANDS.APPLICATION.MODAL_INPUT_NAME())
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Chris Roberts')
			.setRequired(true)

		// Handle Input
		const handleInput = new TextInputBuilder()
			.setCustomId('modalHandleInput')
			.setLabel(localize.COMMANDS.APPLICATION.MODAL_INPUT_HANDLER())
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Chris_Roberts')
			.setRequired(false)

		// Application Input
		const applicationInput = new TextInputBuilder()
			.setCustomId('modalApplicationInput')
			.setLabel(localize.COMMANDS.APPLICATION.MODAL_INPUT_APPLICATION())
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder(localize.COMMANDS.APPLICATION.MODAL_INPUT_APPLICATION_PLACEHOLDER())
			.setRequired(true)

		// Add the inputs to the modal
		modal.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
			new ActionRowBuilder<TextInputBuilder>().addComponents(handleInput),
			new ActionRowBuilder<TextInputBuilder>().addComponents(applicationInput)
		)

		// --- snip ---

		// Present the modal to the user
		await interaction.showModal(modal)
	}

	@ModalComponent({ id: 'applicationModal' } as ComponentOptions)
	async applicationForm(interaction: ModalSubmitInteraction, { localize }: InteractionData): Promise<void> {
		// Retrieve values from the modal
		const [name, handle, application] = ['modalNameInput', 'modalHandleInput', 'modalApplicationInput'].map(id => interaction.fields.getTextInputValue(id))

		// Create a new text channel for the application
		const channel = await interaction.guild?.channels.create({
			name: `${localize.COMMANDS.APPLICATION.CHANNEL_PREFIX()}-${name}`,
			type: ChannelType.GuildText,
			topic: `${localize.COMMANDS.APPLICATION.APPLICATION_PREFIX()} ${name}`,
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone.id,
					deny: ['ViewChannel'],
				},
				{
					id: interaction.user.id,
					allow: ['ViewChannel'],
				},
				{
					id: '739029001682550784',
					allow: ['ViewChannel'],
				},
			],
		})

		if (!channel) {
			await interaction.reply('Failed to create application channel.')

			return
		}

		const applicationChannel = channel as TextChannel

		// Build the embed with the application details
		const applicationEmbed = new EmbedBuilder()
			.setAuthor({
				name: 'ArisCorp Management System',
				url: 'https://ams.ariscorp.de',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTitle(`${localize.COMMANDS.APPLICATION.APPLICATION_PREFIX()} ${name}`)
			.setDescription(application)
			.addFields(
				{
					name: 'RSI Handle',
					value: handle ? handle.trim() : 'N/A',
					inline: true,
				},
				{
					name: 'Discord Name',
					value: interaction.user.username,
					inline: true,
				}
			)
			.setThumbnail('https://cms.ariscorp.de/assets/3090187e-6348-4290-a878-af1b2b48c114')
			.setColor(getColor('primary'))
			.setFooter({
				text: 'ArisCorp Management System',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTimestamp()

		// Create buttons to add to the embed message
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('acceptApplication')
				.setLabel(localize.COMMANDS.APPLICATION.ACCEPT())
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('rejectApplication')
				.setLabel(localize.COMMANDS.APPLICATION.REJECT())
				.setStyle(ButtonStyle.Danger)
		)

		// Send the embed and buttons in the newly created channel
		await applicationChannel.send({ embeds: [applicationEmbed], components: [actionRow] })

		// Acknowledge the modal submission with an ephemeral reply.
		await interaction.reply({ content: localize.COMMANDS.APPLICATION.APPLICATION_SUCCESS(), ephemeral: true })
	}

}
