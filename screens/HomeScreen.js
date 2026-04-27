 import { useEffect, useState, useContext, useRef } from "react";
import {View,Text,FlatList,StyleSheet,Pressable,Image,ScrollView,ActivityIndicator,Alert,} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from "../context/CartContext";

const API_BASE_URL = "https://e-commerce-g5xv.onrender.com/api/products";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isShopPressed, setIsShopPressed] = useState(false);
  const scrollViewRef = useRef(null);

  const { addToCart, cart } = useContext(CartContext);
  const adminEmail = "adebayoisikalu@gmail.com";

 
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("authUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

 
  useEffect(() => {
    axios
      .get(API_BASE_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.log("PRODUCT ERROR:", err);
        Alert.alert("Error", "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

 
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("authUser");
      
        },
      },
    ]);
  };

  const handleGoToAdmin = () => {
    navigation.navigate("Admin");
  };

  const handleShopCollection = () => {
    scrollViewRef.current?.scrollTo({
      y: 600,
      animated: true,
    });
  };

  const featuredProducts = products.slice(0, 20);

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <Pressable onPress={() => {}}>
            <Text style={styles.brand}>Vogue</Text>
          </Pressable>

          <View style={styles.navRight}>
            <Pressable onPress={() => navigation.navigate("Cart")}>
              <Text style={styles.link}>
                Cart ({cart?.length || 0})
              </Text>
            </Pressable>

            {user?.email === adminEmail && (
              <Pressable onPress={handleGoToAdmin}>
                <Text style={styles.link}>Admin</Text>
              </Pressable>
            )}

            {user && (
              <View style={styles.userBox}>
                <Text style={styles.welcome}>
                  Hi, {user.name || "Shopper"}!
                </Text>
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                  <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.badge}>Premium Fashion Store</Text>

        <Text style={styles.title}>
          Level Up Your Style With Our Summer Collection
        </Text>

        <Text style={styles.subtitle}>
          Discover elevated essentials, modern fashion, and timeless pieces
        </Text>

         {/* HERO IMAGE */}
        <Image
          source={{
            uri: "https://www.instyle.com/thmb/nswLuCLoYaOgGKS1mf3SxULvl7E=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-2214264711-8c1da132de854bea92ad54a52935689d.jpg",
          }}
          style={styles.heroImage}
        />

        <Pressable 
          style={[styles.button, isShopPressed && styles.buttonPressed]}
          onPress={handleShopCollection}
          onPressIn={() => setIsShopPressed(true)}
          onPressOut={() => setIsShopPressed(false)}
        >
          <Text style={styles.buttonText}>Shop Collection</Text>
        </Pressable>
      </View>

      {/* TITLE */}
      <Text style={styles.sectionTitle}>Featured Products</Text>

      {/* LOADING */}
      {loading && <ActivityIndicator size="large" color="#ff4f87" />}

      {/*product */}
      <FlatList
        data={featuredProducts}
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.productName}>{item.name}</Text>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.row}>
                <Text style={styles.price}>${item.price}</Text>

                <Pressable
                  style={styles.cartBtn}
                  onPress={() => {
                    addToCart(item);
                    Alert.alert("Success", `${item.name} added to cart!`);
                  }}
                >
                  <Text style={styles.cartText}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  navbar: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingBottom: 10,
    elevation: 2,
  },

  navContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f172b",
  },

  navRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  link: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f172b",
  },

  userBox: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },

  welcome: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f172b",
  },

  logoutBtn: {
    backgroundColor: "#ff4f87",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11,
  },

  hero: {
    padding: 22,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  badge: {
    color: "#ff4f87",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    color: "#6f637f",
    marginBottom: 12,
  },

  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginVertical: 12,
  },

  button: {
    backgroundColor: "#ff4f87",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    margin: 16,
  },

  card: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 220,
  },

  cardContent: {
    padding: 12,
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
  },

  description: {
    color: "#777",
    marginVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 16,
    fontWeight: "900",
  },

  cartBtn: {
    backgroundColor: "#ff4f87",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  cartText: {
    color: "#fff",
    fontWeight: "800",
  },
});