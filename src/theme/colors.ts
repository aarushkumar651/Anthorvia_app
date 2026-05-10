export const Colors = {
  // ── Backgrounds ─────────────────────────────
  background: {
    void: '#030305',
    primary: '#050508',
    secondary: '#080810',
    elevated: '#0C0C18',
    glass: 'rgba(8,8,16,0.75)',
    glassLight: 'rgba(15,15,30,0.60)',
    overlay: 'rgba(3,3,5,0.85)',
    card: 'rgba(12,12,24,0.90)',
  },

  // ── Glow Palette (from logo) ─────────────────
  glow: {
    cyan: '#00D4FF',
    cyanDim: '#0099BB',
    blue: '#0EA5E9',
    indigo: '#6366F1',
    indigoDim: '#4F52CC',
    violet: '#8B5CF6',
    violetDim: '#6D48C8',
    purple: '#A855F7',
    white: '#E0E8FF',
  },

  // ── Gradient Stops ───────────────────────────
  gradient: {
    logoLeft: '#00D4FF',
    logoMid: '#6366F1',
    logoRight: '#8B5CF6',
    primary: ['#00D4FF', '#6366F1', '#8B5CF6'] as string[],
    cyanToViolet: ['#00D4FF', '#8B5CF6'] as string[],
    darkCard: ['rgba(12,12,24,0.95)', 'rgba(8,8,16,0.95)'] as string[],
    transparent: ['rgba(5,5,8,0)', 'rgba(5,5,8,1)'] as string[],
  },

  // ── Text ─────────────────────────────────────
  text: {
    primary: '#F0F0FF',
    secondary: '#9090B0',
    muted: '#505070',
    accent: '#00D4FF',
    inverse: '#050508',
    disabled: '#303050',
  },

  // ── Borders ──────────────────────────────────
  border: {
    subtle: 'rgba(255,255,255,0.05)',
    default: 'rgba(255,255,255,0.08)',
    glow: 'rgba(99,102,241,0.25)',
    glowCyan: 'rgba(0,212,255,0.30)',
    glowViolet: 'rgba(139,92,246,0.30)',
    active: 'rgba(99,102,241,0.60)',
  },

  // ── AI Mode Accents ──────────────────────────
  modes: {
    fast: '#00D4FF',
    think: '#6366F1',
    deep: '#8B5CF6',
    coach: '#0EA5E9',
    opening: '#38BDF8',
    tactical: '#F59E0B',
    endgame: '#D4AF37',
  },

  // ── Status ───────────────────────────────────
  status: {
    win: '#22D3EE',
    loss: '#EF4444',
    draw: '#8B5CF6',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#6366F1',
  },

  // ── Chess Board ──────────────────────────────
  chess: {
    lightSquare: '#1A1A2E',
    darkSquare: '#0D0D1A',
    highlight: 'rgba(0,212,255,0.25)',
    danger: 'rgba(239,68,68,0.30)',
    bestMove: 'rgba(16,185,129,0.35)',
    selectedPiece: 'rgba(99,102,241,0.40)',
  },

  // ── Particles ────────────────────────────────
  particle: {
    cyan: 'rgba(0,212,255,0.6)',
    violet: 'rgba(139,92,246,0.6)',
    indigo: 'rgba(99,102,241,0.5)',
    white: 'rgba(224,232,255,0.3)',
  },
} as const;

export type ColorKey = keyof typeof Colors;
