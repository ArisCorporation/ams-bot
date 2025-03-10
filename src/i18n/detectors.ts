import { generalConfig } from '@/configs'
import { resolveLocale } from '@/utils/functions'

import { detectLocale } from './i18n-util'

function allInteractionsLocaleDetector(interaction: AllInteractions) {
	return () => {
		let locale = resolveLocale(interaction)

		if (['de-DE'].includes(locale))
			locale = 'de'
		else if (locale === 'default')
			locale = generalConfig.defaultLocale

		return [locale]
	}
}

export const getLocaleFromInteraction = (interaction: AllInteractions) => detectLocale(allInteractionsLocaleDetector(interaction))
