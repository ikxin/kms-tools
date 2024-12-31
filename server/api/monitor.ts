export default defineEventHandler(async () => {
  return await useStorage().getItem('monitorData')
})
