const en = import.meta.glob('./en/*.ts', {
  import: 'default',
  eager: true
})

export default { en }
