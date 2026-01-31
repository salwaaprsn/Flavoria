import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Meal } from '../types/Meal';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 25; // Hitung lebar kartu agar pas 2 kolom

interface MealItemProps {
  meal: Meal;
  onSelect: (meal: Meal) => void;
}

const MealItem: React.FC<MealItemProps> = ({ meal, onSelect }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onSelect(meal)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        {/* Judul dibatasi 1 baris agar tinggi kartu seragam */}
        <Text style={styles.title} numberOfLines={1}>
          {meal.strMeal}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {meal.strArea || "Food"}
            </Text>
          </View>
          
          <Text style={styles.actionText}>Lihat Resep →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 120, // Tinggi gambar seragam
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 5,
  },
  footer: {
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 10,
    marginRight: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#636E72',
    flex: 1, // Agar teks tidak nabrak
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
  },
});

export default MealItem;