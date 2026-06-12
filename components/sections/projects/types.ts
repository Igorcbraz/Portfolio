export interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  highlights: string[]
  metrics?: Array<{
    label: string
    value: string
    description: string
  }>
  technologies: string[]
  link: string
  featured?: boolean
}
