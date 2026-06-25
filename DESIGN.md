# Design System — Igor Braz Portfolio

> Documento de referência para manter consistência visual em todas as alterações futuras.
> Baseado no redesign do Hero, componente `3d-shape` e Navigation (Junho 2026).
> Atualizado com a camada de Animações de Texto via React Bits (Junho 2026).
> Atualizado com lições de implementação React Bits — conflitos `bg-clip-text` e `IntersectionObserver` (Junho 2026).

---

## Filosofia de Design

**Estilo:** Premium SaaS americano — dark tech, minimalista e altamente sofisticado.
Sensação de produto de alto nível, interativo e tecnológico. **O design não deve parecer um portfólio genérico, mas sim o cockpit de um sistema moderno.**

**Princípios Fundamentais:**
- **Inovação e Profissionalismo** — Elementos devem surpreender pela qualidade técnica, sempre mantendo um tom sóbrio e voltado para negócios/tech.
- **Evite a todo custo a Estética Infantil** — Proibido o uso de cores "arco-íris" soltas, formas excessivamente redondas ou parecidas com desenhos animados, e interfaces demasiadamente divertidas. O foco é ser *sleek* e maduro.
- **Contexto e Background Rico** — Nenhum elemento deve existir no vácuo. Todo componente inovador (como modelos 3D ou radares) deve ter um ecossistema ao seu redor: grids sutis, backgrounds elaborados (porém escuros), reflexos, e HUDs (Heads Up Displays) de suporte que integrem a UI.
- **Uso Inteligente de 3D e Perspectiva** — O uso de tecnologias como Three.js e manipulação de Canvas 2D com perspectivas isométricas/top-down enriquece o portfólio, trazendo profundidade real ao invés de designs planos convencionais.
- **Animações Elaboradas, mas Fluídas** — As animações devem simular comportamentos do mundo real (ex: rastro de fósforo de um radar CRT) e transições elegantes de software premium. Duração 150–400ms para UI básica, ou loops infinitos bem controlados.
- **Consistência Absoluta** — Tudo usa os tokens do design system. Menos é mais na interface geral para dar palco aos elementos interativos complexos.
- **Corte Preciso** — CTAs principais e modais técnicos usam border radius zero ou mínimo, transmitindo precisão.

---

## Regra de Implementação — Tailwind Obrigatório

> ⚠️ **REGRA CRÍTICA ABSOLUTA:** Use **Tailwind CSS** para toda estilização. **É TERMINANTEMENTE PROIBIDO o uso de `style={{}}` inline para cores, backgrounds, sombras, tipografia, bordas ou qualquer propriedade estética estática.**

Se você tiver valores dinâmicos de cor ou estilos baseados em JS (ex: cores de linguagens de programação), **NÃO use style inline**. Mapeie esses valores para classes do Tailwind em um objeto e aplique via `className`.

### Prioridade de uso

| Situação | Abordagem |
|---|---|
| Layout, espaçamento, cores, tipografia, sombras | **Tailwind classes** (ex: `bg-[oklch(...)]`, `shadow-[...]`) |
| Valores dinâmicos (Cores, backgrounds) | **Mapear para Tailwind classes** (ex: `const styles = { TS: 'bg-[oklch(...)]' }`) |
| Valores JS matemáticos impossíveis no CSS | `style={{}}` inline **EXCLUSIVO** para coords (ex: `top: mouse.y`, `transform: rotate(...)`) |
| Animações complexas / keyframes | `<style>` tag injetada no componente |
| Valores arbitrários / Webkit | Tailwind arbitrary properties: `[-webkit-text-fill-color:transparent]` |

### Exemplos corretos e incorretos

```tsx
// ✅ Tailwind para tudo, incluindo arbitrary values
<div className="bg-[oklch(0.62_0.22_41.1/0.15)] border-[oklch(0.62_0.22_41.1/0.25)]" />

// ✅ Mapeamento de variáveis dinâmicas de JS para Tailwind
const bgClass = { JS: "bg-[oklch(0.85_0.18_90)]" }[lang];
<div className={bgClass} />

// ✅ Style inline APENAS para coordenadas matemáticas de mouse/scroll
<div style={{ transform: `rotateX(${tilt.x}deg)`, left: mouse.x }} />

// ❌ PROIBIDO: Style inline para cores, backgrounds ou strings estáticas (mesmo se vier de JS)
<div style={{ backgroundColor: getLangColor(lang), boxShadow: `0 0 5px ${color}` }} />
<div style={{ color: "rgba(0,210,65,0.55)" }} />
```

---

## Paleta de Cores

Todas as cores são definidas via CSS custom properties em `app/globals.css`.
**Nunca use hex hardcoded** — sempre referencie os tokens abaixo.

### Tokens principais

| Token CSS | Valor OKLCH | Uso |
|---|---|---|
| `var(--background)` | `oklch(0.08 0 0)` | Fundo da página (`#0d0d0d` aprox.) |
| `var(--foreground)` | `oklch(0.95 0 0)` | Texto principal |
| `var(--primary)` | `oklch(0.62 0.22 41.1)` | Cor de destaque — laranja/âmbar |
| `var(--muted-foreground)` | `oklch(0.65 0 0)` | Texto secundário, labels, descrições |
| `var(--border)` | `oklch(0.18 0 0)` | Bordas de cards e divisores |
| `var(--card)` | `oklch(0.12 0 0)` | Fundo de cards |

### Como usar a primary com opacidade

Use a sintaxe OKLCH com canal alpha — **não use `opacity` no elemento inteiro**:

```css
/* ✅ Correto */
background: oklch(0.62 0.22 41.1 / 0.15);
border: 1px solid oklch(0.62 0.22 41.1 / 0.25);

/* ❌ Evitar — hardcoded */
background: #f97316;
color: rgba(249, 115, 22, 0.5);
```

No Tailwind, use arbitrary values com underscores:

