// Shared motion setup: GSAP + ScrollTrigger, registered once on the client.
import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export { gsap, ScrollTrigger, useGSAP }

/** Media queries used with gsap.matchMedia(). */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.fine).matches

/** Pull an element toward the mouse while it hovers, then spring back. */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || reducedMotion()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, strength])
}

/** 3D tilt toward the mouse for every [data-tilt] element inside the scope. */
export function useTilt(scope: RefObject<HTMLElement>, max = 8) {
  useEffect(() => {
    const root = scope.current
    if (!root || !finePointer() || reducedMotion()) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-tilt]'))
    const offs = els.map((el) => {
      gsap.set(el, { transformPerspective: 900 })
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        ry(px * max * 2)
        rx(-py * max * 2)
      }
      const leave = () => {
        rx(0)
        ry(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
    return () => offs.forEach((off) => off())
  }, [scope, max])
}
