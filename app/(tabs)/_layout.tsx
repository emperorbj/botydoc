import { View, Text } from 'react-native'
import React from 'react'
import { Tabs} from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '@/constants/constants'

const TabLayout = () => {

  const insets = useSafeAreaInsets() 
  return (
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
        tabBarIcon:({color,size})=>(<Ionicons name="home-outline" size={size} color={color}/>)
        }} /> 

      <Tabs.Screen name="chat" options={{title:"Chat",
        tabBarIcon:({color,size})=>(<Ionicons name="add-circle-outline" size={size} color={color}/>)
      }}/> 
      
      <Tabs.Screen name="docs" options={{title:"Files",
        tabBarIcon:({color,size})=>(<Ionicons name="person-outline" size={size} color={color}/>)
      }}/>
      
    </Tabs>
  )
}

export default TabLayout