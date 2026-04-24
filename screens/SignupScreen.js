import { useState } from "react";
import {View,Text,TextInput,Pressable,StyleSheet,Alert,} from "react-native";
import axios from "axios";

const API_BASE_URL = "https://e-commerce-g5xv.onrender.com/api";

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSignup = async () => {
    const check = validate();
    setErrors(check);

    if (Object.keys(check).length > 0) return;

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/auth/register`,
        formData
      );
      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      navigation.replace("Login");

    } catch (err) {
      Alert.alert(
        "Signup Failed",
        err.response?.data?.message || "Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join and start your shopping journey
      </Text>

      {/*name*/}
      <TextInput
        placeholder="Name"
        style={[styles.input, errors.name && styles.errorInput]}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={!loading}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name}</Text>
      )}

      {/*email*/}
      <TextInput
        placeholder="Email"
        style={[styles.input, errors.email && styles.errorInput]}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        editable={!loading}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}

      {/*password*/}
      <TextInput
        placeholder="Password"
        style={[styles.input, errors.password && styles.errorInput]}
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        editable={!loading}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* button*/}
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Sign Up"}
        </Text>
      </Pressable>

     {/* login link*/}
      <Pressable onPress={() => navigation.navigate("Login")} disabled={loading}>
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f6f7fb",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    color: "#1f172b",
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 8,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  errorInput: {
    borderColor: "#ff4f87",
    backgroundColor: "#fff5fa",
  },

  errorText: {
    color: "#ff4f87",
    fontSize: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#ff4f87",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  link: {
    color: "#ff4f87",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
});