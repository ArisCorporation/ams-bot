import { env } from '@/env'

export const musicConfig: MusicConfigType = {
	DJ: {
		enabled: false,
		roleName: '',
		commands: [],
	},
	Translate_Timeout: 10000,
	maxVol: 100,
	spotifyBridge: true,
	volume: 25,
	leaveOnEmpty: true,
	leaveOnEmptyCooldown: 30000,
	leaveOnEnd: true,
	leaveOnEndCooldown: 30000,
	discordPlayer: {
		ytdlOptions: {
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
		},
	},
}
