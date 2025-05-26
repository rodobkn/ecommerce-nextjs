"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    imageUrl: "/library_background.jpg",
    title: "Explora Nuevos Libros",
    subtitle: "La lectura te espera"
  },
  {
    imageUrl: "/tech_background.jpg",
    title: "Tecnología de Vanguardia",
    subtitle: "Innovación al alcance de tu mano"
  },
  {
    imageUrl: "/peluches_background.jpg",
    title: "Peluches Adorables",
    subtitle: "Suavidad que llena la alegría"
  },
]

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount)
    }, 5000);

    return () => clearInterval(interval);
  }, [slideCount])

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount)
  }

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1))
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-700 flex items-center justify-center text-white"
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            backgroundImage: `url(${slide.imageUrl})`
          }}
        >
          <div className="z-10 text-center bg-black bg-opacity-40 p-2 md:p-4 rounded-md">
            <h2 className="text-xl md:text-3xl font-bold md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-xl">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Flecha Izquierda */}
      <button
        onClick={goToPrev}
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          bg-black bg-opacity-40 text-white p-2 rounded-full
          hover:bg-opacity-60
        "
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Flecha Derecha */}
      <button
        onClick={goToNext}
        className="
          absolute right-4 top-1/2 -translate-y-1/2
          bg-black bg-opacity-40 text-white p-2 rounded-full
          hover:bg-opacity-60
        "
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  )
}
