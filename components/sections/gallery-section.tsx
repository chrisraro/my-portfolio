"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";
import { GalleryImage } from "@/types";

export default function GallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  // Navigate between images in lightbox
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % galleryImages.length
      : (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
  }, [selectedImage]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateLightbox]);

  // Duplicate images for seamless infinite scroll
  const loopedImages = [...galleryImages, ...galleryImages, ...galleryImages];

  // Center the scroll position on mount so we can scroll both directions
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  // Infinite scroll boundary reset
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const singleSetWidth = el.scrollWidth / 3;

    if (el.scrollLeft <= 0) {
      el.scrollLeft = singleSetWidth;
    } else if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft = singleSetWidth;
    }
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="gallery" className="py-8 md:py-12">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Gallery</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className=""
      >
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Scrollable Gallery */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto"
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {loopedImages.map((image: GalleryImage, index: number) => (
              <div
                key={`${image.id}-${index}`}
                className="relative flex-shrink-0 w-56 h-40 md:w-72 md:h-48 rounded-lg overflow-hidden bg-muted cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 224px, 288px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  <p className="text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image container — nearly full screen */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh] max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Caption */}
            <div className="absolute bottom-4 left-0 right-0 text-center px-16">
              <p className="text-white/90 text-sm md:text-base bg-black/50 inline-block px-4 py-2 rounded-lg max-w-2xl mx-auto">
                {selectedImage.alt}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {galleryImages.findIndex((img) => img.id === selectedImage.id) + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
