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

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || password.length < 8) {
      Alert.alert('Check your details', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { user, tokens } = await authApi.register(
        email.toLowerCase().trim(),
        password,
        name.trim()
      );
      setAuth(user, tokens);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed.';
      Alert.alert('Error', message);
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

            <Text style={styles.title}>Join Anthorvia</Text>
            <Text style={styles.subtitle}>Begin your chess intelligence journey</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>YOUR NAME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Aarush Kumar"
                  placeholderTextColor={Colors.text.muted}
                  autoCapitalize="words"
                />
              </View>

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
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                />
              </View>

              <GlowButton
                label={loading ? 'Creating account...' : 'Create Account'}
                onPress={handleRegister}
                disabled={loading || !name || !email || password.length < 8}
                size="lg"
              />

              <TouchableOpacity
                style={styles.switchAuth}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.switchText}>
                  Have an account?{' '}
                  <Text style={{ color: Colors.glow.cyan }}>Sign in</Text>
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
  container: { flex: 1, backgroundColor: Colors.background.void },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
    alignItems: 'center',
  },
  logo: { marginBottom: Spacing['2xl'] },
  title: { ...Typography.title, color: Colors.text.primary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.text.secondary, marginBottom: Spacing['3xl'] },
  form: { width: '100%', gap: Spacing.lg },
  inputGroup: { gap: Spacing.xs },
  inputLabel: { ...Typography.label, color: Colors.text.muted },
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
  switchAuth: { alignItems: 'center', paddingVertical: Spacing.base },
  switchText: { ...Typography.body, color: Colors.text.secondary },
});
