export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | undefined

  const update = (event: MediaQueryList | MediaQueryListEvent) => {
    matches.value = event.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    update(mediaQuery)
    mediaQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return matches
}
