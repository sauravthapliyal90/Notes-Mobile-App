import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsersStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import { hashString } from '../../utils/crypto';


export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const users = useUsersStore((s) => s.users);
    const findByUsername = useUsersStore((s) => s.findByUsername);
    const loginLocal = useAuthStore((s) => s.loginLocal);
    const [error, setError] = useState('');


    const onSubmit = async () => {
        const user = findByUsername(username.trim());
        if (!user) return setError('User not found');
        const hashed = await hashString(pin);
        if (hashed !== user.pinHash) return setError('Invalid PIN');
        await loginLocal({ id: user.id, username: user.username });
        router.push('/(app)/home');
    };


    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="text-4xl font-bold p-2 mb-8">Login</Text>
            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                className="w-full border border-gray-300 rounded-lg p-3 mb-5"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="PIN"
                value={pin}
                secureTextEntry
                onChangeText={setPin}
                className="w-full border border-gray-300 rounded-lg p-3 mb-5"
            />
            <Pressable onPress={onSubmit} className="w-full bg-blue-600 p-3 mt-5 rounded-lg">
                <Text className="text-white text-center">Login</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/signup')} className="mt-4">
                <Text className="text-blue-600">Create account</Text>
            </Pressable>
        </View>
    );
}