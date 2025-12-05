import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';
import NoteCard from '../../components/NoteCard';
// import SearchBar from '../../components/SearchBar';
import { useAuthStore } from '../../store/auth';
import { useNotesStore } from '../../store/notes';

import { CheckIcon, Empty, SearchIcon, ThreeDotIcon } from '@/src/constant/images';


export default function NotesList() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const notes = useNotesStore((s) => s.notes);
  const [ query, setQuery ] = useState('');
  const logout = useAuthStore((s) => s.logout)





  const userNotes = useMemo(() => {
    if (!currentUser) return [];
    return notes.filter((n) => n.userId === currentUser.id && (n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase())));
  }, [notes, currentUser, query]);

  const handleLogout = () => {
    logout();
       router.replace("/"); 
  }
  // console.log("userNotes",userNotes);
  // console.log("currentUser",currentUser);

  return (
      <>
    <View className="flex-1 bg-[#F6f3f3] p-4 pt-9">
      {/* <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      > */}

      <View className="bg-white flex-row items-center justify-between mb-4 mt-10 p-3  w-full self-center rounded-md shadow-lg">
        <Text className="text-xl  Pressable-bold text-[#151515] font-urbanist-bold">My Notes</Text>
        
        <View className="flex-row">

          <Pressable 
        //  onPress={}
        className="mr-3"
        >
          <CheckIcon width={32} height={32}/>
        </Pressable>

        <Pressable 
        //  onPress={}
        className="mr-3"
        >
          <SearchIcon width={32} height={32}/>
        </Pressable>
         
         <Pressable
         className="mr-3"
         >
          <ThreeDotIcon width={32} height={32}/>
         </Pressable>

        <Pressable
          className=""
          onPress={handleLogout}
          >
          {currentUser == null ? (
            <Ionicons name="person-circle" size={24} color="black"/>
          ) : ( 
            <MaterialIcons name="logout" size={24} color="white" />
          )
        }
        </Pressable>
        </View>
      </View>

      <View className='flex-row gap-2 items-center'>
        {/* <SearchBar value={query} onChange={setQuery} /> */}
      </View>

      <View className="mt-3">
        <FlatList
          data={userNotes}
          numColumns={2}
          // scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
              
                let colNum = index % 3;
                
                const color = [
                  "#E4FFD3",
                  "#FBFFDE",
                  "#FFDEEF"
                ]
              
                  const bgClass = color[colNum];
            return (
              <NoteCard note={item} onPress={() => router.push({ pathname: '/(app)/[id]', params: { id: item.id } })} bgcolor={bgClass}/>
              
            
            )}}
            ListEmptyComponent={
              <View className="bg-white w-full h-72 shadow-xl rounded-md flex items-center">
              {/* <Image source={empty} resizeMode="contain" className="w-20 h-32 mt-5 "/>  */}
              <View className=" mt-8">
              <Empty width={66} height={80}  />
              </View>
              <View className=" flex items-center w-[90%] mt-4">
              <Text className="Pressable-semibold  opacity-80 font-urbanist-semibold">You don’t have any notes yet</Text>
              <Pressable
              className=' w-[60%] py-4 rounded-xl bg-secondary flex items-center justify-center my-4 active:scale-95 pressed:bg-white '
              onPress={() => router.push('/(auth)/signup')}
              >
              <Text className='Pressable-semibold text-xl text-white font-urbanist-semibold'>Create Notes</Text>
              </Pressable>
              </View>
              </View>
            }
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 10,
            marginBottom: 10,
          }}
        />
      </View>
      {/* </ScrollView> */}
      <TouchableOpacity onPress={() => router.push('/(app)/create')} className="bg-secondary h-16 w-16 rounded-xl absolute bottom-32 right-9 z-20 items-center justify-center">
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
      
    </View>
    {/* <View className="absolute w-[105%] z-50 bottom-0 bg-white left-0">

      <Signup />
      </View> */}
    </>
  );
}