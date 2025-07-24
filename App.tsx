import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Payment from './screens/Payment'; 
import MyPlants from './screens/MyPlants';
import GuideScreen from './screens/GuideScreen';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux'; 
import { store } from './store/index'; 
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}> 
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string;

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Payment':
                  iconName = 'card';
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
          <Tab.Screen name="Payment" component={Payment} />
          <Tab.Screen name="My Plants" component={MyPlants} />
          <Tab.Screen name="Guide" component={GuideScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}