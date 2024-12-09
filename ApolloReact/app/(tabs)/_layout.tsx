import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#485779',
            tabBarInactiveTintColor: '1a1a1a',
            headerStyle: {
                backgroundColor: '#fa8667',
            },
            headerShadowVisible: false,
            headerTintColor: '#1a1a1a',
            tabBarStyle: {
                backgroundColor: '#fa8667',
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
        <Tabs.Screen
            name="subscriptions"
            options={{
                title: 'Subscriptions',
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'diamond' : 'diamond-outline'} color={color} size={24}/>
            ),
            }}
        />
    </Tabs>
  );
}
