import React from "react";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <View className="flex-1">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search notes..."
        className=" bg-white p-3 rounded-xl border border-white"
        placeholderTextColor="#999"
      />
    </View>
  );
}
