import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function ProductCard({ product, addToCart }) {
  return (
    <Pressable style={styles.card}>

      {/* IMAGE */}
      <View style={styles.media}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
        />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        <Text style={styles.eyebrow}>Luxury Picks</Text>

        <Text style={styles.title}>
          {product.name}
        </Text>

        <Text style={styles.description}>
          {product.description ||
            "Elevated essentials designed to bring a refined finish to your everyday wardrobe."}
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>

          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>

        </View>

      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  media: {
    height: 230,
    backgroundColor: "#fff3f3",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  content: {
    padding: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: "#dc4e7d",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f172b",
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: "#756984",
    lineHeight: 18,
    marginBottom: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: {
    fontSize: 11,
    color: "#8a7f96",
    marginBottom: 2,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f172b",
  },

  button: {
    backgroundColor: "#ff4f87",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,

    shadowColor: "#ff4f87",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
});