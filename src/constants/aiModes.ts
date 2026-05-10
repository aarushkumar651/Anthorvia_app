import { Colors } from '@theme/colors';

export type AIModeId =
  | 'fast'
  | 'think'
  | 'deep'
  | 'coach'
  | 'opening'
  | 'tactical'
  | 'endgame';

export interface AIMode {
  id: AIModeId;
  label: string;
  subtitle: string;
  color: string;
  glowColor: string;
  icon: string;
  systemContext: string;
  animationSpeed: 'fast' | 'normal' | 'slow';
  backgroundVariant: 'bright' | 'normal' | 'dark' | 'minimal';
}

export const AI_MODES: Record<AIModeId, AIMode> = {
  fast: {
    id: 'fast',
    label: 'Fast',
    subtitle: 'Quick answers',
    color: Colors.modes.fast,
    glowColor: 'rgba(0,212,255,0.3)',
    icon: 'zap',
    systemContext: 'Respond quickly and concisely. Keep answers under 100 words.',
    animationSpeed: 'fast',
    backgroundVariant: 'bright',
  },
  think: {
    id: 'think',
    label: 'Think',
    subtitle: 'Thoughtful analysis',
    color: Colors.modes.think,
    glowColor: 'rgba(99,102,241,0.3)',
    icon: 'brain',
    systemContext: 'Think carefully before responding. Provide structured analysis.',
    animationSpeed: 'normal',
    backgroundVariant: 'normal',
  },
  deep: {
    id: 'deep',
    label: 'Deep Analysis',
    subtitle: 'Maximum intelligence',
    color: Colors.modes.deep,
    glowColor: 'rgba(139,92,246,0.3)',
    icon: 'layers',
    systemContext: 'Perform exhaustive analysis. Reference specific games, moves, and patterns.',
    animationSpeed: 'slow',
    backgroundVariant: 'dark',
  },
  coach: {
    id: 'coach',
    label: 'Coach',
    subtitle: 'Personal coaching',
    color: Colors.modes.coach,
    glowColor: 'rgba(14,165,233,0.3)',
    icon: 'target',
    systemContext: 'Act as a personal chess coach. Be encouraging, specific, and actionable.',
    animationSpeed: 'normal',
    backgroundVariant: 'normal',
  },
  opening: {
    id: 'opening',
    label: 'Opening Expert',
    subtitle: 'Opening theory',
    color: Colors.modes.opening,
    glowColor: 'rgba(56,189,248,0.3)',
    icon: 'book-open',
    systemContext: 'You are an opening theory expert. Reference ECO codes and theory deeply.',
    animationSpeed: 'normal',
    backgroundVariant: 'normal',
  },
  tactical: {
    id: 'tactical',
    label: 'Tactical Trainer',
    subtitle: 'Find tactics',
    color: Colors.modes.tactical,
    glowColor: 'rgba(245,158,11,0.3)',
    icon: 'crosshair',
    systemContext: 'Focus on tactical patterns, combinations, and missed opportunities.',
    animationSpeed: 'fast',
    backgroundVariant: 'normal',
  },
  endgame: {
    id: 'endgame',
    label: 'Endgame Master',
    subtitle: 'Endgame precision',
    color: Colors.modes.endgame,
    glowColor: 'rgba(212,175,55,0.3)',
    icon: 'flag',
    systemContext: 'Focus on endgame technique, precision, and theoretical knowledge.',
    animationSpeed: 'slow',
    backgroundVariant: 'minimal',
  },
};

export const AI_MODE_LIST = Object.values(AI_MODES);
