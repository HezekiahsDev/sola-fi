import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/auth/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'landing',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  <ToastProvider>
  <AuthProvider>
  <Stack>
  <Stack.Screen name="landing" options={{ headerShown: false }} />
  <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
  <Stack.Screen name="auth/signup" options={{ title: 'Sign up', headerShown: false }} />
  <Stack.Screen name="auth/create" options={{ title: 'Create Wallet', headerShown: false }} />
  <Stack.Screen name="auth/seed" options={{ title: 'Recovery Phrase', headerShown: false }} />
  <Stack.Screen name="auth/recover" options={{ title: 'Recover Wallet', headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                  {/* Register send as a root modal so it never appears in the tab bar */}
                  <Stack.Screen name="send" options={{ presentation: 'modal', headerShown: false }} />
  </Stack>
  </AuthProvider>
  </ToastProvider>
      </ThemeProvider>

      
    </>
  );
}

const styles = StyleSheet.create({});
