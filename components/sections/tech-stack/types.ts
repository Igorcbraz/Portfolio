import { ComponentType } from "react"

export type Category = "Frontend" | "Backend" | "Mobile" | "Database" | "DevOps" | "Tools"

export interface Technology {
  name: string
  icon: ComponentType<any>
}

export interface CategoryInfo {
  name: Category
  icon: ComponentType<any>
  code: string
}
