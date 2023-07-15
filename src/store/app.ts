export const useAppStore = defineStore('app', () => {
  const { locale } = useI18n()

  const theme = useColorMode({
    attribute: 'arco-theme',
    emitAuto: true,
    selector: 'body',
    storageKey: 'theme'
  })

  const { language: _language } = useNavigatorLanguage()

  const languages = useStorage('languages', _language.value.toLocaleLowerCase())

  watch(languages, value => (locale.value = value))

  return { theme, languages }
})
