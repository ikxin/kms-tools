<script setup lang="ts">
import { motion, useScroll, useTransform } from 'motion-v'

const heroIllustrationUrl = '/images/homepage-right.svg'

const { t } = useI18n()
const localePath = useLocalePath()

const { hidden, hoverLift, press, reduceMotion, viewport, visible } =
  useMotionPresets()

const { scrollYProgress } = useScroll()

const heroImageY = useTransform(scrollYProgress, [0, 0.45], [0, -20])
const heroImageRotate = useTransform(scrollYProgress, [0, 0.45], [0, -1])

const features = computed(() => [
  {
    key: 'activate',
    icon: 'icons:activate',
    link: '/activate/windows',
  },
  {
    key: 'check',
    icon: 'icons:tools',
    link: '/check',
  },
  {
    key: 'monitor',
    icon: 'icons:monitor',
    link: '/monitor',
  },
])
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <motion.section
      class="bg-[var(--color-bg-2)]/90 relative w-full overflow-hidden rounded-lg border border-black/5 p-6 shadow-lg shadow-black/10 md:p-10 dark:border-white/10 dark:shadow-black/5"
      :initial="hidden(24, 0.98)"
      :animate="visible(0.02)"
      layout
    >
      <div
        class="bg-[#e85349]/16 absolute -left-10 top-8 h-36 w-36 rounded-full blur-3xl"
      />
      <div
        class="bg-[rgb(var(--primary-6))]/14 absolute bottom-0 right-0 h-44 w-44 rounded-full blur-3xl"
      />

      <div
        class="relative flex flex-col items-center gap-8 py-4 md:flex-row md:gap-12 md:py-8"
      >
        <div class="w-full text-center md:w-1/2 md:text-left">
          <motion.h2
            class="mx-auto mb-4 w-fit bg-gradient-to-r from-[#e85349] to-[#f3bb4b] bg-clip-text text-4xl font-bold text-transparent md:mx-0 md:mb-6 md:text-7xl"
            :initial="hidden(24, 0.96)"
            :animate="visible(0.08)"
          >
            KMS Tools
          </motion.h2>
          <motion.p
            class="mb-3 text-2xl font-bold text-[var(--color-text-2)] md:mb-4 md:text-4xl"
            :initial="hidden(20)"
            :animate="visible(0.14)"
          >
            {{ t('home.hero.subtitle') }}
          </motion.p>
          <motion.p
            class="mb-6 text-base text-[var(--color-text-3)] md:mb-8 md:text-xl"
            :initial="hidden(18)"
            :animate="visible(0.2)"
          >
            {{ t('home.hero.description') }}
          </motion.p>

          <div class="flex justify-center gap-3 md:justify-start md:gap-4">
            <NuxtLink :to="localePath('/activate/windows')">
              <motion.div
                :initial="hidden(12)"
                :animate="visible(0.3)"
                :whileHover="hoverLift(5, 1.03)"
                :whilePress="press"
              >
                <AButton type="primary" size="large">
                  {{ t('home.hero.get-started') }}
                </AButton>
              </motion.div>
            </NuxtLink>
            <NuxtLink to="https://github.com/ikxin/kms-tools" target="_blank">
              <motion.div
                :initial="hidden(12)"
                :animate="visible(0.36)"
                :whileHover="hoverLift(5, 1.03)"
                :whilePress="press"
              >
                <AButton size="large">
                  {{ t('home.hero.view-on-github') }}
                </AButton>
              </motion.div>
            </NuxtLink>
          </div>
        </div>
        <div class="hidden w-1/2 justify-center md:flex">
          <motion.div
            class="relative"
            :style="{ y: heroImageY, rotate: heroImageRotate }"
            :whileHover="{ scale: 1.015, rotate: -1.5 }"
          >
            <div
              class="bg-[rgb(var(--primary-6))]/14 absolute inset-6 rounded-full blur-3xl"
            />
            <img
              :src="heroIllustrationUrl"
              alt="KMS Tools"
              class="relative block h-auto w-full max-w-[30rem]"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>

    <motion.section
      class="bg-[var(--color-bg-2)]/90 w-full rounded-lg border border-black/5 p-6 shadow-lg shadow-black/10 md:p-10 dark:border-white/10 dark:shadow-black/5"
      :initial="hidden(24, 0.98)"
      :whileInView="visible(0.04)"
      :inViewOptions="viewport"
      layout
    >
      <motion.div
        class="mb-6 text-center md:mb-8"
        :initial="hidden(18)"
        :whileInView="visible()"
        :inViewOptions="viewport"
      >
        <motion.h3
          class="mb-2 text-2xl font-bold text-[var(--color-text-1)] md:text-3xl"
          :initial="hidden(18)"
          :whileInView="visible()"
          :inViewOptions="viewport"
        >
          {{ t('home.features.title') }}
        </motion.h3>
        <motion.p
          class="text-sm text-[var(--color-text-3)] md:text-base"
          :initial="hidden(14)"
          :whileInView="visible(0.05)"
          :inViewOptions="viewport"
        >
          {{ t('home.features.subtitle') }}
        </motion.p>
      </motion.div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <NuxtLink
          v-for="feature in features"
          :key="feature.key"
          :to="localePath(feature.link)"
        >
          <motion.div
            class="group relative h-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-5 transition-all md:p-6"
            :initial="hidden(20, 0.97)"
            :whileInView="
              visible(
                features.findIndex(item => item.key === feature.key) * 0.08,
              )
            "
            :inViewOptions="viewport"
            :whileHover="hoverLift(6, 1.012)"
            :whilePress="press"
            layout
          >
            <div
              class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[rgb(var(--primary-6))]/10 blur-3xl"
            />
            <motion.div
              class="relative mb-3 inline-flex rounded-2xl bg-[rgb(var(--primary-6))]/10 p-3 md:mb-4"
              :whileHover="{ rotate: -3, scale: 1.04 }"
            >
              <Icon
                :name="feature.icon"
                class="text-2xl text-[rgb(var(--primary-6))]"
              />
            </motion.div>
            <h4
              class="relative mb-2 text-lg font-semibold text-[var(--color-text-1)] group-hover:text-[rgb(var(--primary-6))]"
            >
              {{ t(`home.features.${feature.key}.title`) }}
            </h4>
            <p
              class="relative text-sm leading-relaxed text-[var(--color-text-3)]"
            >
              {{ t(`home.features.${feature.key}.description`) }}
            </p>
          </motion.div>
        </NuxtLink>
      </div>
    </motion.section>
  </div>
</template>
