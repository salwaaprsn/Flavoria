import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    StatusBar as RNStatusBar,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchMealById } from "../api/mealApi";
import { Meal } from "../types/Meal"; 

const { width } = Dimensions.get("window");

// 1. UPDATE INTERFACE PROPS 
interface DetailScreenProps {
  mealId: string;
  onBack: () => void;
  onToggleFavorite: (meal: Meal) => void; // Tambahkan ini
  isFavorite: boolean; // Tambahkan ini
}

const DetailScreen: React.FC<DetailScreenProps> = ({ 
  mealId, 
  onBack, 
  onToggleFavorite, 
  isFavorite 
}) => {
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      const data = await fetchMealById(mealId);
      setMeal(data);
      setLoading(false);
    };
    loadDetail();
  }, [mealId]);

  const getIngredients = () => {
    let ingredients = [];
    if (!meal) return [];
    for (let i = 1; i <= 20; i++) {
      if (
        meal[`strIngredient${i}`] &&
        meal[`strIngredient${i}`].trim() !== ""
      ) {
        ingredients.push({
          name: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`],
        });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Menyiapkan Resep...</Text>
      </View>
    );
  }

  const instructionSteps = meal.strInstructions
    ? meal.strInstructions
        .split(/\r?\n/)
        .filter((s: string) => s.trim().length > 0)
        .flatMap((s: string) => (s.includes(". ") ? s.split(". ") : s))
        .map((step: string) =>
          step
            .replace(/^\d+[\.\s\-]+/, "")
            .replace(/^Step \d+[:\s\-]+/, "")
            .trim(),
        )
        .filter((step: string) => step.length > 8)
    : [];

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <View style={styles.overlay} />
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={28} color="#2D3436" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.indicator} />
          <Text style={styles.categoryBadge}>
            {meal.strCategory} • {meal.strArea}
          </Text>
          <Text style={styles.title}>{meal.strMeal}</Text>

          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#FF6B6B" />
              <Text style={styles.infoValue}>45 Mins</Text>
              <Text style={styles.infoLabel}>Cook</Text>
            </View>
            <View style={[styles.infoItem, styles.infoBorder]}>
              <Ionicons name="flame-outline" size={20} color="#FF6B6B" />
              <Text style={styles.infoValue}>Medium</Text>
              <Text style={styles.infoLabel}>Level</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color="#FF6B6B" />
              <Text style={styles.infoValue}>2 Pers</Text>
              <Text style={styles.infoLabel}>Servings</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bahan-bahan</Text>
              <Text style={styles.itemCount}>
                {getIngredients().length} items
              </Text>
            </View>
            {getIngredients().map((item, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientInfo}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                  <Text style={styles.ingredientName}>{item.name}</Text>
                </View>
                <Text style={styles.measureText}>{item.measure}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Langkah Memasak</Text>
            {instructionSteps.map((step: string, index: number) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>
                    {step.endsWith(".") ? step : `${step}.`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 2. TOMBOL LOVE DENGAN LOGIKA FAVORIT */}
      <TouchableOpacity 
        style={[styles.fab, isFavorite && styles.fabActive]} 
        activeOpacity={0.8}
        onPress={() => onToggleFavorite(meal)}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={26} 
          color="#FFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" },
  loadingText: { marginTop: 10, color: "#FF6B6B", fontWeight: "600" },
  imageContainer: { width: "100%", height: 380 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.1)" },
  backButton: { position: "absolute", top: Platform.OS === "android" ? (RNStatusBar.currentHeight || 0) + 20 : 60, left: 20, backgroundColor: "rgba(255,255,255,0.9)", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", elevation: 5 },
  contentCard: { backgroundColor: "#F8F9FA", marginTop: -40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, paddingTop: 15 },
  indicator: { width: 40, height: 5, backgroundColor: "#E0E0E0", borderRadius: 10, alignSelf: "center", marginBottom: 20 },
  categoryBadge: { color: "#FF6B6B", fontWeight: "800", textTransform: "uppercase", fontSize: 13, letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "900", color: "#2D3436", marginBottom: 25, lineHeight: 34 },
  infoBar: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 20, paddingVertical: 15, marginBottom: 30, elevation: 2 },
  infoItem: { flex: 1, alignItems: "center" },
  infoBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#F1F1F1" },
  infoValue: { fontSize: 14, fontWeight: "800", color: "#2D3436", marginTop: 4 },
  infoLabel: { fontSize: 12, color: "#A0A0A0", fontWeight: "600" },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#2D3436", marginBottom: 20 },
  itemCount: { fontSize: 14, color: "#FF6B6B", fontWeight: "700" },
  ingredientCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF", padding: 14, borderRadius: 15, marginBottom: 10 },
  ingredientInfo: { flexDirection: "row", alignItems: "center" },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#FF6B6B", justifyContent: "center", alignItems: "center", marginRight: 12 },
  ingredientName: { fontSize: 15, fontWeight: "600", color: "#495057", textTransform: "capitalize" },
  measureText: { fontSize: 14, color: "#888", fontWeight: "700" },
  stepRow: { flexDirection: "row", marginBottom: 30, alignItems: "flex-start" },
  stepNumberContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFE3E3", justifyContent: "center", alignItems: "center", marginRight: 18, marginTop: 2 },
  stepNumber: { color: "#FF6B6B", fontWeight: "800", fontSize: 16 },
  stepContent: { flex: 1 },
  stepText: { fontSize: 16, lineHeight: 28, color: "#495057" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#ccc",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabActive: {
    backgroundColor: "#FF6B6B",
  },
});