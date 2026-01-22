export const locales = ["en", "pt"] as const
export const defaultLocale = "en"

export type Locale = typeof locales[number]
