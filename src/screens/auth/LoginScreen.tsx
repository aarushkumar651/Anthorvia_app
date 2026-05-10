import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { LivingBackground } from '@components/core/LivingBackground';
import { AntherviaLogo } from '@components/core/AntherviaLogo';
import { GlowButton } from '@components/core/GlowButton';
import { Colors, Typography, Spacing, BorderRadius } from '@theme/index';
import { authApi } from '@api/auth';
import { useAuthStore } from '@store/authStore';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const { user, tokens } = await authApi.login(email.toLowerCase().trim(), password);
      setAuth(user, tokens);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed. Check your credentials.';
      Alert.alert('Sign In Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LivingBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
            <AntherviaLogo size={70} style={styles.logo} />

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your AI coach</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                  onSubmitEditing={handleLogin}
                />
              </View>

              <GlowButton
                label={loading ? 'Signing in...' : 'Sign In'}
                onPress={handleLogin}
                disabled={loading || !email || !password}
                size="lg"
                style={{ marginTop: Spacing.sm }}
              />

              <TouchableOpacity
                style={styles.switchAuth}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.switchText}>
                  No account?{' '}
                  <Text style={{ color: Colors.glow.cyan }}>Create one</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.void,
  },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
    alignItems: 'center',
  },
  logo: { marginBottom: Spacing['2xl'] },
  title: {
    ...Typography.title,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing['3xl'],
  },
  form: { width: '100%', gap: Spacing.lg },
  inputGroup: { gap: Spacing.xs },
  inputLabel: {
    ...Typography.label,
    color: Colors.text.muted,
  },
  input: {
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
  },
  switchAuth: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  switchText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
});
