export const useAppStore = defineStore('app', () => {
  const theme = useColorMode({
    attribute: 'arco-theme',
    emitAuto: true,
    selector: 'body',
    storageKey: 'theme',
  })

  const { locale } = useI18n()

  const { language } = useNavigatorLanguage()

  const _locale = useStorage(
    'locale',
    language.value?.toLocaleLowerCase() || 'zh-cn',
  )

  watchEffect(() => (locale.value = _locale.value))

  return { theme, locale }
})
