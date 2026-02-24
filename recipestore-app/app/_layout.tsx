import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup && segments[0] !== 'Login' && segments[0] !== 'Register') {
      // Redirect to login if not authenticated
      router.replace('/Login');
    } else if (isAuthenticated && (segments[0] === 'Login' || segments[0] === 'Register')) {
      // Redirect to home if authenticated and on auth screens
      router.replace('/Home');
    }
  }, [isAuthenticated, segments, loading]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ title: "Home" }} />
        <Stack.Screen name="AddRecipe" options={{ title: "Add Recipes" }} />
        <Stack.Screen name="ViewRecipes" options={{ title: "View Recipes" }} />
        <Stack.Screen name="RecipeDetail" options={{ title: "Recipe Detail" }} />
        <Stack.Screen name="EditRecipe" options={{ title: "Edit Recipe" }} />
        <Stack.Screen name="PantryView" options={{ title: "Pantry" }} />
        <Stack.Screen name="AddPantryItem" options={{ title: "Add Pantry" }} />
        <Stack.Screen name="RandomRecipe" options={{ title: "Random Recipe" }} />
        <Stack.Screen name="MealPlanner" options={{ title: "Meal Planner" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
