import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AuthDashboardScreen from '../screens/AuthDashboardScreen';
import TrainScreen from '../screens/TrainScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accentDeep,
          tabBarInactiveTintColor: '#8a9a94',
          tabBarStyle: {
            backgroundColor: colors.surfaceCard,
            borderTopColor: colors.borderSoft,
            paddingTop: 4,
            height: 58,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="waveform" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AuthDashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Train"
          component={TrainScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="brain" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
