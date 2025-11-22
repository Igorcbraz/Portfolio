import Link from "next/link"
import { getDictionary } from "@/lib/utils"
import { defaultLocale } from "@/proxy"

export default async function NotFound({ params }: { params?: { lang?: string } }) {
  const lang = params?.lang ?? defaultLocale
  const dictionary = await getDictionary(lang)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">{dictionary.notFound.title}</h2>
        <p className="text-muted-foreground mb-6">
          {dictionary.notFound.message1}
          <br />
          {dictionary.notFound.message2}
        </p>
        <Link
          href={`/${lang}`}
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        >
          {dictionary.notFound.backToHome}
        </Link>
      </div>
    </main>
  )
}