```tsx
// ✅ Tailwind arbitrary value
<div className="bg-[oklch(0.62_0.22_41.1/0.15)] border-[oklch(0.62_0.22_41.1/0.25)]" />
```

### Escala de opacidade da primary

| Uso | Opacidade |
|---|---|
| Glow/bloom de fundo | `/ 0.05` a `/ 0.16` |
| Bordas decorativas (anéis, etc.) | `/ 0.07` a `/ 0.28` |
| Bordas interativas no hover | `/ 0.45` |
| Badge/chip (fundo + borda) | `/ 0.07` + `/ 0.20` |
| Dots ambientes com glow | `/ 0.70` |
| Texto / ícone em primary puro | sem alpha |

### Cor de texto em botão primário

O botão com `background: var(--primary)` usa `color: #000` — a primary é clara o suficiente para garantir contraste WCAG AA.

---

## Tipografia

### Fontes

| Variável CSS | Fonte | Uso |
|---|---|---|
| `var(--font-display)` | **Space Grotesk** | Headings, nomes, CTAs, badges, stats |
| `var(--font-sans)` | **Geist** | Corpo de texto, descrições, parágrafos |
| `var(--font-mono)` | JetBrains Mono / monospace | Código, terminal, IDE |

> Space Grotesk é carregada via `next/font/google` em `lib/fonts.ts` e injetada como variável CSS `--font-display` no `<body>` via `layout.tsx`.

### Como aplicar o font-display

```tsx
// ✅ Use a classe 'font-display' registrada no Tailwind v4
className="font-display"
```

### Hierarquia tipográfica do Hero

| Elemento | Font | Peso | Tamanho | Notas |
|---|---|---|---|---|
| Nome (Igor / Braz) | Space Grotesk | 700 | `clamp(3rem, 8vw, 6rem)` | `lineHeight: 0.95` |
| Badge de role | Space Grotesk | 600 | `0.75rem` | `letterSpacing: "0.12em"`, uppercase |
| Eyebrow (saudação) | Space Grotesk | 300 | `1rem–1.125rem` | `text-muted-foreground` |
| Descrição | Geist | 400 | `1rem–1.05rem` | `lineHeight: 1.75`, `max-w-md` |
| Stats — número | Space Grotesk | 700 | `clamp(1.5rem, 3vw, 2rem)` | `letterSpacing: "-0.02em"` |
| Stats — label | Geist | 400 | `0.7rem` | uppercase, `letterSpacing: "0.1em"` |
| CTA primário | Space Grotesk | 600 | `0.925rem` | `letterSpacing: "0.01em"` |
| CTA secundário | Space Grotesk | 500 | `0.925rem` | |

### Efeito Shimmer no nome

Deve ser aplicado via classes Tailwind arbitrary properties para evitar CSS inline:

```tsx
<span
  className="bg-[linear-gradient(90deg,var(--primary)_0%,oklch(0.85_0.22_80)_25%,var(--primary)_50%,oklch(0.75_0.25_50)_75%,var(--primary)_100%)] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] animate-[shimmer_4s_linear_infinite]"
>
  Braz
</span>
```

> ⚠️ **Sempre inclua `color: "transparent"`** — sem isso, em alguns builds o Tailwind restaura a cor e o gradiente some.

---

## Componentes — Regras de Estilo

### Botões CTA

| Propriedade | Primário | Secundário |
|---|---|---|
| `border-radius` | **0** | **0** |
| `padding` | `14px 32px` | `14px 32px` |
| `font-family` | `var(--font-display)` | `var(--font-display)` |
| `font-weight` | 600 | 500 |
| `font-size` | `0.925rem` | `0.925rem` |
| Background | `var(--primary)` | `transparent` |
| Cor do texto | `#000` | `var(--foreground)` |
| Borda | nenhuma | `1px solid oklch(0.95 0 0 / 0.12)` |
| Hover — transform | `translateY(-2px)` | `translateY(-2px)` |
| Hover — shadow | `0 12px 40px -8px oklch(0.62 0.22 41.1 / 0.5)` | — |
| Hover — border | — | `oklch(0.62 0.22 41.1 / 0.45)` |
| Hover — background | — | `oklch(0.62 0.22 41.1 / 0.06)` |
| Transition | `200ms ease` | `200ms ease` |

### Badge de Status

```tsx
<div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.07] backdrop-blur-sm">
  <span
    className="w-2 h-2 rounded-full bg-primary"
    style={{
      boxShadow: "0 0 6px 2px oklch(0.62 0.22 41.1 / 0.6)",
      animation: "pulse 2s ease-in-out infinite",
    }}
  />
  <span
    className="text-xs font-semibold tracking-widest uppercase"
    style={{ color: "var(--primary)", fontFamily: "var(--font-display, sans-serif)", letterSpacing: "0.12em" }}
  >
    {label}
  </span>
</div>
```

### Divisores e Bordas Sutis

```tsx
// ✅ Via Tailwind
<div className="border-t border-white/[0.07]" />         // divisor horizontal
<div className="border-r border-white/[0.07]" />         // divisor vertical
<div className="border border-border" />                  // borda de card padrão
```

---

## Navigation — Comportamento e Estilo

Arquivo: `components/layout/navigation.tsx`

### Comportamento de scroll (floating nav)

O navigation possui dois estados baseados em `window.scrollY > 60`:

| Estado | Posição | Largura | Comportamento |
|---|---|---|---|
| **Default** (topo) | `position: fixed; top: 0` | `100vw` | Full-width, sem border-radius, borda inferior sutil |
| **Floating** (após 60px) | `position: fixed; top: 16px` | `min(880px, 100vw - 32px)` | Pill centralizado, glass, sombra profunda |

**Regras:**
- Sempre `position: fixed` — nunca alterne entre `sticky` e `fixed` (quebra CSS transitions)
- Usar flag `mounted` para desativar transition no primeiro render e evitar flash
- Placeholder `<div style={{ height: 72 }}>` permanente para evitar layout shift

### Glass surface do navigation

