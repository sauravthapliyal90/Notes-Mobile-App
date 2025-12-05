import {
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    useFonts,
} from '@expo-google-fonts/urbanist';
import { Link, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Bgnotes, Oknoted } from '../constant/images';

const index = () => {

  
//   const { width, height } = useWindowDimensions();
//  console.log("logg", width, height)
//   // your bg image is ~913 x 622 (width x height)
//   const bgWidth = width * 2; // make it a bit wider than screen so it can bleed
//   const bgAspectRatio = 913 / 622;
  
   const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or a splash/loader
  }



  return (
    <View className='flex-1 bg-[#f7f7f7] '>
      <View className='mx-10 mt-32'>
        <Oknoted width={150} height={50} />
        <Text className=' font-urbanist tracking-[3px] text-xl text-gray-500 mt-3'>Capture what's on your mind and save it.</Text>
      </View>
      {/* <ImageBackground 
        resizeMode="cover"
        source={bgCalendar}
        //  style={{
        //   position: "absolute",
        //   width: bgWidth,
        //   aspectRatio: bgAspectRatio,
        //   bottom: -height * 0.10,
        //   alignSelf: "center",
        //   opacity: 0.8,
        // }}
        className='w-full h-[620px] absolute bottom-[-100px] opacity-60 '
      />*/}
      <View className="absolute bottom-0  w-[393px] h-[518px] opacity-50">
  <Bgnotes 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMidYMin slice" 
  />
</View>
      <View className='w-[90%] bg-white/90 flex items-center rounded-xl shadow-md absolute bottom-16 self-center'>
        <View className='w-[90%] flex items-center my-5'>

          <Pressable
            className=' w-full py-4 rounded-xl bg-secondary flex items-center justify-center my-4 active:scale-95 pressed:bg-white'
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text className='Pressable-semibold text-xl text-white font-urbanist-semibold'>Sign Up</Text>
          </Pressable>
          <Text className='Pressable text-lg font-urbanist'>Already have an Account?<Link href='/(auth)/login' className='text-secondary'> Login</Link></Text>
          <View className="h-[1px] w-full bg-gray-300 my-4" />

          <Pressable
            className=' w-full py-4 rounded-xl bg-white border border-secondary flex items-center my-4 active:scale-95'
            onPress={() => router.push('/(app)/home')}
          >
            <Text className='Pressable-semibold text-xl text-secondary font-urbanist-semibold'>Explore app</Text>
          </Pressable>
        </View>
      </View>
      {/* </ImageBackground> */}
    </View>
  )
}

export default index