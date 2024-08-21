export const useAppStore = defineStore('app', () => {
  const theme = useColorMode({
    attribute: 'arco-theme',
    emitAuto: true,
    selector: 'body',
    storageKey: 'theme',
  })

  const { locale: _locale } = useI18n()

  const { language } = useNavigatorLanguage()

  const locale = useStorage(
    'locale',
    language.value?.toLocaleLowerCase() || 'zh-cn',
  )

  function setLocale(val: LocaleValue) {
    locale.value = val
  }

  watchEffect(() => (_locale.value = locale.value))

  return {
    locale,
    theme,
    setLocale,
  }
})