```tsx
// ✅ Correto — sem saturate (causa cast de cor)
backdropFilter: 'blur(20px)'
WebkitBackdropFilter: 'blur(20px)'

// ❌ Evitar — saturate amplifica cores da página por trás
backdropFilter: 'blur(20px) saturate(180%)'
```

### Centralização dos links na viewport

Os links de navegação devem ser centralizados **na viewport**, não no container do nav.

**Técnica:**
```tsx
// <nav> sempre tem: position: fixed; left: 50%; transform: translateX(-50%)
// Um filho com position: absolute; left: 50% fica exatamente em 50vw — centro da viewport.
// Funciona para qualquer largura do nav (full-width ou pill).

<div
  className="hidden md:flex"
  style={{
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    transform: 'translateX(-50%)',
    alignItems: 'center',
  }}
>
  {navItems.map(...)}
</div>
```

### Hover nos links de navegação

Animação em três camadas (implementada via `<style>` injetado):

1. **Background pill** — `border-radius: 6px`, `oklch(0.95 0 0 / 0.05)` no hover
2. **Glow radial** — `radial-gradient` na cor primary, `opacity: 0 → 1` no hover
3. **Dot indicator** — traço `18×2px` abaixo do item, animado com spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, escala de `0 → 1` do centro

```css
.nav-link-dot {
  transform: translateX(-50%) scaleX(0);
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
}
.nav-link-pill:hover .nav-link-dot {
  transform: translateX(-50%) scaleX(1);
  opacity: 1;
}
```

### Seletor de Linguagem

- **Visibilidade:** somente quando `!scrolled` — some no modo floating pill
- **Trigger:** flag + código (`EN` / `PT`) + chevron rotativo
- **Dropdown:** glass com `backdrop-filter: blur(16px)`, `border-radius: 10px`, item ativo com ícone `<Check>` na cor primary
- Sem rounded excessivo, sem cores hardcoded por país, sem backgrounds coloridos nos itens

### Transições do navigation

| Propriedade | Duração | Easing |
|---|---|---|
| `top`, `width`, `border-radius` | `520ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `height` | `400ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `box-shadow`, `border-color` | `350–400ms` | `ease` |
| `background` | `300ms` | `ease` |
| Hover em link / botão | `200ms` | `ease` |

---

## Background do Hero

### Camadas em ordem (de trás para frente)

1. **DotField (React Bits)** — grade de pontos dinâmica com repulsão interativa ao cursor
   - Configurações: `dotRadius: 1.2`, `dotSpacing: 22`, `cursorRadius: 180`, `bulgeStrength: 45`, `glowRadius: 120`
   - Gradiente de cores: `from: rgba(200, 92, 0, 0.18)` para `to: rgba(180, 100, 30, 0.10)`

2. **Aurora (React Bits)** — cortinas fluídas dinâmicas de cores trazendo profundidade ao fundo
   - Paleta de cores: `#b84a00`, `#c87820`, `#2e2870`
   - Configurações: `amplitude: 0.75`, `blend: 0.30`, `speed: 0.3`
   - Máscara linear: `linear-gradient(to bottom, transparent 0%, black 55%, black 100%)`

3. **Vignette radial** — escurece bordas e suaviza o foco do fundo no conteúdo central
   - `background: radial-gradient(ellipse 90% 65% at 50% 0%, transparent 35%, var(--background) 100%)`

4. **Bottom Fade** — transição linear inferior ocultando grids em direção à próxima seção
   - `height: 40%`, `background: linear-gradient(to top, var(--background) 0%, transparent 100%)`

### Regras do background do hero
- Todos os componentes interativos/visuais de fundo usam `pointer-events: none`
- Sincronização estrita de cores com o tema da aplicação (laranja primário oklch e nuances complementares)
- Utilização de dynamic imports (`ssr: false`) para componentes pesados em animação de tela cheia

---

## Background do 3D Shape

Arquivo: `components/features/3d-shape.tsx`

### Camadas em ordem (de trás para frente)

1. **Glow core** — div central, `blur: 28px`
   ```css
   background: radial-gradient(circle, oklch(0.62 0.22 41.1 / 0.16) 0%, oklch(0.62 0.22 41.1 / 0.05) 55%, transparent 75%);
   filter: blur(28px);
   animation: pulse 4s ease-in-out infinite;
   ```

2. **Anel orbital 1** — `rotateX(72deg)`, 20s, `opacity 0.28`
   - `width: min(320px, 58vw)`, `border: 1px solid oklch(0.62 0.22 41.1 / 0.28)`

3. **Anel orbital 2** — `rotateY(68deg)`, counter 30s, `opacity 0.14`
   - `width: min(400px, 72vw)`, `border: 1px solid oklch(0.62 0.22 41.1 / 0.14)`

4. **Anel orbital 3** — `rotateX(55deg)`, 42s, `opacity 0.07`
   - `width: min(480px, 88vw)`, `border: 1px solid oklch(0.62 0.22 41.1 / 0.07)`

5. **Dots flutuantes** — 6 pontos, posições assimétricas, `pulse` com delays variados
   - `background: oklch(0.62 0.22 41.1 / 0.7)`, `boxShadow` com glow suave

6. **Reflexo de chão** — linha `1px` + fade vertical de `40px`

7. **Canvas Three.js** — `z-index: 20`, sobre tudo

### Interação e Varredura (Holograma & Laser)

Para máxima otimização e imersão visual (estilo "Robocop" / HUD tático), o controle de visibilidade das partículas do modelo 3D (tanto o busto quanto os sparks flutuantes) é processado diretamente na GPU (Fragment Shader) ao invés de usar máscaras CSS no DOM.

- **Mascaramento por Uniforms**: A visibilidade final do pixel é calculada via `particleVisibility = max(spotlight, scanHighlight)`.
  - **Spotlight (Hover)**: Ativado quando o mouse entra no card, gerando uma retícula circular reveladora em torno das coordenadas de projeção 3D (`uMouse3D`), animada via `uMouseStrength`.
  - **Scanline Sweep (Scanner)**: Revela uma fatia horizontal fina do modelo 3D em torno da coordenada de varredura `uScanProgress`.
