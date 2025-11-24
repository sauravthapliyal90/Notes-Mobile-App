import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

type Props = {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  className?: string;
};

export default function IconButton({ icon, label, onPress, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center p-3 rounded-xl bg-blue-600 ${className}`}
    >
      {icon && <View className="mr-2">{icon}</View>}
      {label && <Text className="text-white font-medium">{label}</Text>}
    </TouchableOpacity>
  );
}
