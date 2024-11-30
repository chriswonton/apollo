import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#00b2b6',
            tabBarInactiveTintColor: '#1a1a1a',
            headerStyle: {
                backgroundColor: '#fff85d',
            },
            headerShadowVisible: false,
            headerTintColor: '#1a1a1a',
            tabBarStyle: {
                backgroundColor: '#fff85d',
            },
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                ),
            }}
        />
        <Tabs.Screen
            name="listen"
            options={{
                title: 'Listen',
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'radio' : 'radio-outline'} color={color} size={24}/>
            ),
            }}
        />
        <Tabs.Screen
            name="songs"
            options={{
                title: 'Songs',
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'musical-notes' : 'musical-notes-outline'} color={color} size={24}/>
            ),
            }}
        />
    </Tabs>
  );
}
