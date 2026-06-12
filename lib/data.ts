import articlesEn from '@/locales/articles/en.json'
import articlesPt from '@/locales/articles/pt.json'
import projectsEn from '@/locales/projects/en.json'
import projectsPt from '@/locales/projects/pt.json'
import journeyEn from '@/locales/journey/en.json'
import journeyPt from '@/locales/journey/pt.json'

const defaultLocale = 'pt'

const bundles: Record<string, Record<string, any>> = {
  articles: { en: articlesEn, pt: articlesPt },
  projects: { en: projectsEn, pt: projectsPt },
  journey: { en: journeyEn, pt: journeyPt },
}

function getBundle(resource: string, locale: string) {
  const resourceBundles = bundles[resource]
  if (!resourceBundles) {
    console.warn(`Unknown resource requested: ${resource}`)
    return null
  }

  if (locale && resourceBundles[locale]) return resourceBundles[locale]
  if (resourceBundles[defaultLocale]) return resourceBundles[defaultLocale]

  const first = Object.values(resourceBundles)[0]
  return first ?? null
}

export function getProjects(locale: string) {
  const bundle = getBundle('projects', locale)
  return bundle?.projects ?? []
}

export function getArticles(locale: string) {
  const bundle = getBundle('articles', locale)
  return bundle?.articles ?? []
}

export function getExperience(locale: string) {
  const bundle = getBundle('journey', locale)
  return bundle?.experience ?? []
}

export default {
  getProjects,
  getArticles,
  getExperience,
}
