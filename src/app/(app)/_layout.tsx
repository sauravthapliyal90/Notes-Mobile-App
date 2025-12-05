import { Stack } from 'expo-router';
import {
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    useFonts,
} from '@expo-google-fonts/urbanist';
import { useEffect } from 'react';

const _layout = () => {


  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  if (!fontsLoaded) {
    return null; // ⏳ keep splash visible until fonts load
  }

  return (
  <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ title: "My Notes" }} />
      <Stack.Screen name="create" options={{ title: "Add Note" }} />
      <Stack.Screen name="[id]" options={{ title: "Note Details" }} />
    </Stack>
  )
}


export default _layout