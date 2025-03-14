/* eslint-disable */
import type { Translation } from '../i18n-types'

const de = {
	GUARDS: {
		DISABLED_COMMAND: 'Dieser Befehl ist aktuell deaktiviert.',
		MAINTENANCE: 'Der Bot ist aktuell im Wartungsmodus.',
		GUILD_ONLY: 'Dieser Befehl kann nur in einem Server benutzt werden.',
		NSFW: 'Dieser Befehl kann nur in einem NSFW-Kanal benutzt werden.',
	},
	ERRORS: {
		UNKNOWN: 'An unknown error occurred.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Keine Beschreibung vorhanden.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Lade den Bot zu deinem Server ein!',
			EMBED: {
				TITLE: 'Lade mich zu deinem Server ein!',
				DESCRIPTION: '[Click here]({link}) um mich einzuladen!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Ändere den Prefix des Bots.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'Der neue Prefix des Bots.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefix geändert zu `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Setze den Wartungsmodus des Bots.',
			EMBED: {
				DESCRIPTION: 'Wartungsmodus gesetzt auf `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Zeige Statistiken des Bots.',
			HEADERS: {
				COMMANDS: 'Befehle',
				GUILDS: 'Server',
				ACTIVE_USERS: 'Aktive Benutzer',
				USERS: 'Benutzer',
			},
		},
		HELP: {
			DESCRIPTION: 'Bekomme die globale Hilfe über den Bot und seine Befehle',
			EMBED: {
				TITLE: 'Hilfe Panel',
				CATEGORY_TITLE: '{category} Commands',
			},
			SELECT_MENU: {
				TITLE: 'Wähle eine Kategorie',
				CATEGORY_DESCRIPTION: '{category} commands',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member} Pong! Die Antwort hat {time}ms.{heartbeat} gebraucht',
		},
		APPLICATION: {
			MODAL_TITLE: 'Bewerbung',
			MODAL_INPUT_NAME: 'Fiktiver Name',
			MODAL_INPUT_HANDLER: 'RSI Handle',
			MODAL_INPUT_APPLICATION: 'Bewerbung',
			MODAL_INPUT_APPLICATION_PLACEHOLDER: 'Erzähle uns etwas über dich!',
			CHANNEL_PREFIX: 'bewerbung',
			APPLICATION_PREFIX: 'Bewerbung von',
			ACCEPT: 'Akzeptieren',
			REJECT: 'Ablehnen',
			APPLICATION_SUCCESS: 'Bewerbung erfolgreich eingereicht!',
			MODAL_INPUT_REAL_NAME: 'Realer Vorname',
			ACCEPTED_MESSAGE: `**Herzlichen Glückwunsch, deine Bewerbung wurde angenommen!
Willkommen in der ArisCorp!**`,
			REJECTED_MESSAGE: 'Leider wurde deine Bewerbung abgelehnt.',
			ANNOUNCE_APPLICANT: `Hallo an alle Mitarbeiter der ArisCorp,

wir haben <@{user_id}> als neuen Anwärter gewonnen. Heißt ihn herzlich willkommen!`,
		},
		APPLICATION_INFO: {
			INFO: `🎚️ • Benutzung:

• Klicke auf "Bewerben", oder gebe den Befehl "/bewerben" ein.
• Nun öffnet sich ein Pop-Up in dem du folgende Infos eingibst:
  **-** Deinen fiktiven Namen (optional, dein echter Name)
  **-** Deinen RSI-Handle
  **-** Deine Bewerbung
• Nachdem du auf "Absenden" klickst, öffnet sich ein Kanal mit deiner Bewerbung.
• Jemand von unserem Recruitment-Team wird schnellstmöglich mit dir in Kontakt treten.

» **INFORMATION: Die ArisCorp hat eine Charter. Wir erwarten von jedem, der Teil der ArisCorp werden will, dass die Charter beachtet wird.**
*Diese ist unter https://ariscorp.de zu finden*

» Bitte habe Verständnis dafür, dass es zu Verzögerungen kommen kann. Du kannst jederzeit deine Bewerbung einsenden und sie bleibt so lange bestehen, bis sich jemand darum kümmert.`,
			BUTTON_APPLY: 'Bewerben',
		},
	},
} satisfies Translation

export default de
