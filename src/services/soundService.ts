import { Audio } from 'expo-av';
import { Config } from '@constants/config';

type SoundKey =
  | 'ui_tap'
  | 'neural_pulse'
  | 'stream_tick'
  | 'voice_activate'
  | 'analysis_done'
  | 'mode_switch'
  | 'transition_whoosh';

class SoundService {
  private sounds: Partial<Record<SoundKey, Audio.Sound>> = {};
  private enabled = Config.SOUND_ENABLED;
  private volume = Config.SOUND_MASTER_VOLUME;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
    } catch {}
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  async play(key: SoundKey) {
    if (!this.enabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        this.getSoundAsset(key),
        { volume: this.volume, shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  private getSoundAsset(key: SoundKey): any {
    const map: Record<SoundKey, any> = {
      ui_tap: require('../../assets/sounds/ui_tap.wav'),
      neural_pulse: require('../../assets/sounds/neural_pulse.wav'),
      stream_tick: require('../../assets/sounds/stream_tick.wav'),
      voice_activate: require('../../assets/sounds/voice_activate.wav'),
      analysis_done: require('../../assets/sounds/analysis_done.wav'),
      mode_switch: require('../../assets/sounds/mode_switch.wav'),
      transition_whoosh: require('../../assets/sounds/transition_whoosh.wav'),
    };
    return map[key];
  }
}

export const soundService = new SoundService();
