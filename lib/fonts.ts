import localFont from "next/font/local"
import { JetBrains_Mono } from "next/font/google"

export const geist = localFont({
  src: "../public/fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-primary",
  display: "swap",
  weight: "400 700",
  style: "normal",
})

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})
