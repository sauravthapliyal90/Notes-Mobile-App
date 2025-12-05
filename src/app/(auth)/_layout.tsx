import { Stack } from 'expo-router';
import React from 'react';
import './../global.css';

const authLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false} }>
     
      <Stack.Screen name='login' />
      <Stack.Screen name='signup' />
    </Stack>

  )
}

export default authLayout