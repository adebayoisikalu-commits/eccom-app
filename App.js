 import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AdminScreen from "./screens/AdminScreen";

// Context
import { CartProvider } from "./context/CartContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

 
const getUser = async () => {
  const token = await AsyncStorage.getItem("authToken");
  const user = await AsyncStorage.getItem("authUser");

  if (!token || !user) return null;

  try {
    return JSON.parse(user);
  } catch (err) {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
    return null;
  }
};

 
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

 
function RootNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  const adminEmail = "adebayoisikalu@gmail.com";

  useEffect(() => {
    const checkAuth = async () => {
      const u = await getUser();
      setUser(u);
      setLoading(false);
    };

    checkAuth();
  }, []);

 
  useEffect(() => {
    const interval = setInterval(async () => {
      const u = await getUser();
      setUser(u);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* NOT LOGGED IN */}
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          {/* MAIN APP */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* ADMIN ONLY */}
          {user.email === adminEmail && (
            <Stack.Screen name="Admin" component={AdminScreen} />
          )}
        </>
      )}

    </Stack.Navigator>
  );
}

 
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}