export type CursorPreset =
  | "default"
  | "crosshair"
  | "spotlight"
  | "ripple"
  | "vortex"
  | "trail"
  | "minimal";

export type AccentColor =
  | "blue"
  | "purple"
  | "green"
  | "pink"
  | "orange"
  | "red"
  | "cyan"
  | "yellow";

export interface CursorConfig {
  preset: CursorPreset;
  color: AccentColor;
}

interface CursorPresetConfig {
  name: string;
  description: string;
  size: number;
  blur: boolean;
  trail: boolean;
  renderStyle: "default" | "crosshair" | "spotlight" | "ripple" | "vortex" | "trail" | "minimal";
  useOriginalColor?: boolean
}

export const cursorPresets: Record<CursorPreset, CursorPresetConfig> = {
  default: {
    name: "Classic",
    description: "Cursor original do site com anel animado",
    size: 1,
    blur: true,
    trail: true,
    renderStyle: "default",
    useOriginalColor: true
  },
  crosshair: {
    name: "Crosshair",
    description: "Mira de precisão estilo FPS",
    size: 1,
    blur: false,
    trail: false,
    renderStyle: "crosshair"
  },
  spotlight: {
    name: "Spotlight",
    description: "Holofote que ilumina o caminho",
    size: 1.5,
    blur: true,
    trail: false,
    renderStyle: "spotlight"
  },
  ripple: {
    name: "Ripple",
    description: "Ondas concêntricas como água",
    size: 1,
    blur: false,
    trail: true,
    renderStyle: "ripple"
  },
  vortex: {
    name: "Vortex",
    description: "Espiral rotativa hipnotizante",
    size: 1.2,
    blur: true,
    trail: false,
    renderStyle: "vortex"
  },
  trail: {
    name: "Particle Trail",
    description: "Rastro de partículas luminosas",
    size: 0.8,
    blur: true,
    trail: true,
    renderStyle: "trail"
  },
  minimal: {
    name: "Minimal",
    description: "Simples e discreto, apenas um ponto",
    size: 1,
    blur: false,
    trail: false,
    renderStyle: "minimal"
  }
};

export const accentColors: Record<AccentColor, { primary: string; secondary: string; glow: string }> = {
  blue: {
    primary: "rgb(59, 130, 246)",
    secondary: "rgb(147, 197, 253)",
    glow: "rgba(59, 130, 246, 0.4)"
  },
  purple: {
    primary: "rgb(168, 85, 247)",
    secondary: "rgb(216, 180, 254)",
    glow: "rgba(168, 85, 247, 0.4)"
  },
  green: {
    primary: "rgb(34, 197, 94)",
    secondary: "rgb(134, 239, 172)",
    glow: "rgba(34, 197, 94, 0.4)"
  },
  pink: {
    primary: "rgb(236, 72, 153)",
    secondary: "rgb(251, 207, 232)",
    glow: "rgba(236, 72, 153, 0.4)"
  },
  orange: {
    primary: "rgb(249, 115, 22)",
    secondary: "rgb(253, 186, 116)",
    glow: "rgba(249, 115, 22, 0.4)"
  },
  red: {
    primary: "rgb(239, 68, 68)",
    secondary: "rgb(252, 165, 165)",
    glow: "rgba(239, 68, 68, 0.4)"
  },
  cyan: {
    primary: "rgb(6, 182, 212)",
    secondary: "rgb(165, 243, 252)",
    glow: "rgba(6, 182, 212, 0.4)"
  },
  yellow: {
    primary: "rgb(234, 179, 8)",
    secondary: "rgb(253, 224, 71)",
    glow: "rgba(234, 179, 8, 0.4)"
  }
};

export const defaultCursorConfig: CursorConfig = {
  preset: "default",
  color: "blue"
};
