import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../types/index";

type Props = {
  note: Note;
  onPress: () => void;
};

export default function NoteCard({ note, onPress }: Props) {
  console.log("note", note.imageUri);
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" w-[48%] h-32 p-3 rounded-xl bg-primary  shadow-sm"
    >
      <View className="flex-row items-center mb-2">
        {note.imageUri ? (
          <Image
            source={{ uri: note.imageUri }}
            className="w-16 h-16 rounded-lg mr-3"
          />
        ) : (
          <View className="rounded-lg mr-3 bg-gray-200" />
        )}
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-white text-md">
          {note.title}
        </Text>
        {note.body ? (
          <Text className="text-secondary text-sm mt-1" numberOfLines={2}>
            {note.body}
          </Text>
        ) : (
          <Text className="text-gray-400 mt-1 italic">No content</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}