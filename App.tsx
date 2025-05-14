import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Scan from './screens/Scan';
import MyPlants from './screens/MyPlants';
import GuideScreen from './screens/GuideScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Scan':
                iconName = 'camera';
                break;
              case 'My Plants':
                iconName = 'leaf';
                break;
              case 'Guide':
                iconName = 'book';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="My Plants" component={MyPlants} />
        <Tab.Screen name="Guide" component={GuideScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
