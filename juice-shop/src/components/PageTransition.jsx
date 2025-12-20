import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function PageTransition({ isActive, color = '#FF6B35', onComplete }) {
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    if (isActive) {
      // Generate random bubbles
      const newBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.0,
        size: 20 + Math.random() * 60,
        duration: 3.0 + Math.random() * 2.0,
      }))
      setBubbles(newBubbles)

      // Auto-complete after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 3500)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Overlay with gradient fade */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}08, ${color}15, ${color}08)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Floating Bubbles */}
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full"
              style={{
                left: `${bubble.left}%`,
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}20)`,
                boxShadow: `inset -2px -2px 8px ${color}30, 0 4px 12px ${color}20`,
                border: `1px solid ${color}30`,
              }}
              initial={{ 
                y: '110vh',
                x: 0,
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                y: '-20vh',
                x: [0, 30, -20, 0],
                scale: [0, 1, 1, 0.8],
                opacity: [0, 0.8, 0.6, 0]
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                ease: [0.34, 1.56, 0.64, 1],
                x: {
                  duration: bubble.duration,
                  repeat: 0,
                  ease: "easeInOut"
                }
              }}
            />
          ))}

          {/* Juice Droplets */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`drop-${i}`}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: '-10%',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: '120vh', opacity: [0, 0.6, 0.4, 0] }}
              transition={{
                duration: 3.0,
                delay: i * 0.2,
                ease: "easeIn"
              }}
            >
              <div
                className="relative"
                style={{
                  width: 8 + Math.random() * 12,
                  height: 12 + Math.random() * 20,
                  background: `linear-gradient(180deg, ${color}60, ${color}30)`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  filter: 'blur(0.5px)',
                }}
              />
            </motion.div>
          ))}

          {/* Center Splash Effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          >
            <div
              className="w-96 h-96 rounded-full"
              style={{
                background: `radial-gradient(circle, ${color}30, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
          </motion.div>

          {/* Particle Shimmer */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: color,
                  boxShadow: `0 0 8px ${color}`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: Math.random() * 1.0,
                  repeat: 0,
                }}
              />
            ))}
          </motion.div>

          {/* Accessibility: Reduced Motion Alternative */}
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .fixed.z-\\[100\\] * {
                animation: none !important;
                transition: opacity 0.3s ease !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
