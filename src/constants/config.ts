export const Config = {
  API_BASE_URL: 'https://anthorvia.up.railway.app/api/v1',
  WS_URL: 'wss://anthorvia.up.railway.app/voice',
  APP_NAME: 'Anthorvia',
  APP_TAGLINE: 'Chess Intelligence. Evolved.',

  CHAT_STREAMING: true,
  MAX_MESSAGE_LENGTH: 2000,
  STREAMING_CHAR_DELAY_MS: 14,

  QUERY_STALE_TIME: 1000 * 60 * 5,
  QUERY_CACHE_TIME: 1000 * 60 * 30,

  SPLASH_DURATION_MS: 3200,
  LOGO_ANIMATION_MS: 1400,

  PLACEHOLDER_CYCLE_MS: 4000,

  HAPTICS_ENABLED: true,
  SOUND_ENABLED: true,
  SOUND_MASTER_VOLUME: 0.35,
} as const;
