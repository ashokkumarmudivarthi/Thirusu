// Alternative transition styles - Copy any of these to replace PageTransition.jsx

/* ===== OPTION 1: WAVE RIPPLE TRANSITION ===== */
export function WaveRippleTransition({ isActive, color = '#FF6B35', onComplete }) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 900)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Multiple wave rings expanding from center */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: [0, 3, 5], opacity: [0.6, 0.3, 0] }}
              transition={{
                duration: 0.9,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="w-96 h-96 rounded-full border-8"
                style={{ borderColor: `${color}50` }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ===== OPTION 2: LIQUID SPLASH TRANSITION ===== */
export function LiquidSplashTransition({ isActive, color = '#FF6B35', onComplete }) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Liquid splash from bottom */}
          <motion.div
            className="absolute inset-x-0 bottom-0"
            initial={{ y: '100%' }}
            animate={{ y: [100, -20, 0, -100] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
          >
            <svg viewBox="0 0 1440 320" className="w-full h-96">
              <motion.path
                fill={color}
                fillOpacity="0.3"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                animate={{
                  d: [
                    'M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                    'M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                  ],
                }}
                transition={{ duration: 0.8 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ===== OPTION 3: FRUIT SLICE WIPE ===== */
export function FruitSliceTransition({ isActive, color = '#FF6B35', onComplete }) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Diagonal wipe with orange slice pattern */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}40 50%, ${color}20 100%)`,
            }}
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Rotating fruit slice segments */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                    transformOrigin: 'center',
                    rotate: `${i * 45}deg`,
                  }}
                  animate={{ rotate: `${i * 45 + 180}deg` }}
                  transition={{ duration: 0.7 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ===== OPTION 4: MINIMAL FADE SLIDE ===== */
export function MinimalFadeTransition({ isActive, color = '#FF6B35', onComplete }) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Simple vertical bars sweeping */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-y-0 w-1/5"
              style={{
                left: `${i * 20}%`,
                backgroundColor: `${color}15`,
              }}
              initial={{ y: '100%' }}
              animate={{ y: '-100%' }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ===== OPTION 5: CONFETTI BURST ===== */
export function ConfettiBurstTransition({ isActive, color = '#FF6B35', onComplete }) {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    if (isActive) {
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }))
      setConfetti(pieces)

      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                backgroundColor: color,
              }}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{
                scale: piece.scale,
                rotate: piece.rotation * 4,
                x: (Math.random() - 0.5) * 400,
                y: Math.random() * 500 + 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Usage: Import any alternative and swap in Home.jsx:
// import { WaveRippleTransition as PageTransition } from '../components/TransitionAlternatives'
