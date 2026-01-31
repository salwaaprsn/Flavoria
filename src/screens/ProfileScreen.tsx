import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MealItem from "../components/MealItem";
import { Meal } from "../types/Meal";

const { width } = Dimensions.get("window");

interface ProfileScreenProps {
  user: { name: string; image: any };
  onUpdateUser: (user: any) => void;
  favorites: Meal[];
  onBack: () => void;
  onSelectMeal: (id: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  favorites,
  onBack,
  onSelectMeal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const saveProfile = () => {
    onUpdateUser({ ...user, name: newName });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* 1. CUSTOM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Saya</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.profileContainer}>
            {/* Foto Profil Besar */}
            <View style={styles.imageWrapper}>
              <Image source={user.image} style={styles.profileBigImage} />
              <TouchableOpacity style={styles.editPhotoBadge}>
                <Ionicons name="camera" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Nama & Fitur Edit */}
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                  placeholder="Masukkan Nama"
                />
                <TouchableOpacity onPress={saveProfile}>
                  <Ionicons name="checkmark-circle" size={36} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.userEmail}>
              {user.name.toLowerCase().replace(/\s/g, '')}@flavoria.com
            </Text>

            {/* Statistik Singkat */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favorit</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Review</Text>
              </View>
            </View>

            {/* Judul Daftar Favorit */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resep Favorit Kamu 💖</Text>
            </View>

            {/* PERBAIKAN LOGIKA: Menggunakan Ternary ? : null agar tidak error angka 0 */}
            {favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="heart-dislike-outline"
                  size={60}
                  color="#D1D1D1"
                />
                <Text style={styles.emptyText}>
                  Belum ada resep favorit nih.
                </Text>
                <TouchableOpacity style={styles.findBtn} onPress={onBack}>
                  <Text style={styles.findBtnText}>Cari Resep Sekarang</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <MealItem meal={item} onSelect={() => onSelectMeal(item.idMeal)} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (RNStatusBar.currentHeight || 0) + 20 : 50,
    paddingBottom: 15,
    backgroundColor: "#FFF",
  },
  iconBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436" },
  profileContainer: { alignItems: "center", marginTop: 30, paddingHorizontal: 20 },
  imageWrapper: { marginBottom: 15 },
  profileBigImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: "#FFF" },
  editPhotoBadge: { position: "absolute", bottom: 5, right: 5, backgroundColor: "#FF6B6B", width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#FFF" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  userName: { fontSize: 26, fontWeight: "900", color: "#2D3436" },
  userEmail: { fontSize: 14, color: "#A0A0A0", marginTop: 2 },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%", justifyContent: "center" },
  nameInput: { fontSize: 22, fontWeight: "800", color: "#2D3436", borderBottomWidth: 2, borderBottomColor: "#FF6B6B", minWidth: 150, textAlign: "center", paddingVertical: 5 },
  statsCard: { flexDirection: "row", backgroundColor: "#FFF", marginTop: 30, paddingVertical: 20, paddingHorizontal: 50, borderRadius: 25, elevation: 4, width: "100%", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "900", color: "#FF6B6B" },
  statLabel: { fontSize: 13, color: "#A0A0A0", fontWeight: "600" },
  divider: { width: 1, height: "80%", backgroundColor: "#F1F1F1", alignSelf: "center" },
  sectionHeader: { width: "100%", marginTop: 40, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#2D3436" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#A0A0A0", marginTop: 10, fontSize: 16 },
  findBtn: { marginTop: 20, backgroundColor: "#FF6B6B", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  findBtnText: { color: "#FFF", fontWeight: "800" },
  row: { justifyContent: "space-between" },
  listContent: { paddingHorizontal: 20, paddingBottom: 50 },
});