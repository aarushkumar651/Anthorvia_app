import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { LivingBackground } from '@components/core/LivingBackground';
import { AntherviaLogo } from '@components/core/AntherviaLogo';
import { GlowButton } from '@components/core/GlowButton';
import { GlassCard } from '@components/core/GlassCard';
import { Colors, Typography, Spacing, BorderRadius } from '@theme/index';
import { authApi } from '@api/auth';
import { useAuthStore } from '@store/authStore';

const PERSONALITIES = [
  { id: 'balanced', label: 'Balanced', desc: 'Direct, honest, insightful' },
  { id: 'strict', label: 'Strict', desc: 'Demanding, precise, uncompromising' },
  { id: 'encouraging', label: 'Encouraging', desc: 'Warm, supportive, celebratory' },
  { id: 'analytical', label: 'Analytical', desc: 'Pure data, patterns, precision' },
];

export function OnboardingScreen() {
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<'chess.com' | 'lichess'>('chess.com');
  const [username, setUsername] = useState('');
  const [personality, setPersonality] = useState('balanced');
  const [loading, setLoading] = useState(false);

  const handleConnectPlatform = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      await authApi.connectPlatform(platform, username.trim());
      updateUser({ [`${platform === 'chess.com' ? 'chess_com' : 'lichess'}_username`]: username.trim() });
      setStep(2);
    } catch (err: any) {
      Alert.alert('Not Found', `Username "${username}" not found on ${platform}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile({ coach_personality: personality });
      await authApi.completeOnboarding();
      updateUser({ coach_personality: personality, onboarding_complete: true });
    } catch {
      updateUser({ onboarding_complete: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LivingBackground />

      <View style={styles.content}>
        <AntherviaLogo size={60} style={styles.logo} />

        {step === 0 && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Connect Your Chess Account</Text>
            <Text style={styles.stepSubtitle}>
              Anthorvia will analyze your games and reveal patterns invisible to the human eye.
            </Text>

            <View style={styles.platformRow}>
              {(['chess.com', 'lichess'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.platformButton,
                    platform === p && { borderColor: Colors.glow.cyan, backgroundColor: 'rgba(0,212,255,0.08)' },
                  ]}
                  onPress={() => setPlatform(p)}
                >
                  <Text style={[styles.platformLabel, { color: platform === p ? Colors.glow.cyan : Colors.text.secondary }]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder={`Your ${platform} username`}
              placeholderTextColor={Colors.text.muted}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <GlowButton
              label={loading ? 'Connecting...' : 'Connect Account'}
              onPress={handleConnectPlatform}
              disabled={loading || !username.trim()}
              size="lg"
            />

            <TouchableOpacity onPress={() => setStep(2)} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Your Coach</Text>
            <Text style={styles.stepSubtitle}>
              How should Anthorvia communicate with you?
            </Text>

            <View style={styles.personalityGrid}>
              {PERSONALITIES.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.personalityCard,
                    personality === p.id && {
                      borderColor: Colors.glow.indigo,
                      backgroundColor: 'rgba(99,102,241,0.10)',
                    },
                  ]}
                  onPress={() => setPersonality(p.id)}
                >
                  <Text style={[
                    styles.personalityLabel,
                    personality === p.id && { color: Colors.glow.indigo },
                  ]}>
                    {p.label}
                  </Text>
                  <Text style={styles.personalityDesc}>{p.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <GlowButton
              label={loading ? 'Setting up...' : 'Enter Anthorvia'}
              onPress={handleFinish}
              disabled={loading}
              size="lg"
              style={{ marginTop: Spacing.base }}
            />
          </Animated.View>
        )}

        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === step ? Colors.glow.cyan : Colors.border.default },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.void },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['3xl'],
    alignItems: 'center',
  },
  logo: { marginBottom: Spacing['2xl'] },
  stepContainer: { width: '100%', alignItems: 'center', gap: Spacing.base },
  stepTitle: { ...Typography.title, color: Colors.text.primary, textAlign: 'center' },
  stepSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.base,
  },
  platformRow: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  platformButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    alignItems: 'center',
    backgroundColor: Colors.background.elevated,
  },
  platformLabel: { ...Typography.bodyMedium },
  input: {
    width: '100%',
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
  },
  skipButton: { paddingVertical: Spacing.md },
  skipText: { ...Typography.caption, color: Colors.text.muted },
  personalityGrid: { width: '100%', gap: Spacing.md },
  personalityCard: {
    width: '100%',
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: 4,
  },
  personalityLabel: { ...Typography.bodyMedium, color: Colors.text.primary },
  personalityDesc: { ...Typography.caption, color: Colors.text.muted },
  dots: { flexDirection: 'row', gap: 8, marginTop: 'auto', marginBottom: Spacing['2xl'] },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
