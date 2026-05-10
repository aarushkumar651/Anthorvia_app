import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen } from '@screens/main/ChatScreen';
import { DashboardScreen } from '@screens/main/DashboardScreen';
import { AnalysisScreen } from '@screens/main/AnalysisScreen';
import { VoiceScreen } from '@screens/main/VoiceScreen';
import { FloatingTabBar } from '@components/navigation/FloatingTabBar';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Voice" component={VoiceScreen} />
    </Tab.Navigator>
  );
}
