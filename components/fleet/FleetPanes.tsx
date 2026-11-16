import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../../lib/motion'
import styles from '../../styles/Home.module.css'

// A live take on the Fleet window from fleetapp.in (illustration, sample data).
// Panes move WORKING -> WAITING / DONE -> WORKING; working panes spend and fill context.
type State = 'WORKING' | 'WAITING' | 'DONE'
type Pane = { name: string; state: State; cost: number; ctx: number }

const TEXT: Record<string, Record<State, string>> = {
  api: {
    WORKING: 'Reading routes/users.js…',
    WAITING: 'Do you want to make this edit\nto server.js?\n❯ 1. Yes\n  2. Yes, allow all edits\n  3. No',
    DONE: 'server.js returns JSON for 404s.',
  },
  web: {
    WORKING: 'Writing index.html…',
    WAITING: 'Run npm install?\n❯ 1. Yes\n  2. No',
    DONE: 'index.html now shows a heading and\none button that opens an alert.',
  },
  billing: {
    WORKING: 'Searching 212 files for usages…',
    WAITING: 'Do you want to make this edit\nto invoice.py?\n❯ 1. Yes',
    DONE: 'Totals now round to 2 places.',
  },
  mobile: {
    WORKING: 'Reading invoice.py…',
    WAITING: 'Do you want to make this edit\nto Settings.swift?\n❯ 1. Yes',
    DONE: 'Settings.swift has a dark mode toggle.',
  },
  docs: {
    WORKING: 'Checking every link…',
    WAITING: 'Overwrite install.md?\n❯ 1. Yes',
    DONE: 'install.md requires Node 20.\nChecked every link.',
  },
  infra: {
    WORKING: 'Running the test suite…',
    WAITING: 'Allow docker compose up?\n❯ 1. Yes',
    DONE: 'All 196 checks pass.',
  },
}

const START: Pane[] = [
  { name: 'api', state: 'WAITING', cost: 12.4, ctx: 38 },
  { name: 'web', state: 'DONE', cost: 3.1, ctx: 14 },
  { name: 'billing', state: 'WORKING', cost: 28.7, ctx: 72 },
  { name: 'mobile', state: 'WAITING', cost: 9.8, ctx: 56 },
  { name: 'docs', state: 'DONE', cost: 1.9, ctx: 9 },
  { name: 'infra', state: 'WORKING', cost: 44.2, ctx: 88 },
]

const FEATURES = ['Cockpit', 'Bill X-ray', 'Cache clock', 'Context tax', 'Smart compact', 'Pinned rules', 'Skills']

const nextState = (s: State): State =>
  s === 'WORKING' ? (Math.random() < 0.55 ? 'WAITING' : 'DONE') : 'WORKING'

const FleetPanes = () => {
  const [panes, setPanes] = useState<Pane[]>(START)
  const [flash, setFlash] = useState(-1)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let visible = false
    let last = -1
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const id = window.setInterval(() => {
      if (!visible) return
      let i = Math.floor(Math.random() * START.length)
      if (i === last) i = (i + 1) % START.length
      last = i
      setPanes((prev) =>
        prev.map((p, j) => {
          const work = p.state === 'WORKING'
          const q = {
            ...p,
            cost: work ? p.cost + 0.1 + Math.random() * 0.5 : p.cost,
            ctx: work ? Math.min(96, p.ctx + 1 + Math.round(Math.random() * 2)) : p.ctx,
          }
          if (j !== i) return q
          const state = nextState(p.state)
          // A finished chat that starts again begins with a lighter context.
          return { ...q, state, ctx: state === 'WORKING' && p.state === 'DONE' ? Math.max(6, q.ctx - 30) : q.ctx }
        })
      )
      setFlash(i)
    }, 1400)
    return () => {
      window.clearInterval(id)
      io.disconnect()
    }
  }, [])

  const waiting = panes.filter((p) => p.state === 'WAITING').length

  return (
    <figure className={styles.fleetWin} ref={ref} aria-label="Illustration of the Fleet window with sample data">
      <div className={styles.fleetBar}>
        <span className={styles.fleetLights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>fleet</span>
        <span className={styles.fleetCount} data-zero={waiting === 0}>
          {waiting} waiting
        </span>
      </div>
      <div className={styles.fleetBody}>
        <aside className={styles.fleetSide} aria-hidden="true">
          <span className={styles.fleetSideHead}>Features</span>
          {FEATURES.map((f, i) => (
            <span key={f} data-on={i === 0}>
              {f}
            </span>
          ))}
        </aside>
        <div className={styles.fleetMain}>
          <div className={styles.fleetMainHead}>
            <span>Screen · acme</span>
            <span className={styles.fleetJump}>⌘J Jump to next waiting</span>
          </div>
          <div className={styles.fleetGrid}>
            {panes.map((p, i) => (
              <div key={p.name} className={styles.fleetPane} data-state={p.state} data-flash={flash === i}>
                <header>
                  <i className={styles.fleetDot} />
                  {p.name}
                  <span className={styles.fleetTag}>{p.state}</span>
                  <span className={styles.fleetCost}>${p.cost.toFixed(2)}</span>
                </header>
                <pre>{TEXT[p.name][p.state]}</pre>
                <footer>
                  <span className={styles.fleetCtx} data-hot={p.ctx > 80}>
                    <i style={{ width: `${p.ctx}%` }} />
                  </span>
                  {p.ctx}% ctx
                </footer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

export default FleetPanes
