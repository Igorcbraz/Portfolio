import localFont from "next/font/local"
import { Space_Grotesk } from "next/font/google"

export const geist = localFont({
  src: "../public/fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-primary",
  display: "swap",
  weight: "400 700",
  style: "normal",
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})
