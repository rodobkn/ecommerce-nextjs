import { create } from "zustand";
import { Product } from "@/schema/product";

interface SearchState {
  searchQuery: string;
  category: string;
  products: Product[];
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setProducts: (products: Product[]) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  category: "all",
  products: [],
  isLoading: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setProducts: (products) => set({ products }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () =>
    set({
      searchQuery: "",
      category: "all",
      products: [],
      isLoading: false,
    }),
}));
