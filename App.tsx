import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import DetailScreen from "./src/screens/DetailScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { Meal } from "./src/types/Meal";

type Page = "home" | "detail" | "profile";

export default function App() {
  // --- 1. STATE NAVIGASI ---
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  // --- 2. STATE DATA USER ---
  const [user, setUser] = useState({
    name: "Salwa",
    image: require("./assets/images/salwa.jpeg"),
  });

  // --- 3. STATE FAVORIT ---
  const [favorites, setFavorites] = useState<Meal[]>([]);

  // --- 4. FUNGSI FAVORIT ---
  const toggleFavorite = (meal: Meal) => {
    const isExist = favorites.find((f) => f.idMeal === meal.idMeal);
    if (isExist) {
      // Jika sudah ada, hapus dari daftar favorit
      setFavorites(favorites.filter((f) => f.idMeal !== meal.idMeal));
    } else {
      // Jika belum ada, tambahkan ke daftar favorit
      setFavorites([...favorites, meal]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 1. HALAMAN HOME */}
      {currentPage === "home" ? (
        <SafeAreaView style={styles.safeArea}>
          <HomeScreen
            user={user}
            onSelectMeal={(id) => {
              setSelectedMealId(id);
              setCurrentPage("detail");
            }}
            onGoToProfile={() => setCurrentPage("profile")}
          />
        </SafeAreaView>
      ) : null}

      {/* 2. HALAMAN DETAIL */}
      {currentPage === "detail" && selectedMealId !== null ? (
        <DetailScreen
          mealId={selectedMealId}
          onBack={() => {
            setSelectedMealId(null);
            setCurrentPage("home");
          }}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.some((f) => f.idMeal === selectedMealId)}
        />
      ) : null}

      {/* 3. HALAMAN PROFIL */}
      {currentPage === "profile" ? (
        <SafeAreaView style={styles.safeArea}>
          <ProfileScreen
            user={user}
            onUpdateUser={setUser}
            favorites={favorites}
            onBack={() => setCurrentPage("home")}
            onSelectMeal={(id) => {
              setSelectedMealId(id);
              setCurrentPage("detail");
            }}
          />
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
});


