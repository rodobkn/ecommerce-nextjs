"use client";

import React from "react";
import { useSearchStore } from "@/stores/search-store";
import { useRouter, usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { ProductCategory } from "@/schema/product";
import { searchProducts } from "@/actions/search/search-products";

interface SearchBarProps {
  smallScreen?: boolean;
}

export const SearchBar = ({
  smallScreen
}: SearchBarProps) => {
  const {
    searchQuery,
    category,
    isLoading,
    setSearchQuery,
    setCategory,
    setProducts,
    setIsLoading
  } = useSearchStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = async () => {
    setIsLoading(true);

    const results = await searchProducts(searchQuery.trim(), category);
    setProducts(results);

    setIsLoading(false);

    if (pathname !== "/search") {
      router.push("/search");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // pantallas chicas
  if (smallScreen) {
    return (
      <div className="flex items-center w-full">
        <input
          type="text"
          className={`h-10 px-2 py-1 border border-gray-500 border-r-0 rounded-l bg-white text-black focus:outline-none w-full ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className={`h-10 px-3 py-1 bg-[#febd69] hover:bg-[#f8a055] text-black border border-gray-500 border-l-0 flex items-center space-x-1 rounded-r-md ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleSearch}
          disabled={isLoading}
        >
          <FaSearch />
        </button>
      </div>
    )
  }

  // pantallas medianas o mas grandes
  return (
    <div className="flex items-center">
      <select
        className="h-10 pl-2 py-1 border border-gray-500 border-r-0 bg-gray-200 text-black rounded-l-md focus:outline-none"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isLoading}
      >
        <option value="all">Todos</option>
        <option value={ProductCategory.LITERATURE}>Libros</option>
        <option value={ProductCategory.PLUSHIES}>Peluches</option>
        <option value={ProductCategory.TECHNOLOGY}>Tecnología</option>
      </select>

      {/* Separador */}
      <div className={`h-10 w-2 border border-gray-500 border-l-0 border-r-0 bg-gray-200 focus:outline-none ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}/>

      <input
        type="text"
        className={`h-10 px-2 py-1 border border-gray-500 border-l-0 border-r-0 bg-white text-black focus:outline-none w-60 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        placeholder="Buscar producto..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      <button
        className={`h-10 px-3 py-1 bg-[#febd69] hover:bg-[#f8a055] text-black border border-gray-500 border-l-0 flex items-center space-x-1 rounded-r-md ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleSearch}
        disabled={isLoading}
      >
        <FaSearch />
        <span>Buscar</span>
      </button>
    </div>
  )
}
