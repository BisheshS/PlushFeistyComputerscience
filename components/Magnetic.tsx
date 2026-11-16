import { useRef, type ReactNode } from 'react'
import { useMagnetic } from '../lib/motion'

// Wraps a link or button so it leans toward the mouse.
const Magnetic = ({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  useMagnetic(ref, strength)
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}

export default Magnetic
