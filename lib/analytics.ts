import { sendGAEvent } from "@next/third-parties/google"

export type GAEventAction =
  | "click"
  | "submit_form"
  | "generate_lead"
  | "view_item"
  | "select_content"
  | "download"
  | "share"
  | "login"
  | "search"
  | "toggle_theme"
  | "toggle_ide"
  | "change_language"

export interface GAEventParams {
  category?: string
  label?: string
  value?: number
  [key: string]: any
}

export const trackEvent = (action: GAEventAction, params?: GAEventParams) => {
  if (typeof window !== "undefined") {
    if (params) {
      sendGAEvent("event", action, params)
    } else {
      sendGAEvent("event", action)
    }
  }
}


export const analytics = {
  trackClick: (label: string, category: string = "general") => {
    trackEvent("click", { category, label })
  },

  trackFormSubmission: (formName: string, success: boolean = true) => {
    trackEvent(success ? "generate_lead" : "submit_form", {
      category: "form",
      label: formName,
      status: success ? "success" : "error"
    })
  },

  trackThemeChange: (theme: string) => {
    trackEvent("toggle_theme", { category: "preferences", label: theme })
  },
  trackLanguageChange: (lang: string) => {
    trackEvent("change_language", { category: "preferences", label: lang })
  },
  trackIDEInteraction: (action: "open" | "close" | "change_theme", details?: string) => {
    trackEvent("toggle_ide", { category: "ide", label: action, details })
  },

  trackProjectView: (projectName: string) => {
    trackEvent("view_item", { category: "projects", label: projectName })
  },
  trackArticleView: (articleTitle: string) => {
    trackEvent("view_item", { category: "articles", label: articleTitle })
  },

  trackDownload: (fileName: string) => {
    trackEvent("download", { category: "engagement", label: fileName })
  },

  trackSocialClick: (network: string) => {
    trackEvent("click", { category: "social", label: network })
  }
}
