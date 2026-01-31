import { Meal } from "../types/Meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// 1. Fungsi untuk ambil daftar makanan default (untuk awal buka app)
export const fetchMeals = async (): Promise<Meal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=`);
    if (!response.ok) throw new Error("Gagal mengambil data");
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Fetch meals error:", error);
    return [];
  }
};

// 2. Fungsi untuk ambil detail resep berdasarkan ID
export const fetchMealById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) throw new Error("Gagal mengambil detail resep");
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Fetch meal detail error:", error);
    return null;
  }
};

// 3. Fungsi untuk cari makanan berdasarkan nama (untuk fitur Search Bar)
export const searchMeals = async (query: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

// 4. Fungsi untuk ambil daftar kategori (Beef, Chicken, Seafood, dll)
export const fetchCategories = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Fetch categories error:", error);
    return [];
  }
};

// 5. Fungsi untuk ambil makanan berdasarkan kategori tertentu
export const fetchMealsByCategory = async (
  category: string,
): Promise<Meal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Fetch by category error:", error);
    return [];
  }
};
