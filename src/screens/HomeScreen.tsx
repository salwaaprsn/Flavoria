import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchCategories,
  fetchMeals,
  fetchMealsByCategory,
  searchMeals,
} from "../api/mealApi";
import MealItem from "../components/MealItem";
import { Meal } from "../types/Meal";

const { width } = Dimensions.get("window");

// 1. UPDATE INTERFACE PROPS
interface HomeScreenProps {
  onSelectMeal: (id: string) => void;
  onGoToProfile: () => void;
  user: { name: string; image: any };
}

// 2. TERIMA PROPS BARU
const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMeal,
  onGoToProfile,
  user,
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [mealData, catData] = await Promise.all([
        fetchMeals(),
        fetchCategories(),
      ]);
      setMeals(mealData);
      setCategories(catData);
    } catch (error) {
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      setSelectedCategory("");
      const results = await searchMeals(text);
      setMeals(results);
    } else {
      loadInitialData();
    }
  };

  const handleCategoryPress = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery("");
    setLoading(true);
    let results =
      categoryName === "All"
        ? await fetchMeals()
        : await fetchMealsByCategory(categoryName);
    setMeals(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {loading && meals.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Menyiapkan hidangan terbaik...</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            <View>
              {/* 1. GREETING & PROFILE (DIUBAH) */}
              <View style={styles.headerSection}>
                <View>
                  {/* Nama sekarang mengambil dari props user.name */}
                  <Text style={styles.greetingText}>Hi, {user.name}! 👋</Text>
                  <Text style={styles.headerTitle}>
                    Mau masak apa hari ini?
                  </Text>
                </View>

                {/* Image dibungkus TouchableOpacity agar bisa diklik */}
                <TouchableOpacity onPress={onGoToProfile} activeOpacity={0.7}>
                  <Image
                    source={user.image} 
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              </View>

              {/* 2. SEARCH BOX */}
              <View style={styles.searchWrapper}>
                <View style={styles.searchBox}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    placeholder="Cari resep favoritmu..."
                    placeholderTextColor="#A0A0A0"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* 3. BANNER PROMO */}
              {!searchQuery && (
                <View style={styles.bannerCard}>
                  <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerTag}>Resep Minggu Ini</Text>
                    <Text style={styles.bannerTitle}>Beef Wellington</Text>
                    <TouchableOpacity
                      style={styles.bannerBtn}
                      onPress={() => onSelectMeal("52803")}
                    >
                      <Text style={styles.bannerBtnText}>Lihat Resep</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{
                      uri: "https://www.themealdb.com/images/category/beef.png",
                    }}
                    style={styles.bannerImage}
                  />
                </View>
              )}

              {/* 4. CATEGORIES */}
              <Text style={styles.sectionTitle}>Kategori Populer</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    selectedCategory === "All" && styles.categoryActive,
                  ]}
                  onPress={() => handleCategoryPress("All")}
                >
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === "All" && styles.textWhite,
                    ]}
                  >
                    🏠 All
                  </Text>
                </TouchableOpacity>

                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.idCategory}
                    style={[
                      styles.categoryCard,
                      selectedCategory === cat.strCategory &&
                        styles.categoryActive,
                    ]}
                    onPress={() => handleCategoryPress(cat.strCategory)}
                  >
                    <Image
                      source={{ uri: cat.strCategoryThumb }}
                      style={styles.catImg}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        selectedCategory === cat.strCategory &&
                          styles.textWhite,
                      ]}
                    >
                      {cat.strCategory}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
            </View>
          }
          renderItem={({ item }) => (
            <MealItem meal={item} onSelect={() => onSelectMeal(item.idMeal)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Resep tidak ditemukan 🥣</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;

// Styles tetap sama
const styles = StyleSheet.create({
  // ... (Gunakan styles kamu yang sudah ada)
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight || 0) + 20 : 20,
  },
  greetingText: { fontSize: 20, color: "#FF6B6B", fontWeight: "700" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    lineHeight: 28,
    marginTop: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  searchWrapper: { paddingHorizontal: 20, marginTop: 15 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 55,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#2D3436", fontWeight: "500" },
  bannerCard: {
    margin: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bannerTextContainer: { flex: 1 },
  bannerTag: {
    color: "#FFE3E3",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bannerTitle: { color: "#FFF", fontSize: 22, fontWeight: "800", marginTop: 5 },
  bannerBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 15,
  },
  bannerBtnText: { color: "#FF6B6B", fontWeight: "800", fontSize: 12 },
  bannerImage: { width: 110, height: 90, resizeMode: "contain" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  categoryList: { paddingLeft: 20, paddingBottom: 20 },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  catImg: { width: 30, height: 30, marginRight: 8 },
  categoryActive: { backgroundColor: "#FF6B6B" },
  categoryLabel: { fontWeight: "700", color: "#555", fontSize: 14 },
  textWhite: { color: "#FFF" },
  row: { justifyContent: "space-between", paddingHorizontal: 20 },
  listContent: { paddingBottom: 30 },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  loadingText: { marginTop: 15, color: "#FF6B6B", fontWeight: "600" },
  emptyText: { fontSize: 16, color: "#999", marginTop: 20 },
});


{currentPage === "home" ? (
  <HomeScreen user={user} onSelectMeal={handleSelect} />
) : null}

{favorites.length === 0 ? (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Belum ada resep favorit.</Text>
  </View>
) : null}