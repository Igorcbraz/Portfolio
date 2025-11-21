"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-background border-t border-border/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              <span className="text-primary">Igor</span> Braz
            </h3>
            <p className="text-sm text-muted-foreground">
              Experiências digitais premium criadas com paixão e precisão.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Início", id: "hero" },
                { label: "Jornada", id: "journey" },
                { label: "GitHub", id: "github" },
                { label: "Projetos", id: "projects" },
                { label: "Artigos", id: "articles" },
                { label: "Stack", id: "stack" },
                { label: "Contato", id: "contact" },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">Redes</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "GitHub", url: "https://github.com/igorbraz" },
                { name: "LinkedIn", url: "https://linkedin.com/in/igorbraz" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">Vamos conversar</h4>
            <p className="text-sm text-muted-foreground mb-4">Pronto para tirar suas ideias do papel?</p>
            <a href="#contact" className="w-full block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg transition-all text-center">
              Entrar em contato
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} Igor Braz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
