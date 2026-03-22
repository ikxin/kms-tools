import { useReducedMotion } from 'motion-v'

const easeOut = [0.22, 1, 0.36, 1] as const

const springTransition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1,
} as const

export function useMotionPresets() {
  const reduceMotion = useReducedMotion()

  const viewport = {
    once: true,
    amount: 0.2,
  } as const

  const hidden = (y = 16, scale = 1) => {
    if (reduceMotion.value) {
      return { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
    }

    return {
      opacity: 0,
      y,
      scale,
      filter: 'blur(6px)',
    }
  }

  const visible = (delay = 0) => {
    if (reduceMotion.value) {
      return { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
    }

    return {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        ...springTransition,
        delay,
      },
    }
  }

  const softExit = (y = -10) => {
    if (reduceMotion.value) {
      return { opacity: 1 }
    }

    return {
      opacity: 0,
      y,
      filter: 'blur(4px)',
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    }
  }

  const hoverLift = (distance = 5, scale = 1.01) => {
    if (reduceMotion.value) {
      return {}
    }

    return {
      y: -distance,
      scale,
      transition: {
        duration: 0.22,
        ease: easeOut,
      },
    }
  }

  const press = reduceMotion.value ? { scale: 1 } : { scale: 0.985 }

  const float = (distance = 8, duration = 9) => {
    if (reduceMotion.value) {
      return {}
    }

    return {
      y: [0, -distance, 0],
      rotate: [0, 0.6, 0],
      transition: {
        duration,
        ease: 'easeInOut' as const,
        repeat: Infinity,
      },
    }
  }

  return {
    easeOut,
    float,
    hidden,
    hoverLift,
    press,
    reduceMotion,
    softExit,
    springTransition,
    viewport,
    visible,
  }
}