- **Clean State (Default)**: Sem hover e com scanner desligado, as partículas de busto e faíscas têm visibilidade `0.0` (100% invisíveis), mostrando apenas o retrato fotográfico em alta resolução.
- **Ciclo de Varredura Inicial**: No primeiro render da página, o scanner executa exatamente **1 ciclo** (desce até a base e sobe ao topo) de forma lenta e cadenciada (`SCAN_SPEED: 0.3`). Uma linha laser neon laranja de `1px` (`boxShadow` com glow suave) acompanha e guia visualmente a varredura, ocultando-se ao término do ciclo.
- **Botão Re-Scan Manual**: Adição de um botão HUD em glassmorphism (`[ ESCANEAR PERFIL ]` / `[ SCAN PROFILE ]`) com `z-50`. Cada clique incrementa o estado `scanTrigger` e aciona exatamente 1 novo ciclo completo de varredura do laser, reforçando o caráter interativo do portfólio.
- **Stacking de Camadas (z-index)**:
  - O wrapper do `Shape3d` está na camada frontal (`z-30`).
  - O wrapper do `HeroPhoto` está na camada intermediária (`z-20` / default).
  - O botão de controle manual está na camada superior (`z-50`).

### Keyframes dos anéis (em `<style>` no próprio componente)

```css
@keyframes shape3d-ring1 {
  from { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg); }
  to   { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg); }
}
@keyframes shape3d-ring2 {
  from { transform: translate(-50%, -50%) rotateY(68deg) rotateZ(0deg); }
  to   { transform: translate(-50%, -50%) rotateY(68deg) rotateZ(-360deg); }
}
@keyframes shape3d-ring3 {
  from { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(30deg); }
  to   { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(390deg); }
}
```

### Anti-padrões — NÃO fazer no 3D Shape

| ❌ Evitar | ✅ Alternativa |
|---|---|
| `animate-ping` no centro | `animation: pulse` suave |
| Barras verticais piscando | Dots flutuantes com glow |
| Grid CSS em perspectiva | — |
| Linhas irradiando em 8 ângulos | — |
| '#f97316' / '#ff5100' hardcoded | 'oklch(0.62 0.22 41.1 / X)' |
| Mais de 3 anéis orbitais | Máximo 3 |

---

## Visualização de Dados e Elementos UI Complexos

Elementos avançados, como painéis de atividade e radares, devem adotar o conceito de **"Mission Control"** (Cockpit/Telemetry).

### Regras para Elementos Interativos Avançados
1. **Modelagem de Alvos (Blips/Nodes):**
   - **❌ Evitar:** Círculos coloridos estilo "arco-íris", highlights especulares cartunizados, bordas grossas divertidas.
   - **✅ Fazer:** Formas técnicas como diamantes, retículas cruzadas (crosshairs), wireframes e glows radiais com decaimento suave.
2. **Cores em Elementos de Dados:**
   - Para painéis técnicos (ex: Radar), adote paletas monocromáticas rigorosas ou bicromáticas (ex: Tons de Fósforo CRT — Verde `rgb(0, 210, 65)`).
   - Use opacidade para criar hierarquia, simulando profundidade e persistência de visão (afterglow).
3. **Imersão no Background:**
   - Adicione HUDs nos cantos, réguas de graus, crosshairs e grids pontilhados sutis ao fundo.
   - Um elemento 3D/Canvas nunca deve flutuar em um fundo vazio. O contêiner dele deve ajudar a vender a ilusão do sistema.
4. **Respostas e Interações:**
   - Labels e tooltips interativos devem imitar saídas de terminal ou displays heads-up de aviação (fontes monospace, cores monocromáticas).
   - Interações que simulam scan, varredura ou radar devem usar fading baseado no tempo e no ângulo real, em vez de simplesmente piscar.

---

## Animações — Referência Completa

### Timings por tipo de interação

| Tipo | Duração | Easing |
|---|---|---|
| Hover em botão | 200ms | `ease` |
| Hover em card | 150ms | `ease` |
| Entrada de bloco (hero) | 700ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Shimmer de texto | 4s | `linear infinite` |
| Orbs de glow | 4–8s | `ease-in-out infinite` |
| Anéis orbitais | 20–42s | `linear infinite` |
| Badge pulse | 2s | `ease-in-out infinite` |
| Nav layout (scroll) | 400–520ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Nav visual (scroll) | 300–400ms | `ease` |

### Classes de entrada escalonada do hero

```css
.hero-animate-1 { animation: heroSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both; }
.hero-animate-2 { animation: heroSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both; }
.hero-animate-3 { animation: heroSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
.hero-animate-4 { animation: heroSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.50s both; }
.hero-animate-5 { animation: heroSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both; }
```

Uso no hero (de cima para baixo):
- `.hero-animate-1` → Badge de status (role)
- `.hero-animate-2` → Bloco do nome (h1)
- `.hero-animate-3` → Parágrafo de descrição
- `.hero-animate-4` → CTAs
- `.hero-animate-5` → Stats

---

## Animações de Texto com React Bits

