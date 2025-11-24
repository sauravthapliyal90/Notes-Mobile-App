import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
  <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "My Notes" }} />
      <Stack.Screen name="create" options={{ title: "Add Note" }} />
      <Stack.Screen name="[id]" options={{ title: "Note Details" }} />
    </Stack>
  )
}

export default _layout