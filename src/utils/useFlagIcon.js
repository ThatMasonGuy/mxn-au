// utils/useFlagIcon.js
import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(en)

export function useFlagIcon(countryName) {
  if (!countryName) return ''
  try {
    const code = countries.getAlpha2Code(countryName.trim(), 'en')
    return code ? `fi fi-${code.toLowerCase()}` : ''
  } catch (e) {
    return ''
  }
}
