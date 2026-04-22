import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Image, Alert, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://e-commerce-g5xv.onrender.com/api/products";

export default function AdminScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load products");
      console.log("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert("Error", "Name and price are required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Product updated");
        setEditingId(null);
      } else {
        await axios.post(API_BASE_URL, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Product added");
      }

      setForm({ name: "", price: "", description: "", image: "" });
      fetchProducts();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to save product");
      console.log("SUBMIT ERROR:", err.response?.data || err.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Remove this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("authToken");
            await axios.delete(`${API_BASE_URL}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Success", "Product deleted");
            fetchProducts();
          } catch (err) {
            Alert.alert("Error", "Failed to delete product");
            console.log("DELETE ERROR:", err.response?.data || err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Admin Panel</Text>

      {/* FORM */}
      <TextInput
        placeholder="Product Name"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={form.price}
        onChangeText={(t) => setForm({ ...form, price: t })}
        style={styles.input}
        keyboardType="decimal-pad"
      />

      <TextInput
        placeholder="Image URL"
        value={form.image}
        onChangeText={(t) => setForm({ ...form, image: t })}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={form.description}
        onChangeText={(t) => setForm({ ...form, description: t })}
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={3}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {editingId ? "Update Product" : "Add Product"}
        </Text>
      </Pressable>

      {editingId && (
        <Pressable 
          style={[styles.button, styles.cancelBtn]} 
          onPress={() => {
            setEditingId(null);
            setForm({ name: "", price: "", description: "", image: "" });
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Cancel Edit
          </Text>
        </Pressable>
      )}

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff4f87" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text numberOfLines={2} style={styles.description}>{item.description}</Text>

                <View style={styles.row}>
                  <Pressable 
                    onPress={() => {
                      setForm(item);
                      setEditingId(item._id);
                    }}
                    style={styles.editBtn}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>

                  <Pressable 
                    onPress={() => handleDelete(item._id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  title: { 
    fontSize: 22, 
    fontWeight: "800", 
    marginBottom: 16,
    color: "#1f172b",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  inputMultiline: {
    textAlignVertical: "top",
    height: 80,
  },

  button: {
    backgroundColor: "#ff4f87",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#999",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 150,
  },

  cardContent: {
    padding: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "800",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4f87",
  },

  description: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  editBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  deleteBtn: {
    backgroundColor: "#f44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});