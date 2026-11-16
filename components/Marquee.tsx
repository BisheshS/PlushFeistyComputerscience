import type { CSSProperties, ReactNode } from 'react'

type Props = {
  items: ReactNode[]
  /** Plain-text version for screen readers. */
  label: string
  className?: string
  /** Seconds for one loop. */
  speed?: number
  reverse?: boolean
  separator?: ReactNode
}

// Endless ticker. Two identical groups slide left by 50% and loop seamlessly.
const Marquee = ({ items, label, className = '', speed = 28, reverse = false, separator = '✦' }: Props) => {
  const group = (key: string) => (
    <span className="marquee-group" key={key}>
      {items.map((item, i) => (
        <span className="marquee-item" key={i}>
          {item}
          <span className="marquee-sep">{separator}</span>
        </span>
      ))}
    </span>
  )
  return (
    <div
      className={`marquee ${className}`}
      data-reverse={reverse}
      style={{ '--speed': `${speed}s` } as CSSProperties}
    >
      <span className="sr-only">{label}</span>
      <div className="marquee-track" aria-hidden="true">
        {group('a')}
        {group('b')}
      </div>
    </div>
  )
}

export default Marquee
