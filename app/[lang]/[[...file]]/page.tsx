import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fileList, resolveFile, defaultFile } from "@/lib/file-registry"
import { locales } from "@/lib/utils"
import HomeClient from "./home-client"

type Params = Promise<{ lang: string; file?: string[] }>

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    fileList.map((file) => ({
      lang,
      file: file.id === defaultFile ? [] : [file.id],
    }))
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await params
  const fileId = resolved.file?.[0] ?? defaultFile
  const entry = resolveFile(fileId)

  if (!entry) return { title: "Not found" }
  return { title: entry.title }
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await params
  const fileId = resolved.file?.[0] ?? defaultFile
  const entry = resolveFile(fileId)

  if (!entry) notFound()

  return <HomeClient fileId={entry.id} />
}
