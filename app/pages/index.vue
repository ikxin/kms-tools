<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

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
    <!-- Hero Section -->
    <div class="w-full rounded bg-[var(--color-bg-2)] p-6 shadow-lg md:p-10">
      <div
        class="flex flex-col items-center gap-8 py-4 md:flex-row md:gap-12 md:py-8"
      >
        <div class="w-full text-center md:w-1/2 md:pl-8 md:text-left lg:pl-12">
          <h2
            class="mx-auto mb-4 w-fit bg-gradient-to-r from-[#e85349] to-[#f3bb4b] bg-clip-text text-4xl font-bold text-transparent md:mx-0 md:mb-6 md:text-7xl"
          >
            KMS Tools
          </h2>
          <p
            class="mb-3 text-2xl font-bold text-[var(--color-text-2)] md:mb-4 md:text-4xl"
          >
            {{ t('home.hero.subtitle') }}
          </p>
          <p
            class="mb-6 text-base text-[var(--color-text-3)] md:mb-8 md:text-xl"
          >
            {{ t('home.hero.description') }}
          </p>
          <div class="flex justify-center gap-3 md:justify-start md:gap-4">
            <NuxtLink :to="localePath('/activate/windows')">
              <AButton type="primary" size="large">
                {{ t('home.hero.get-started') }}
              </AButton>
            </NuxtLink>
            <NuxtLink to="https://github.com/ikxin/kms-tools" target="_blank">
              <AButton size="large">
                {{ t('home.hero.view-on-github') }}
              </AButton>
            </NuxtLink>
          </div>
        </div>
        <div class="hidden w-1/2 justify-center md:flex">
          <img
            src="/images/homepage-right.svg"
            alt="KMS Tools"
            class="h-auto max-w-full"
          />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="w-full rounded bg-[var(--color-bg-2)] p-6 shadow-lg md:p-10">
      <div class="mb-6 text-center md:mb-8">
        <h3
          class="mb-2 text-2xl font-bold text-[var(--color-text-1)] md:text-3xl"
        >
          {{ t('home.features.title') }}
        </h3>
        <p class="text-sm text-[var(--color-text-3)] md:text-base">
          {{ t('home.features.subtitle') }}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <NuxtLink
          v-for="feature in features"
          :key="feature.key"
          :to="localePath(feature.link)"
          class="group rounded-lg border border-[var(--color-border)] p-5 transition-all hover:border-[rgb(var(--primary-6))] hover:shadow-md md:p-6"
        >
          <div
            class="mb-3 inline-flex rounded-lg bg-[rgb(var(--primary-6))]/10 p-3 md:mb-4"
          >
            <Icon
              :name="feature.icon"
              class="text-2xl text-[rgb(var(--primary-6))]"
            />
          </div>
          <h4
            class="mb-2 text-lg font-semibold text-[var(--color-text-1)] group-hover:text-[rgb(var(--primary-6))]"
          >
            {{ t(`home.features.${feature.key}.title`) }}
          </h4>
          <p class="text-sm leading-relaxed text-[var(--color-text-3)]">
            {{ t(`home.features.${feature.key}.description`) }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
