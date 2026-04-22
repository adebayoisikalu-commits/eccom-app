import { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { CartContext } from "../context/CartContext";

export default function CartScreen() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
  } = useContext(CartContext);

  const handleRemove = (id) => {
    Alert.alert("Remove Item", "Do you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(id),
      },
    ]);
  };

  if (!cart.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            {/* Product Info */}
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.qtyBox}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item._id)}
              >
                <Text style={styles.qtyText}>−</Text>
              </Pressable>

              <Text style={styles.qty}>{item.quantity}</Text>

              <Pressable
                style={styles.qtyBtn}
                onPress={() => increaseQty(item._id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
            </View>

            {/* Remove */}
            <Pressable
              style={styles.removeBtn}
              onPress={() => handleRemove(item._id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />

      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total: ${total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f7fb",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    gap: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  price: {
    color: "#666",
    marginTop: 4,
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: "#ff4f87",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  qty: {
    fontSize: 16,
    fontWeight: "700",
  },

  removeBtn: {
    marginTop: 10,
    backgroundColor: "#e14878",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  removeText: {
    color: "#fff",
    fontWeight: "700",
  },

  totalBox: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },

  totalText: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 20,
    color: "#777",
  },
});