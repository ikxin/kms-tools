export const request = () => {
  const runtimeConfig = useRuntimeConfig()

  return $fetch.create({
    baseURL: runtimeConfig.public.apiUrl,
  })
}
