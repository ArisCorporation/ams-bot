import { env } from '@/env'

export const ariscorpConfig: ArisCorpConfigType = {
	roles: {
		foundersgroup: env.FOUNDERS_ROLE_ID,
		management: env.MANAGEMENT_ROLE_ID,
	},
}
