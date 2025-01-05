export default defineEventHandler(async event => {
  const {
    host,
    port = 1688,
    protocol = 6,
    edition = 1,
  } = getQuery<RunVlmcsParams>(event)

  const result = await runVlmcs({
    host,
    port,
    protocol,
    edition,
  })

  return result
})
