import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useUsersStore } from '../../store/user';
import { hashString } from '../../utils/crypto';


export default function Signup() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const addUser = useUsersStore((s) => s.addUser);
    const findByUsername = useUsersStore((s) => s.findByUsername);
    const loginLocal = useAuthStore((s) => s.loginLocal);
    const [error, setError] = useState('');


    const onSubmit = async () => {
        setError('');
        if (!username.trim() || !pin) return setError('Provide username and PIN');
        if (findByUsername(username.trim())) return setError('Username already exists');

        const pinHash = await hashString(pin);

        const user = addUser(username.trim(), pinHash);
        console.log("yes")
        await loginLocal({ id: user.id, username: user.username });
        router.replace('/login');
    };


    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="text-4xl font-bold mb-8">Signup</Text>
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
            <Pressable onPress={onSubmit} className="w-full bg-green-600 mt-5 p-3 rounded-lg">
                <Text className="text-white text-center">Create account</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/login')} className="mt-4">
                <Text className="text-blue-600">Already have an account?</Text>
            </Pressable>
        </View>
    );
}