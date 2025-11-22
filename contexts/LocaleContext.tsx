"use client"

import { createContext, useContext, ReactNode } from 'react'

interface LocaleContextType {
  dictionary: any
  locale: string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children, dictionary, locale }: { children: ReactNode; dictionary: any; locale: string }) {
  return (
    <LocaleContext.Provider value={{ dictionary, locale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
