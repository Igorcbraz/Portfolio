import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const locales = ["en", "pt"]
const defaultLocale = "en"

export async function getDictionary(lang: string) {
  const toLoad = locales.includes(lang) ? lang : defaultLocale
  return (await import(`../locales/${toLoad}.json`)).default
}
