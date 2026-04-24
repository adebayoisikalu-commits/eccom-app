import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const navigation = useNavigation();
  const { cart } = useContext(CartContext);

  const [user, setUser] = useState(null);

  const adminEmail = "adebayoisikalu@gmail.com";
 
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("authUser");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      };

      loadUser();
    }, [])
  );

  // LOGOUT
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");

    setUser(null);

    
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.inner}>

        {/* BRAND */}
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={styles.brand}>Vogue</Text>
        </Pressable>

        {/* CART */}
        <Pressable onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.link}>
            Cart ({cart?.length || 0})
          </Text>
        </Pressable>

        {/* ADMIN */}
        {user?.email === adminEmail && (
          <Pressable onPress={() => navigation.navigate("Admin")}>
            <Text style={styles.link}>Admin</Text>
          </Pressable>
        )}

        {/* USER */}
        {user && (
          <View style={styles.userBox}>
            <Text style={styles.welcome}>
              Hi, {user.name || "Shopper"}
            </Text>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f172b",
  },

  link: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4f87",
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  welcome: {
    fontSize: 12,
    color: "#7f728f",
    marginRight: 10,
  },

  logoutBtn: {
    backgroundColor: "#ff4f87",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
});