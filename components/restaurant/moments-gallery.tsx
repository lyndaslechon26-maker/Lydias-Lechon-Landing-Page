'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

const moments = [
  { id: 1, image: "/C1.jpg", alt: "Delicious pasta" },
  { id: 2, image: "/C2.jpg", alt: "Fine dining" },
  { id: 3, image: "/C3.jpg", alt: "Grilled steak" },
  { id: 4, image: "/C4.jpg", alt: "Restaurant ambiance" },
  { id: 5, image: "/C5.jpg", alt: "Happy customers" },
  { id: 6, image: "/C6.jpg", alt: "Fresh ingredients" },
  { id: 7, image: "/C7.jpg", alt: "Signature dishes" },
  { id: 8, image: "/C8.jpg", alt: "Cozy atmosphere" },
  { id: 9, image: "/C9.jpg", alt: "Chef's special" },
  { id: 10, image: "/C10.jpg", alt: "Dessert selection" }
]

export function MomentsGallery() {
  const [centerImage, setCenterImage] = useState(moments[0].image)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  
  // Duplicate array for seamless infinite loop
  const duplicatedMoments = [...moments, ...moments, ...moments]

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let scrollSpeed = 0.5 // pixels per frame
    let isHovering = false

    const animate = () => {
      if (!isHovering && container) {
        container.scrollLeft += scrollSpeed
        
        // Reset scroll when reaching halfway (seamless loop)
        const maxScroll = container.scrollWidth / 3
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => { isHovering = true }
    const handleMouseLeave = () => { isHovering = false }
    
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Detect center image
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      
      const container = scrollRef.current
      const containerWidth = container.offsetWidth
      
      // Find which image is closest to center
      const images = container.querySelectorAll('[data-moment-id]')
      let closestImage = images[0]
      let closestDistance = Infinity
      
      images.forEach((img) => {
        const rect = (img as HTMLElement).getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const imgCenter = rect.left - containerRect.left + rect.width / 2
        const distance = Math.abs(imgCenter - containerWidth / 2)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestImage = img
        }
      })
      
      const momentId = (closestImage as HTMLElement).getAttribute('data-moment-id')
      if (momentId) {
        const momentIndex = parseInt(momentId) - 1
        if (momentIndex >= 0 && momentIndex < moments.length) {
          const newImage = moments[momentIndex].image
          if (newImage !== centerImage) {
            setCenterImage(newImage)
          }
        }
      }
    }
    
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [centerImage])

  return (
    <ScrollReveal>
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 transition-all duration-700 ease-in-out">
          <img 
            src={centerImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/70" />
          {/* Blur effect */}
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-[1600px]">
          {/* Header - Compact */}
          <div className="mb-10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Our Gallery
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
              Moments of <span className="text-amber-400 italic font-serif">Good Food</span>
            </h2>
            <p className="text-slate-300 text-sm">
              A glimpse of the delicious moments at Lydia's Lechon
            </p>
          </div>

          {/* Scrolling Gallery Container */}
          <div className="relative">
            {/* Gradient Fade - Left */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Gradient Fade - Right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div 
              ref={scrollRef}
              className="overflow-x-auto overflow-y-hidden py-4 scrollbar-hide"
            >
              <div className="flex gap-6 w-max">
                {duplicatedMoments.map((moment, index) => {
                  // Alternate between large and normal: even = large, odd = normal
                  const isLarge = index % 2 === 0
                  
                  return (
                    <div
                      key={`${moment.id}-${index}`}
                      data-moment-id={moment.id}
                      className={`flex-shrink-0 transition-all duration-500 ${
                        isLarge 
                          ? 'w-[280px] sm:w-[340px] scale-110' 
                          : 'w-[240px] sm:w-[280px]'
                      }`}
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 pb-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
                        <div className="relative aspect-square overflow-hidden group cursor-pointer rounded-lg">
                          {/* Actual Image */}
                          <img 
                            src={moment.image} 
                            alt={moment.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          
                          {/* Hover Overlay with Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                          
                          {/* Zoom Effect */}
                          <div className="absolute inset-0 transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        
                        {/* Photo Caption/Label at bottom */}
                        <div className="mt-3 text-center">
                          <p className="text-slate-700 dark:text-slate-300 text-xs font-handwriting italic">{moment.alt}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hide scrollbar CSS */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    </ScrollReveal>
  )
}
