import articlesEn from '@/data/articles/en.json'
import articlesPt from '@/data/articles/pt.json'
import projectsEn from '@/data/projects/en.json'
import projectsPt from '@/data/projects/pt.json'
import journeyEn from '@/data/journey/en.json'
import journeyPt from '@/data/journey/pt.json'

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
