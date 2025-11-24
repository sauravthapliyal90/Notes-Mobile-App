import { Stack } from "expo-router";
import {StatusBar} from "react-native"
import 'react-native-get-random-values';
import { useAuthStore } from "../store/auth";
import './global.css';
import { Background } from "@react-navigation/elements";

export default function RootLayout() {
  const { user } = useAuthStore()

  return (
  <>
    <Stack screenOptions={{ headerShown: false} }>
      {!user ? (
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )} 
    </Stack>
    </>
  );
}
