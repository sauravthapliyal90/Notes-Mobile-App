import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { AlignIcon, BackIcon, CheckIcon, ColorIcon, FontSizeIcon, ImagePickerIcon } from "@/src/constant/images";
import { saveImageToAppDir } from "../../api/filesystem";
import { useAuthStore } from "../../store/auth";
import { useNotesStore } from "../../store/notes";
import { validateTitle } from "../../utils/validation";

export default function CreateNoteScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const addNote = useNotesStore((s) => s.addNote);

  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
  const weekDay = now.toLocaleDateString("en-US", { weekday: "long" });
  // const time = now.toLocaleTimeString('en-US', optionsTime);
  const time = now.toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,  // 👈 ensures 24-hour format
});


  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);


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
      router.replace("/(app)/home");
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
      <>
    <View className="flex-1 bg-[[#F6f3f3]] p-4 pt-10">
      {/* <View className="flex-1 mt-10 bg-black"> */}
      <View className="bg-white flex-row items-center justify-between mb-4 mt-10  px-2  w-full self-center rounded-md shadow-lg">
        <Pressable
          onPress={() => router.back()}
          className="p-4"
        >
          <BackIcon width={15} height={20} />
        </Pressable>

        <View className="flex-row">

          <Pressable
            onPress={onSave}
            className=" p-2"
          >
            <CheckIcon width={32} height={32} />
          </Pressable>

        </View>
      </View>

      <View className="bg-white flex-1 rounded-3xl p-4 mb-4">

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          className="w-full text-3xl border-0 font-urbanist-semibold Pressable-bold text-black"
          placeholderTextColor="#888"
         onPress={() => setShowImageMenu(false)}
        />

        <Text className="text-[#888] Pressable ml-1 mb-5 text-sm font-urbanist">{weekDay}, {date} at {time}</Text>
        <ScrollView 
        className="flex-1"
       contentContainerStyle={{ flexGrow: 1 }}
       keyboardShouldPersistTaps="handled"
        >

        {imageUri ? (
          <>
          {/* <TouchableOpacity onPress={onRemoveImage} className="flex-1 bg-red-500 p-3 rounded-lg items-center">
              <Text className="text-white">Remove image</Text>
              </TouchableOpacity> */}
          <Image source={{ uri: imageUri }} className="w-full h-48 rounded-lg mt-2" />
        <TextInput
          placeholder="Note"
          value={body}
          onChangeText={setBody}
          className="w-full border-0 font-urbanist-semibold text-black Pressable-semibold rounded-lg mt-2 mb-3 text-base"
          placeholderTextColor="#888"
          multiline
           textAlignVertical="top"
           onPress={() => setShowImageMenu(false)}
          />
          </>
        ) : (<TextInput
          placeholder="Note"
          value={body}
          onChangeText={setBody}
          className="flex-1  border-0 font-urbanist-semibold bg-white text-black Pressable-semibold rounded-lg mt-2 mb-3 text-base"
          placeholderTextColor="#888"
          multiline
           textAlignVertical="top"
           onPress={() => setShowImageMenu(false)}
          />)}
        
          </ScrollView>
      </View>

    </View>

    {showImageMenu && (
    <View className="absolute z-20 bottom-24 w-32 right-6 bg-[#2b2b2b] rounded-2xl py-3 px-4 shadow-lg">
      <TouchableOpacity
        className="py-1"
        onPress={async () => {
          setShowImageMenu(false);
          await takePhoto();
        }}
      >
        <Text className="text-white text-base mb-1">Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-1"
        onPress={async () => {
          setShowImageMenu(false);
          await pickImage();
        }}
      >
        <Text className="text-white text-base mb-1">Albums</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-1"
        onPress={() => {
          setShowImageMenu(false);
          // handle doodle here
        }}
      >
        <Text className="text-white text-base">Doodle</Text>
      </TouchableOpacity>
    </View>
  )}
        <View className="bg-white w-full flex-row px-8 pt-4  justify-between h-24">
          {/* <TouchableOpacity onPress={pickImage} className="">
            <Text>Pick Image</Text>
          </TouchableOpacity>
           */}
          {/* <TouchableOpacity onPress={takePhoto} className="flex-1 bg-gray-200 p-3 rounded-lg items-center">
            <Text>Take Photo</Text>
          </TouchableOpacity> */}
          <FontSizeIcon 
           width={25}
           height={20}
          />
          <AlignIcon 
           width={25}
           height={20}
          />
          <ColorIcon 
           width={25}
           height={20}
          />
          <Pressable
          className={showImageMenu ? `opacity-50` : ``}
          onPress={() => setShowImageMenu((prev) => !prev)}
          >
          <ImagePickerIcon 
           width={25}
           height={20}
           />
           </Pressable>

        </View>
    </>
  );
}
