import React, { useEffect, useRef } from "react";
import { Animated, StatusBar, StyleSheet, Text, View } from "react-native";
interface WelcomeScreenProps {
  onFinish: () => void;
}

// Deklarasi Komponen
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  // Deklarasi animasi
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Menjalankan animasi saat layar muncul
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer untuk pindah ke Beranda
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center", // Memastikan konten di tengah
        }}
      >
        <Text style={styles.logoIcon}>🍳</Text>
        <Text style={styles.brandName}>Flavoria</Text>
        <View style={styles.line} />
        <Text style={styles.tagline}>Dapur Digitalmu</Text>
      </Animated.View>
    </View>
  );
};

// EXPORT DEFAULT HARUS DI BAWAH
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -2,
  },
  line: {
    height: 4,
    width: 60,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    opacity: 0.9,
  },
});
