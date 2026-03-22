<script setup>
import { AnimatePresence, motion } from 'motion-v'

const route = useRoute()

const { t } = useI18n()

const { hidden, reduceMotion, softExit, visible } = useMotionPresets()

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
    <Body class="relative overflow-x-clip">
      <div class="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          class="bg-[rgb(var(--primary-6))]/12 absolute left-[-8rem] top-28 h-72 w-72 rounded-full blur-3xl"
        />
        <div
          class="bg-[#f3bb4b]/16 absolute right-[-7rem] top-36 h-64 w-64 rounded-full blur-3xl"
        />
        <div
          class="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-[#e85349]/10 blur-3xl"
        />
      </div>

      <motion.div :initial="hidden(14)" :animate="visible()">
        <AppHeader />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.section
          :key="route.fullPath"
          class="mx-auto flex w-[72rem] max-w-full flex-1 gap-4 px-3 md:px-0"
          :initial="hidden(18, 0.99)"
          :animate="visible(0.04)"
          :exit="softExit()"
        >
          <slot></slot>
        </motion.section>
      </AnimatePresence>

      <motion.div
        :initial="hidden(18)"
        :whileInView="visible(0.05)"
        :inViewOptions="{ once: true, amount: 0.15 }"
      >
        <AppFooter />
      </motion.div>
    </Body>
  </Html>
</template>
