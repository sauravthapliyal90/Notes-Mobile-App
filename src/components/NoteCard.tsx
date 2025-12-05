import {
  Urbanist_400Regular,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  useFonts,
} from '@expo-google-fonts/urbanist';
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../types/index";

type Props = {
  note: Note;
  onPress: () => void;
  bgcolor:string
};

export default function NoteCard({ note, onPress, bgcolor="#fca5a5" }: Props) {
  // console.log("note", note.imageUri);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });
  
  // console.log("colNum", bgcolor)
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-[100%] h-24 p-3 rounded-xl overflow-hidden`}
      style={{backgroundColor: bgcolor}}
    >
      <View className="flex-row justify-between items-center">

        <View>

          <Text className="font-semibold text-black text-lg Pressable-bold">
            {note.title}
          </Text>
            <Text className={`text-black text-sm mt-1 Pressable-semibold ${note.imageUri ? 'w-[53%]': ''} opacity-80`} numberOfLines={2}>
              {note.body}
            </Text>
        </View>

        {note.imageUri ? (
          <Image
            source={{ uri: note.imageUri }}
            className="absolute -right-3 w-32 h-32 rounded-lg"
          />
        ) : (
          <View />
        )}


      </View>
    </TouchableOpacity>
  );
}