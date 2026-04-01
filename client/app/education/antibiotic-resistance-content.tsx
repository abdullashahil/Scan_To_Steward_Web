"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/bug1.svg",
    caption: (
      <>
        Using antibiotics without a proper indication
        <br />
        <span className="font-medium text-foreground">Overuse of antibiotics</span>
      </>
    ),
  },
  {
    image: "/bug2.svg",
    caption: (
      <>
        Antibiotics eliminate the bacteria responsible for the infection.
        <br />
        <span className="font-medium text-foreground">Oh no! Some of them are resistant!</span>
      </>
    ),
  },
  {
    image: "/bug3.svg",
    caption: (
      <>
        The resistant bacteria multiplied and spread
        <br />
        <span className="font-medium text-foreground">Existing treatments become ineffective!</span>
      </>
    ),
  },
]

function ImageCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative flex flex-col items-center">
      {/* Image Container */}
      <div className="relative flex items-center justify-center w-full max-w-md">
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-0 z-10 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>

        {/* Image */}
        <img
          src={slides[current].image}
          alt={`Antibiotic resistance step ${current + 1}`}
          className="w-64 h-64 object-contain transition-opacity duration-300"
        />

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-0 z-10 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Caption */}
      <p className="mt-4 text-center text-sm">
        {slides[current].caption}
      </p>

      {/* Dots indicator */}
      <div className="flex gap-2 mt-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === current ? "bg-primary" : "bg-primary/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function AntibioticResistanceContent() {
  return (
    <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
      {/* TITLE */}
      <h3 className="text-xl font-semibold text-foreground text-center">
        How does antibiotic resistance occur?
      </h3>

      {/* IMAGE CAROUSEL */}
      <ImageCarousel />

      {/* DESCRIPTION */}
      <p>
        Antibiotic resistance is occurring everywhere in the world, making infections harder to treat 
        and weakening modern medicine. While resistance happens naturally, misuse of antibiotics in 
        humans and animals is speeding up the process.
      </p>

      <p>
        To address this, global initiatives like the <span className="font-medium text-foreground">
          "Handle with care"
        </span> campaign aim to raise awareness and promote responsible antibiotic use.
      </p>

      {/* CAMPAIGN BADGE */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-white font-bold tracking-wide uppercase text-sm">Handle with Care</span>
        </div>
      </div>

      {/* VIDEO + IMAGE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT VIDEO */}
        <div className="space-y-2">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/paiIiSzppHY"
              title="Learn antibiotics video"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-xs">
            Learn how to handle antibiotics with care and help stop the spread of antibiotic resistance.
          </p>
        </div>

        {/* YOUTUBE VIDEO */}
        <div className="space-y-2">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/-ZX97bIbZBQ"
              title="WHO Antibiotics - Handle with care"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-xs">
            Antibiotics are often used to treat infections, but they aren't always the answer. 
            Everyone has a role in reducing antibiotic resistance.
          </p>
        </div>
      </div>
    </div>
  )
}
