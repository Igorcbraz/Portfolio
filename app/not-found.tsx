"use client"

import Link from "next/link"
import { sendGAEvent } from '@next/third-parties/google'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          Opa! Não conseguimos encontrar a página que você está procurando.<br />
          Ela pode ter sido removida ou o endereço está incorreto.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
          onClick={() => sendGAEvent('event', 'not_found_home_click', { label: '404 Home Button' })}
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  )
}
