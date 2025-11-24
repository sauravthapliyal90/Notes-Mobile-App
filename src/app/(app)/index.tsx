import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import NoteCard from '../../components/NoteCard';
import SearchBar from '../../components/SearchBar';
import { useAuthStore } from '../../store/auth';
import { useNotesStore } from '../../store/notes';


export default function NotesList() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const notes = useNotesStore((s) => s.notes);
  const [query, setQuery] = useState('');
  const logout = useAuthStore((s) => s.logout)


  const userNotes = useMemo(() => {
    if (!currentUser) return [];
    return notes.filter((n) => n.userId === currentUser.id && (n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase())));
  }, [notes, currentUser, query]);

  const handleLogout = () => {
    logout();
    router.push("/(auth)/login")
  }
  // console.log("userNotes",userNotes);
  // console.log("currentUser",currentUser);

  return (
    <View className="flex-1 bg-black p-4 mt-10">
      {/* <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      > */}

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-4xl font-bold text-white">My Notes</Text>
        <Ionicons
          className=""
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="white" />
        </Ionicons>
      </View>

      <View className='flex-row gap-2 items-center'>
        <SearchBar value={query} onChange={setQuery} />
      </View>

      <View className="mt-6">
        <FlatList
          data={userNotes}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard note={item} onPress={() => router.push({ pathname: '/(app)/[id]', params: { id: item.id } })} />}
          ListEmptyComponent={<Text className="text-gray-500 mt-6">No notes yet.</Text>}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 10,
            marginBottom: 10,
          }}
        />
      </View>
      {/* </ScrollView> */}
      <TouchableOpacity onPress={() => router.push('/(app)/create')} className="bg-blue-600 h-20 w-20 rounded-full absolute bottom-32 right-14 z-20 items-center justify-center">
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}