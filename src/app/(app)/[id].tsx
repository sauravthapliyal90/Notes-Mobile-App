
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNotesStore } from "../../store/notes";
import { validateTitle } from "../../utils/validation";
import { nowIso } from "../../utils/date";

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const getNoteById = useNotesStore((s) => s.getNoteById);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const note = getNoteById(String(id));

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Note not found</Text>
      </View>
    );
  }

  const onSave = () => {
    const err = validateTitle(title);
    if (err) {
      Alert.alert("Validation", err);
      return;
    }

    updateNote({
      id: note.id,
      title: title.trim(),
      body: body.trim(),
      updatedAt: nowIso(),
    });

    setEditing(false);
  };

  const onDelete = () => {
    Alert.alert("Delete note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteNote(note.id);
          router.replace("/(app)");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 mt-10">
        {/* <View className="flex-row justify-between"> */}
      
      <Pressable
      className="p-3"
      onPress={() => router.back()}
      >

      <Ionicons name="chevron-back-sharp" size={24} color="white"/>
      </Pressable>
     
        {!editing ? (
          <View className="flex-row justify-center items-center">
          <Pressable
            onPress={() => setEditing(true)}
            className="bg-blue-600 p-3 rounded-lg mr-1"
            >
            <AntDesign name="edit" size={24} color="white" />
          </Pressable>
          
          <Pressable
        onPress={onDelete}
        className="bg-red-600 p-3 rounded-lg"
        >
        <MaterialIcons name="delete-outline" size={24} color="white" />
      </Pressable>
        </View>
        ) : (
          <TouchableOpacity
            onPress={onSave}
            className="bg-green-600 px-4 py-2 rounded-lg "
          >
        <Feather name="check" size={24} color="white"/>
          </TouchableOpacity>
        )}
        {/* </View> */}
      </View>

      {/* Image */}
      {note.imageUri && (
        <Image
          source={{ uri: note.imageUri }}
          className="w-full h-56 rounded-xl mb-4"
        />
      )}

      {/* Title */}
      {editing ? (
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          className="border-r-0 border-l-0 border-t-0 text-white border-white rounded-lg p-3 mb-3 text-3xl"
        />
      ) : (
        <Text className="text-3xl text-white font-semibold mb-3">{note.title}</Text>
      )}

      {/* Body */}
      {editing ? (
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Write something..."
          multiline
          className="border-0 text-gray-700 border-gray-300 rounded-lg p-3 text-base"
        />
      ) : (
        <Text className="text-base text-gray-700 leading-6">{note.body}</Text>
      )}

      {/* Delete button */}
      
    </ScrollView>
  );
}
