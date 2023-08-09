const en = import.meta.glob('./en/*.ts', {
  import: 'default',
  eager: true
})

const message = {}

for (const key in en) {
  const [language, fileName] = key.split('/').slice(1)
  const value = en[key]

  if (!message[language]) {
    message[language] = {}
  }

  message[language][fileName.split('.')[0]] = value
}

export default message
