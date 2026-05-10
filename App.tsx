import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '@navigation/RootNavigator';
import { soundService } from '@services/soundService';
import { Config } from '@constants/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Config.QUERY_STALE_TIME,
      gcTime: Config.QUERY_CACHE_TIME,
      retry: 2,
    },
  },
});

export default function App() {
  useEffect(() => {
    soundService.initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#050508"
            translucent={false}
          />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
