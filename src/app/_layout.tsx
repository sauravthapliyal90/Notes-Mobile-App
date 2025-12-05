import { Stack } from "expo-router";
import 'react-native-get-random-values';
import { useAuthStore } from "../store/auth";
import './global.css';

export default function RootLayout() {
  const { user } = useAuthStore()

  return (
  <>
    <Stack screenOptions={{ headerShown: false} }>
      {!user ? (
        <>
         <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )} 
    </Stack>
    </>
  );
}
