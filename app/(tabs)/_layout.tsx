import {StyleSheet} from 'react-native'
import React from 'react'
import { Tabs} from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '@/constants/constants'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TabLayout = () => {

  const insets = useSafeAreaInsets() 
  return (
    <GestureHandlerRootView style={styles.container}>
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:COLORS.primary,

      headerShadowVisible:false,
      tabBarStyle:{
        backgroundColor:COLORS.cardBackground,
        borderTopColor:COLORS.border,
        borderTopWidth:1,
        paddingTop:5,
        height:60 + insets.bottom,

      }
    }}>
      <Tabs.Screen name="index" options={{
        title:"Upload",
        tabBarIcon:({color,size})=>(<Ionicons name="cloud-upload" size={size} color={COLORS.primary}/>)
        }} /> 

      <Tabs.Screen name="chat" options={{title:"Chat",
        tabBarIcon:({color,size})=>(<Ionicons name="chatbubble-outline" size={size} color={color}/>)
      }}/> 
      
      <Tabs.Screen name="docs" options={{title:"Files",
        tabBarIcon:({color,size})=>(<Ionicons name="document-text-outline" size={size} color={color}/>)
      }}/>
      
    </Tabs>
    </GestureHandlerRootView>
  )
}

export default TabLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});