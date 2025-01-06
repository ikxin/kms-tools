<script setup>
const route = useRoute()

const { t } = useI18n()

const head = useLocaleHead()

const title = computed(() => {
  return route.meta.title
    ? `${t(route.meta.title)} - ${t('app.title')} - ${t('app.titleTemplate')}`
    : `${t('app.title')} - ${t('app.titleTemplate')}`
})
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.hid">
        <Link
          :id="link.hid"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.hid">
        <Meta
          :id="meta.hid"
          :property="meta.property"
          :content="meta.content"
        />
      </template>
    </Head>
    <Body>
      <AppHeader />
      <section class="flex flex-1 mx-auto max-w-full gap-4 w-[72rem]">
        <slot></slot>
      </section>
      <AppFooter />
    </Body>
  </Html>
</template>