> Camada adicionada para enriquecer a movimentação dos textos do portfólio, usando os componentes de `TextAnimations` do [React Bits](https://reactbits.dev), **sem abrir mão de nenhuma regra de cor, fonte ou tom sóbrio já definida neste documento.**

### Filosofia de uso

React Bits entra como **motor de animação de texto** — reduz CSS/JS customizado e padroniza timing — mas nunca como fonte de identidade visual. Todo componente instalado deve ter sua paleta padrão (geralmente colorida/rainbow nas demos) **completamente sobrescrita** pelos tokens oklch do projeto.

> ⚠️ **Regra de Ouro:** instale o componente pela estrutura/lógica/timing dele, e sempre re-estilize via props de cor e `className` para `--primary`, `--foreground`, `--muted-foreground` e `font-display`/`font-mono`. Nunca deixe a cor padrão de demo do componente chegar à tela.

### Instalação (variante TS-TW — obrigatória, bate com a regra de Tailwind)

```bash
npx shadcn@latest add @react-bits/BlurText-TS-TW
npx shadcn@latest add @react-bits/SplitText-TS-TW
npx shadcn@latest add @react-bits/DecryptedText-TS-TW
npx shadcn@latest add @react-bits/TextType-TS-TW
npx shadcn@latest add @react-bits/CountUp-TS-TW
```

### Mapeamento — onde usar cada componente

| Componente | Onde aplicar | Props/ajustes obrigatórios |
|---|---|---|
| **BlurText** | Eyebrow do hero, parágrafo de descrição, parágrafos de outras seções (substitui parte das `.hero-animate-*`) | `animateBy="words"`, `direction="top"`, cor herdada via `className="text-muted-foreground"` / `text-foreground` — nenhuma cor própria do componente |
| **SplitText** | Entrada do H1 (nome) e dos H2 de seção, antes do shimmer assumir o loop contínuo | `splitType="words"` ou `"chars"`, duração 700ms, easing `cubic-bezier(0.16, 1, 0.3, 1)` — reutiliza o timing já documentado em "Entrada de bloco (hero)" |
| **DecryptedText** | HUD labels (`SEC-04 // PRJ`, `STATUS: ACTIVE`, `RENDER MODE: GRID`, rodapé `END // SEC-04`) | `className="font-mono"` + cor herdada (`text-primary` ou `text-muted-foreground/40`, conforme o label), `speed` rápido (30–50ms), reforça o conceito CRT/scan já existente no 3D Shape |
| **TextType** | Strings que simulam terminal nos HUDs — pode substituir o `.prj-blink` manual em textos que "digitam" ao entrar na viewport | cursor monospace herdando a cor do token, `loop={false}` para status fixos (não repetir infinitamente) |
| **CountUp** | Números das stats do hero e métricas numéricas dos cards de projeto | `duration` 1.5–2s, `text-primary font-display tabular-nums`, dispara uma única vez por scroll-into-view |
| **ShinyText** *(opcional)* | Pode substituir o shimmer manual do nome, só se simplificar manutenção — não é obrigatório trocar o que já funciona | gradiente customizado para `oklch(0.62 0.22 41.1)` + `oklch(0.85 0.18 90)`, nunca a cor branca/neutra padrão do componente |

### Onde NÃO usar — quebra a filosofia sóbria/premium

| ❌ Evitar | Motivo |
|---|---|
| `GlitchText`, `ScrambleText` com a paleta padrão do componente | Cores RGB chapadas e efeito "cyberpunk genérico" contrastam com a estética sóbria/monocromática laranja do projeto |
| `FallingText` | Física de gravidade "engraçadinha" — foge do tom de produto premium |
| Springs com overshoot/bounce visivelmente exagerado em heading | Lembra UI infantil — viola a regra "Evite a todo custo a Estética Infantil" |
| Mais de 2 animações de texto disparando simultaneamente na mesma viewport | Poluição visual — contraria o princípio "menos é mais" |
| Qualquer cor padrão de demo (rainbow, multicolor, branco puro) | Todo texto animado usa exclusivamente os tokens oklch já definidos na Paleta de Cores |

### Regras de implementação

- Componentes que dependem de GSAP/Framer Motion pesado devem ser carregados via `dynamic(() => import(...), { ssr: false })` — mesma regra já aplicada ao background do hero.
- Toda cor passada por prop a um componente React Bits deve vir de uma constante mapeada para os tokens oklch (nunca hex solto) — segue a mesma lógica de "mapear valores dinâmicos para Tailwind" já documentada na seção "Regra de Implementação — Tailwind Obrigatório".
- Animações de entrada disparam **uma única vez** por scroll-into-view (`once: true` / IntersectionObserver) — exceto os loops intencionais já documentados (shimmer 4s, badge pulse 2s, CRT scan 8s).
- Antes de adicionar uma nova animação de texto, verifique a tabela de timings em "Animações — Referência Completa": o componente React Bits deve se encaixar nos valores já existentes, não introduzir um novo timing aleatório.

---

## Scroll Indicator

Padrão para o final de qualquer seção full-height:

```tsx
<div
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
  onClick={scrollToNextSection}
>
  <span
    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
    style={{ fontFamily: "var(--font-display, sans-serif)" }}
  >
    Scroll
  </span>
  <svg className="w-4 h-4 text-muted-foreground animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
</div>
```

---

## Checklist — antes de entregar qualquer alteração

### Tailwind
- [ ] Toda estilização usa Tailwind classes — `style={{}}` inline APENAS para valores dinâmicos de JS (como interações com mouse/scroll)
- [ ] Cores oklch como arbitrary values: `bg-[oklch(0.62_0.22_41.1/0.15)]`
- [ ] Prefixos Webkit, transform-style e outras propriedades especiais como classes arbitrárias (ex: `[-webkit-text-fill-color:transparent]`, `[transform-style:preserve-3d]`)
- [ ] Keyframes e pseudo-classes complexas em `<style>` injetado no componente

### Cores
- [ ] Nenhuma cor hex hardcoded — tudo usa tokens CSS
- [ ] Opacidades da primary respeitam a escala definida acima

### Tipografia
- [ ] Space Grotesk em elementos de display via classe `font-display` (NUNCA use inline styles para fontFamily)
- [ ] Shimmer aplicado por classes Tailwind arbitrary properties, garantindo `text-transparent` e `[-webkit-text-fill-color:transparent]`

### Botões
- [ ] `border-radius: 0` nos CTAs principais
- [ ] Hover com `translateY(-2px)` e transição de `200ms ease`

### Navigation
- [ ] `position: fixed` sempre — nunca alternar para `sticky`
- [ ] Flag `mounted` para desativar transition no primeiro render
- [ ] Links centralizados via `position: absolute; left: 50%` direto no `<nav>`
- [ ] `backdropFilter: 'blur(20px)'` sem `saturate()` — evita cast de cor
- [ ] Language selector oculto no modo floating (`scrolled === true`)

### Background do hero
- [ ] Componentes de partículas/Aurora dinâmicas (DotField e Aurora) do React Bits configurados com `pointer-events: none`
- [ ] Cores de gradiente e orbs integrados na paleta do projeto (laranja oklch)

### 3D Shape
- [ ] Somente `oklch(0.62 0.22 41.1 / X)` para cor
- [ ] Máximo 3 anéis orbitais
- [ ] Sem `animate-ping`, `animate-spin` ou grid CSS
- [ ] Visibilidade do modelo e das partículas calculada inteiramente via GPU (Fragment Shader)
- [ ] Laser scanline de 1px a `SCAN_SPEED = 0.3` executado exatamente 1 ciclo na inicialização
- [ ] Botão HUD de Re-Scan manual presente na camada de z-index z-50

### Animações de texto (React Bits)
- [ ] Cores dos componentes React Bits sobrescritas pelos tokens oklch — nunca a paleta padrão do demo
- [ ] DecryptedText usado nos HUD labels, BlurText nos parágrafos, SplitText nos headings
- [ ] Nenhum `GlitchText`/`ScrambleText`/`FallingText` com cores fora da paleta do projeto
- [ ] Máximo 2 animações de texto disparando simultaneamente na mesma viewport
- [ ] Componentes pesados (GSAP/Framer Motion) carregados via `dynamic(..., { ssr: false })`
- [ ] Animações de entrada disparam uma única vez por scroll-into-view (exceto loops já documentados)

### Geral
- [ ] Animações de entrada usam `.hero-animate-1` a `.hero-animate-5`
- [ ] Transições de hover entre 150–200ms
- [ ] `pointer-events: none` em todos os elementos puramente decorativos

### Checklist — Seção Projects
- [ ] CRT scanning line presente no background
- [ ] HUD labels nos cantos (top-left e bottom-right)
- [ ] Ghost numbers nos cards (01, 02...)
- [ ] Tilt 3D no mousemove dos cards
- [ ] Top accent line sweep no hover
- [ ] Todos os projetos em grid uniforme — **nenhum card ocupa largura total**
- [ ] Eyebrow com linha laranja antes do H2
- [ ] Shimmer gradient no subtítulo do heading

---

## Seção Projects — Design e Comportamento

Arquivo: `components/sections/projects.tsx`

### Filosofia

A seção de projetos segue o conceito **"Mission Control"** — não são cards simples numa página em branco, mas sim um painel técnico de monitoramento. O usuário deve sentir que está inspecionando projetos de missão crítica.

### Background — Camadas em ordem

1. **Grid pattern** — classe `.hero-grid-pattern` (mesma do hero)
2. **Vignette top** — `radial-gradient ellipse 80%/60% at 50% 0%`
3. **Vignette bottom** — `radial-gradient ellipse 80%/50% at 50% 100%` (fecha a seção)
4. **Orb primary** — `top-[-5%] left-[5%]`, cor `oklch(0.62 0.22 41.1 / 0.12)`, blur 80px, pulse 9s
5. **Orb secondary** — `bottom-[-10%] right-[-5%]`, cor `oklch(0.55 0.18 260 / 0.07)`, blur 80px, pulse 12s delay 3s
6. **CRT scanning line** — faixa horizontal de 2px que percorre a seção verticalmente em loop (8s linear infinite), via `@keyframes prj-scan` injetado em `<style>`
7. **Linhas verticais de acento** — `w-px` nas bordas esquerda e direita com gradiente de primary
8. **HUD top-left** — texto monospace com `SEC-04 // PRJ`, `RENDER MODE: GRID`, `STATUS: ACTIVE` (com cursor `.prj-blink`)
9. **HUD bottom-right** — `PORTFOLIO.PROJECTS v2.0 // 2026` + linha vertical de acento
10. **Crosshair decorativo** — visível apenas em `xl`, opacidade 10%

### Keyframes injetados via `<style>` no componente

```css
@keyframes prj-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
.prj-scanline {
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, oklch(0.62 0.22 41.1 / 0.18), transparent);
  animation: prj-scan 8s linear infinite;
  pointer-events: none;
}
@keyframes prj-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.prj-blink { animation: prj-blink 1.2s step-start infinite; }
```

### Heading da seção

Padrão a seguir (idêntico ao da `ProfessionalJourney`):

```tsx
{/* Eyebrow com linha */}
<div className="flex items-center gap-3 mb-5">
  <div className="w-8 h-px bg-primary" />
  <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
    PROJETOS
  </span>
</div>

{/* H2 com shimmer */}
<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[0.95]">
  Projetos{" "}
  <span className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-[length:200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]">
    Profissionais
  </span>
</h2>
```

### Filter bar

- Botões **sem border-radius** (sharp, `rounded-none`)
- Aba ativa: `bg-primary text-background` (texto preto sobre laranja)
- Aba inativa: `text-muted-foreground`, hover sutil com `oklch(0.62 0.22 41.1 / 0.06)`
- Indicador ativo: `motion.div` com `layoutId="filter-indicator"` e spring `bounce: 0.2`
- Contador de projetos `■ N PROJECTS` com `.prj-blink` no canto direito
- Linha separadora `h-px bg-border` no fundo da barra

### Grid de projetos — REGRA CRÍTICA

> ⚠️ **TODOS os projetos ficam em grid uniforme de 2 colunas (`sm:grid-cols-2`).** Nenhum card ocupa largura total (col-span-2), independentemente do flag `featured` nos dados.

```tsx
<div className="grid sm:grid-cols-2 gap-6">
  {filteredProjects.map((project, i) => (
    <ProjectCard key={project.id} project={project} idx={i} isFeatured={false} ... />
  ))}
</div>
```

**Por quê:** O campo `featured` nos dados é apenas para exibir o badge "FEATURED" no card — **não define layout**. Usar `featured` para determinar largura causou o bug onde o segundo projeto sumia na aba "Todos" (ambos os projetos tinham `featured: true`).

### Anatomia do `ProjectCard`

Cada card é um `motion.a` com as seguintes camadas (de baixo para cima):

| Camada | Descrição |
|---|---|
| Ghost number | Número do índice (`01`, `02`...) gigante translúcido no fundo, via gradiente de texto |
| Top accent line | `h-px` com gradiente primary, `scale-x-0 → scale-x-100` no hover (700ms) |
| Inner glow | Radial gradient primary/6% no topo, `opacity-0 → opacity-100` no hover |
| HUD corners | Brackets nos 4 cantos, `opacity-0 → opacity-100` no hover |
| Border glow | Border interna `oklch(0.62 0.22 41.1 / 0 → 0.25)` no hover |
| Imagem | `aspect-[16/8]`, `object-cover`, scale 1.04 no hover |
| CRT scanlines | Overlay de linhas horizontais finas na imagem, visível no hover |
| Badge FEATURED | Exibido quando `project.featured === true` — efeito visual apenas |
| Conteúdo | Título, descrição, métricas, highlights, tech tags |

#### Tilt 3D nos cards

O card reage ao `mousemove` com inclinação de perspectiva:

```tsx
// Style inline permitido pois são coordenadas matemáticas de mouse
style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}

// Cálculo:
const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
setTilt({ x: -ny * 4, y: nx * 4 })
```

#### Ghost number

```tsx
<div
  className="absolute select-none pointer-events-none font-display font-extrabold top-[-4%] right-[-2%] leading-none tracking-[-0.05em] z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_80%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] tabular-nums"
  style={{ fontSize: "clamp(100px,14vw,180px)" }}
>
  {String(idx + 1).padStart(2, "0")}
</div>
```

> ✅ O `style` aqui é permitido pois usa `clamp()` — função CSS matemática impossível de expressar em Tailwind sem valor fixo.

#### Aspect ratios dos cards

| Tipo | Aspect ratio |
|---|---|
| Card normal | `aspect-[16/8]` |
| Card featured (visual, não layout) | — (mesmo tamanho, `isFeatured` não altera layout) |

#### Conteúdo do card

- **Padding:** `p-5`, **Espaçamento interno:** `space-y-3`
- **Título:** `text-lg font-bold font-display`, hover muda para `text-primary`
- **Descrição:** `text-sm text-muted-foreground line-clamp-2`
- **Métricas:** grid 3 colunas, valor em `text-xl font-bold text-primary font-display`, label em `text-[9px] font-mono uppercase tracking-widest`
- **Highlights:** máximo 3 itens, bullet `▸` em `text-primary font-mono`
- **Tech tags:** `text-[10px] font-mono`, hover muda border e texto para primary

### Rodapé da seção

Divisor técnico com gradiente:

```tsx
<div className="mt-16 flex items-center gap-4">
  <div className="flex-1 h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.4),transparent)]" />
  <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase">
    END // SEC-04
  </span>
  <div className="flex-1 h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.4),transparent)]" />
</div>
```

### Anti-padrões — NÃO fazer na seção Projects

| ❌ Evitar | ✅ Alternativa |
|---|---|
| Cards simples sem background decoration | HUD labels, scanning line, ghost numbers |
| Card featured ocupando largura total | Grid uniforme 2 colunas para todos |
| Usar `featured` dos dados para definir layout | `featured` é apenas visual (badge) |
| Border-radius nos filter buttons | `rounded-none` — sharp edges |
| Bullets `•` nos highlights | `▸` monospace em primary |
| Hover apenas com `translateY(-4px)` | Tilt 3D + accent line sweep + HUD corners |

---

## Arquivos-chave

| Arquivo | Responsabilidade |
|---|---|
| `app/globals.css` | Tokens de cor, keyframes, utilitários do hero |
| `lib/fonts.ts` | Geist (local) + Space Grotesk (Google Fonts) |
| `app/[lang]/layout.tsx` | Injeta `--font-display` no `<body>` |
| `components/layout/navigation.tsx` | Navigation floating com glassmorphism |
| `components/sections/hero.tsx` | Seção hero completa — coluna esq. + dir. |
| `components/sections/projects.tsx` | Seção de projetos — grid 2 colunas, HUD, CRT scan |
| `components/features/3d-shape.tsx` | Modelo 3D de partículas + background decorativo |
| `components/features/hero-photo.tsx` | Foto no modo "Photo" do hero |
| `components/ui/` | Componentes instalados via React Bits (BlurText, SplitText, DecryptedText, TextType, CountUp etc.) já restilizados com os tokens do projeto |
| `data/projects/pt.json` | Dados dos projetos em português (campo `featured` é só visual) |
| `data/projects/en.json` | Dados dos projetos em inglês |

---

## Lições de Implementação — React Bits (Junho 2026)

> Aprendizados documentados após a integração dos componentes de animação de texto (`BlurText`, `SplitText`, `DecryptedText`, `CountUp`) em todas as seções do portfólio.

### ❌ Conflito crítico 1: `SplitText` dentro de `bg-clip-text`

**Problema:** Colocar `<SplitText>` (ou qualquer componente que gere `<span className="inline-block">` internamente) dentro de um `<span>` com gradiente shimmer **quebra o gradiente completamente** — o texto fica invisível.

**Por quê:** `bg-clip-text` + `-webkit-text-fill-color: transparent` requer que o texto seja um **nó de texto direto** no elemento com o gradiente. Quando `SplitText` cria múltiplos `<m.span className="inline-block">` individuais, cada um forma seu próprio contexto de background — o `bg-clip-text` se fragmenta por span, o `background-size: 200%` do shimmer não consegue fazer a varredura contínua, e o resultado é texto transparente sem cor.

**Regra Definitiva:**

```tsx
// ❌ QUEBRA o gradiente — SplitText dentro do span shimmer
<span className="bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
  <SplitText text="Highlight" />
</span>

// ✅ CORRETO — texto direto no span de gradiente, SplitText apenas fora dele
<h2>
  <SplitText text={dictionary.section.title} splitType="words" stepDelay={65} delay={0} />
  {" "}
  <span className="bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
    {dictionary.section.titleHighlight}
  </span>
</h2>
```

> O shimmer de loop contínuo de 4s já é animação suficiente para o highlight — `SplitText` seria redundante e destrutivo nesse contexto.

---

### ❌ Conflito crítico 2: `opacity: 0` no pai + componentes com `IntersectionObserver`

**Problema:** `BlurText`, `SplitText` e `DecryptedText` usam `useInView` (Framer Motion `IntersectionObserver`) para detectar quando entrar na viewport e disparar sua animação. Quando esses componentes estão dentro de um `<m.div initial={{ opacity: 0 }}>`, o IntersectionObserver **ainda detecta o elemento como visível** — `opacity: 0` não cria invisibilidade para o observer. A animação dispara e conclui enquanto o pai ainda está `opacity: 0`. Quando o pai faz o fade-in, o texto já está no estado final — o usuário vê apenas o fade simples do pai, sem nenhum efeito de stagger, blur ou decrypt.

**Por quê funciona assim:** O `IntersectionObserver` observa **posição na viewport**, não visibilidade perceptual. `opacity: 0` não impede a detecção.

**Regra Definitiva:**

```tsx
// ❌ INEFICAZ — animação já completou enquanto o pai era opacity:0
<m.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
  <DecryptedText text="SECTION LABEL" delay={200} />
  <SplitText text={title} delay={300} />
  <BlurText text={subtitle} delay={500} />
</m.div>

// ✅ CORRETO — sem wrapper de opacidade, cada componente controla sua própria entrada
<div>
  <DecryptedText text="SECTION LABEL" delay={0} />
  <SplitText text={title} delay={0} />
  <BlurText text={subtitle} delay={0} />
</div>
```

> **Nota sobre delay:** Quando o wrapper de opacidade é removido, os `delay` internos dos componentes devem ser zerados — eles não precisam mais compensar o tempo do fade-in do pai.

---

### Padrão correto de heading de seção com animações

Este é o padrão validado e a ser replicado em todas as seções:

```tsx
{/* Caption/eyebrow — DecryptedText gerencia própria entrada, sem wrapper de opacidade */}
<div className="flex items-center gap-3 mb-5">
  <div className="w-8 h-px bg-primary" />
  <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
    <DecryptedText
      text={dictionary.section.sectionLabel}
      speed={30}
      delay={0}
      className="text-primary"
    />
  </span>
</div>

{/* H2 — SplitText nas palavras normais, texto DIRETO no span de shimmer */}
<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[0.95]">
  <SplitText
    text={dictionary.section.title}
    splitType="words"
    stepDelay={65}
    delay={0}
    threshold={0.1}
  />{" "}
  <span className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]">
    {dictionary.section.titleHighlight}
  </span>
</h2>

{/* Parágrafo — BlurText gerencia própria entrada, sem m.p com opacity:0 */}
<p className="text-base text-muted-foreground max-w-xl leading-relaxed">
  <BlurText
    text={dictionary.section.subtitle}
    animateBy="words"
    direction="top"
    delay={0}
    stepDelay={28}
    className="text-muted-foreground"
    threshold={0.1}
  />
</p>
```

---

### Implementação interna dos componentes

Os componentes são **implementados como arquivos TypeScript em `components/ui/`**, não instalados via `npx shadcn` — controle total sobre Tailwind v4 + Next.js 16. Todos usam `useInView` do Framer Motion internamente:

| Componente | Arquivo | Cor |
|---|---|---|
| `BlurText` | `components/ui/blur-text.tsx` | Herdada via `className` — nunca cor própria |
| `SplitText` | `components/ui/split-text.tsx` | Herdada via `className` — nunca cor própria |
| `DecryptedText` | `components/ui/decrypted-text.tsx` | Herdada via `className` — nunca cor própria |
| `CountUp` | `components/ui/count-up.tsx` | Herdada via `className` — nunca cor própria |

**Todos têm guard** `if (!text || text.trim() === "") return null` para não crashar com strings vazias (ex: partes do título Contact quando o highlight é a primeira ou última palavra).

---

### Mapa de aplicação por seção

| Seção | DecryptedText | SplitText | BlurText | CountUp |
|---|---|---|---|---|
| **Hero** | — | — | Parágrafo descrição | Stats (repos, stars, anos) |
| **Professional Journey** | Caption eyebrow | H2 title | — | — |
| **Projects** | Caption eyebrow + HUDs (SEC-04, RENDER MODE, STATUS) | H2 title | Subtitle | — |
| **Articles** | Caption eyebrow + HUDs (SEC-05, RENDER MODE, STATUS) | H2 title | Subtitle | — |
| **Tech Stack** | Caption eyebrow | H2 title | Subtitle | — |
| **Contact** | Caption eyebrow + HUDs (SYS_STATUS, UPLINK, TELEMETRY, TRANSMISSION) | H2 (before + after) | Subtitle | — |
| **Code Dashboard** | Caption eyebrow | H2 title | Subtitle | — |

---

### Adições ao Checklist de entrega

Adicionar à seção **"Animações de texto (React Bits)"** do checklist:

- [ ] `SplitText`/`BlurText`/`DecryptedText` **nunca** dentro de `<span>` com `bg-clip-text` — texto de gradiente sempre como nó direto
- [ ] `SplitText`/`BlurText`/`DecryptedText` **nunca** dentro de `<m.div>` ou `<m.span>` com `initial={{ opacity: 0 }}` — remover o wrapper e deixar cada componente controlar sua própria entrada via IntersectionObserver
- [ ] `delay={0}` quando o wrapper de opacidade é removido — o delay servia apenas para compensar o tempo do fade do pai
- [ ] Guard `if (!text || text.trim() === "") return null` em todos os componentes de animação de texto
