import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Apartment = Tables<"apartments">;
export type Institution = Tables<"institutions">;
export type UserFavorite = Tables<"user_favorites">;

export type ApartmentInsert = TablesInsert<"apartments">;
export type ApartmentUpdate = TablesUpdate<"apartments">;

// Apartments API
export const apartmentsApi = {
  // Get all apartments
  async getAll() {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get apartment by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new apartment
  async create(apartment: ApartmentInsert) {
    const { data, error } = await supabase
      .from("apartments")
      .insert(apartment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update apartment
  async update(id: string, updates: ApartmentUpdate) {
    const { data, error } = await supabase
      .from("apartments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete apartment
  async delete(id: string) {
    const { error } = await supabase
      .from("apartments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Search apartments
  async search(query: string) {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get apartments by location (within radius)
  async getByLocation(lat: number, lng: number, radiusKm: number = 5) {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .filter("lat", "gte", lat - radiusKm / 111)
      .filter("lat", "lte", lat + radiusKm / 111)
      .filter("lng", "gte", lng - radiusKm / (111 * Math.cos(lat * Math.PI / 180)))
      .filter("lng", "lte", lng + radiusKm / (111 * Math.cos(lat * Math.PI / 180)))
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Institutions API
export const institutionsApi = {
  // Get all institutions
  async getAll() {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("name");
    
    if (error) throw error;
    return data;
  },

  // Get institution by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// User Favorites API
export const favoritesApi = {
  // Get user's favorites
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from("user_favorites")
      .select(`
        *,
        apartments (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add to favorites
  async addToFavorites(userId: string, apartmentId: string) {
    const { data, error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: userId,
        apartment_id: apartmentId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, apartmentId: string) {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("apartment_id", apartmentId);
    
    if (error) throw error;
  },

  // Check if apartment is favorited
  async isFavorited(userId: string, apartmentId: string) {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("apartment_id", apartmentId)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  }
};

// Auth API
export const authApi = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign up
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
}; 