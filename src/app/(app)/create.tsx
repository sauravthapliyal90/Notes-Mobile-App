
import "react-native-get-random-values";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";

import { saveImageToAppDir } from "../../api/filesystem";
import { useAuthStore } from "../../store/auth";
import { useNotesStore } from "../../store/notes";
import { validateTitle } from "../../utils/validation";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

export default function CreateNoteScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const addNote = useNotesStore((s) => s.addNote);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  // Request permission helpers (works for both camera & media library)
  const requestCameraPermissions = async () => {
    try {
      // For camera
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      // For media library (gallery)
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return cam.status === "granted" && lib.status === "granted";
    } catch (e) {
      console.warn("permission error", e);
      return false;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const ok = await requestCameraPermissions();
        if (!ok) {
          Alert.alert("Permission required", "Please grant photo permissions in settings.");
          return;
        }
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      // Expo v14+ uses `canceled` instead of `cancelled` sometimes; check both
      if ((res as any).cancelled === true || (res as any).canceled === true) return;

      const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
      if (!uri) return;

      // Save to app dir
      const saved = await saveImageToAppDir(uri, uuidv4());
      setImageUri(saved);
    } catch (e) {
      console.warn("pickImage error", e);
      Alert.alert("Error", "Could not pick image.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      if (status !== "granted") {
        const ok = await requestCameraPermissions();
        if (!ok) {
          Alert.alert("Permission required", "Please grant camera permissions in settings.");
          return;
        }
      }

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if ((res as any).cancelled === true || (res as any).canceled === true) return;

      const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
      if (!uri) return;

      const saved = await saveImageToAppDir(uri, uuidv4());
      setImageUri(saved);
    } catch (e) {
      console.warn("takePhoto error", e);
      Alert.alert("Error", "Could not take photo.");
    }
  };

  const onSave = async () => {
    // Basic validation
    const tErr = validateTitle(title);
    if (tErr) {
      Alert.alert("Validation", tErr);
      return;
    }

    if (!currentUser) {
      Alert.alert("Not logged in", "Please login or signup first.");
      return;
    }

    setSaving(true);
    try {
      // addNote expects Omit<Note,'createdAt'|'updatedAt'>
      addNote({
        id: uuidv4(),
        userId: currentUser.id,
        title: title.trim(),
        body: body.trim(),
        imageUri,
      });
      // Navigate back to list
      router.replace("/(app)");
    } catch (e) {
      console.warn("save note error", e);
      Alert.alert("Error", "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const onRemoveImage = () => {
    setImageUri(undefined);
  };

  return (
    <View className="flex-1 bg-black p-4 pt-10">
      {/* <View className="flex-1 mt-10 bg-black"> */}

     <View className="flex-row justify-between">
      <Pressable
      className="p-3"
      onPress={() => router.back()}
      >

      <Ionicons name="chevron-back-sharp" size={24} color="white"/>
      </Pressable>

     
      <TouchableOpacity
        onPress={onSave}
        disabled={saving}
        className={`p-3 rounded-lg ${saving ? "bg-blue-300" : "bg-blue-600"}`}
        >
        <Feather name="check" size={24} color="white"/>
      </TouchableOpacity>
      </View>
     
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="w-full text-3xl border text-white border-gray-300 border-l-0 border-r-0 border-t-0 rounded-lg p-3 mb-3"
        placeholderTextColor="#888"
        />

      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={setBody}
        className="w-full border-0 text-white rounded-lg p-3 mb-3 h- text-base"
        placeholderTextColor="#888"
        multiline
        />

      {imageUri ? (
        <View className="mb-3">
          <Image source={{ uri: imageUri }} className="w-full h-48 rounded-lg mb-2" />
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={onRemoveImage} className="flex-1 bg-red-500 p-3 rounded-lg items-center">
              <Text className="text-white">Remove image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} className="flex-1 bg-gray-200 p-3 rounded-lg items-center">
              <Text>Replace</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-row absolute bottom-0 left-6 gap-x-2 space-x-3 mb-4">
          <TouchableOpacity onPress={pickImage} className="flex-1 bg-gray-200 p-3 rounded-lg items-center">
            <Text>Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} className="flex-1 bg-gray-200 p-3 rounded-lg items-center">
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}


      </View>
    // </View>
  );
}
