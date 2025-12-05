/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [ "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       fontFamily: {
        urbanist: ["Urbanist_400Regular"],
        "urbanist-semibold": ["Urbanist_600SemiBold"],
        "urbanist-bold": ["Urbanist_700Bold"],
      },
      colors: {
        primary: "#343434",
        // secondary: "#8e8e8e",
        secondary:"#00909d",
        green:"#E4FFD3",
        yellow:"#FBFFDE",
        red: "#FFDEEF"
      }
    },
  },
  plugins: [],
}