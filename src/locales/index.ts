const locales = import.meta.glob('./en/*.ts', {
  import: 'default',
  eager: true,
})

const languages = {}

for (const locale in locales) {
  const [language, fileName] = locale.split('/').slice(1)
  if (!languages[language]) languages[language] = {}
  languages[language][fileName.split('.')[0]] = locales[locale]
}

export default languages
