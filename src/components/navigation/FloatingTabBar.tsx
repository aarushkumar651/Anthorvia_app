import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BorderRadius, Spacing } from '@theme/index';
import { Springs } from '@animations/springs';
import { useHaptics } from '@hooks/useMicroInteraction';
import { soundService } from '@services/soundService';

const TABS = [
  { key: 'Chat', label: 'Coach', icon: '◈' },
  { key: 'Dashboard', label: 'Intel', icon: '◎' },
  { key: 'Analysis', label: 'Analysis', icon: '◇' },
  { key: 'Voice', label: 'Voice', icon: '◉' },
];

interface FloatingTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const { lightTap } = useHaptics();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.container}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const route = state.routes[index];

          const scale = useSharedValue(1);
          const dotOpacity = useSharedValue(isFocused ? 1 : 0);

          const scaleStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));

          const dotStyle = useAnimatedStyle(() => ({
            opacity: dotOpacity.value,
          }));

          const handlePress = async () => {
            lightTap();
            await soundService.play('ui_tap');
            scale.value = withSpring(0.9, Springs.SNAPPY, () => {
              scale.value = withSpring(1.0, Springs.ELASTIC);
            });
            dotOpacity.value = withTiming(1, { duration: 200 });

            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Animated.View key={tab.key} style={[styles.tabWrapper, scaleStyle]}>
              <TouchableOpacity
                style={styles.tab}
                onPress={handlePress}
                activeOpacity={1}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    { color: isFocused ? Colors.glow.cyan : Colors.text.muted },
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? Colors.glow.cyan : Colors.text.muted },
                  ]}
                >
                  {tab.label}
                </Text>
                <Animated.View style={[styles.activeDot, dotStyle]} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    shadowColor: Colors.glow.indigo,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  tabWrapper: {
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: 3,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.glow.cyan,
    shadowColor: Colors.glow.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});
