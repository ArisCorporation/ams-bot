/* eslint-disable */
import type { BaseTranslation } from '../i18n-types'

const en = {
	GUARDS: {
		DISABLED_COMMAND: 'This command is currently disabled.',
		MAINTENANCE: 'This bot is currently in maintenance mode.',
		GUILD_ONLY: 'This command can only be used in a server.',
		NSFW: 'This command can only be used in a NSFW channel.',
	},
	ERRORS: {
		UNKNOWN: 'An unknown error occurred.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'No description provided.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Invite the bot to your server!',
			EMBED: {
				TITLE: 'Invite me on your server!',
				DESCRIPTION: '[Click here]({link}) to invite me!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Change the prefix of the bot.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'The new prefix of the bot.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefix changed to `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Set the maintenance mode of the bot.',
			EMBED: {
				DESCRIPTION: 'Maintenance mode set to `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Get some stats about the bot.',
			HEADERS: {
				COMMANDS: 'Commands',
				GUILDS: 'Guild',
				ACTIVE_USERS: 'Active Users',
				USERS: 'Users',
			},
		},
		HELP: {
			DESCRIPTION: 'Get global help about the bot and its commands',
			EMBED: {
				TITLE: 'Help panel',
				CATEGORY_TITLE: '{category} Commands',
			},
			SELECT_MENU: {
				TITLE: 'Select a category',
				CATEGORY_DESCRIPTION: '{category} commands',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member} Pong! The message round-trip took {time}ms.{heartbeat}',
		},
		APPLICATION: {
			MODAL_TITLE: 'Application',
			MODAL_INPUT_NAME: 'Name',
			MODAL_INPUT_REAL_NAME: 'Real Name',
			MODAL_INPUT_HANDLER: 'Handler',
			MODAL_INPUT_APPLICATION: 'Application',
			MODAL_INPUT_APPLICATION_PLACEHOLDER: 'Tell us about yourself!',
			CHANNEL_PREFIX: 'application',
			APPLICATION_PREFIX: 'Application from',
			ACCEPT: 'Accept',
			REJECT: 'Reject',
			APPLICATION_SUCCESS: 'Application successfully submitted!',
			ACCEPTED_MESSAGE: 'You have been accepted as an applicant!',
			REJECTED_MESSAGE: 'You have been rejected as an applicant!',
			ANNOUNCE_APPLICANT: `Hello everyone at ArisCorp,

we have <@{user_id}> as new applicant!`,
		},
		APPLICATION_INFO: {
			INFO: 'N/A',
			BUTTON_APPLY: 'Apply',
		},
	},
} satisfies BaseTranslation

export default en
