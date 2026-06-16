<script setup lang="ts">
const { fonts } = useFonts()
const colorMode = useColorMode()

const selectedFamily = ref('Outfit')
const isOpen = ref(false)

watch(fonts, (val) => {
  if (val.length && !selectedFamily.value) {
    selectedFamily.value = val[0]?.family ?? ''
  }
}, { immediate: true })

const selectedFont = computed(() => fonts.value.find(f => f.family === selectedFamily.value))

useHead({
  link: computed(() =>
    fonts.value.map(font => ({
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`,
    })),
  ),
})

const fontStyle = computed(() => ({
  fontFamily: selectedFamily.value ? `'${selectedFamily.value}', sans-serif` : 'inherit',
}))

function selectFont(family: string) {
  selectedFamily.value = family
  isOpen.value = false
}

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const regularVariants = computed(() =>
  selectedFont.value?.variants.filter(v => !v.includes('italic')) ?? [],
)

const downloadUrl = computed(() => selectedFont.value?.files?.regular ?? null)
</script>

<template>
  <div class="min-h-screen flex flex-col" :style="fontStyle">
    <!-- Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false" />

    <!-- Header -->
    <div class="flex shrink-0 border-b border-default z-50 relative">
      <!-- Dropdown -->
      <div class="flex-1 min-w-0">
        <div class="flex items-end justify-between px-6 py-5 sm:px-10 sm:py-6 lg:px-16 lg:py-8">
          <button class="flex-1 text-left min-w-0" @click="isOpen = !isOpen">
            <span
              class="font-thin tracking-tight leading-none text-highlighted block truncate"
              style="font-size: clamp(1.5rem, 5.5vw, 4.5rem)"
              :style="fontStyle"
            >
              {{ selectedFamily || '—' }}
            </span>
          </button>
          <button
            class="text-[10px] tracking-[0.2em] uppercase text-dimmed hover:text-highlighted transition-colors pb-1 shrink-0 ml-4 lg:ml-8"
            @click="isOpen = !isOpen"
          >
            {{ isOpen ? 'close ↑' : 'change ↓' }}
          </button>
        </div>

        <Transition name="dropdown">
          <div v-if="isOpen" class="absolute left-0 right-0 top-full bg-elevated border-b border-default">
            <button
              v-for="font in fonts"
              :key="font.family"
              class="w-full px-6 sm:px-10 lg:px-16 py-4 lg:py-5 text-left border-b border-muted last:border-0 hover:bg-accented transition-colors"
              :class="font.family === selectedFamily ? 'text-highlighted' : 'text-muted'"
              :style="{ fontFamily: `'${font.family}', sans-serif`, fontSize: 'clamp(1.1rem, 3vw, 1.75rem)', fontWeight: '300' }"
              @click="selectFont(font.family)"
            >
              {{ font.family }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Theme toggle -->
      <button
        class="shrink-0 border-l border-default flex items-center justify-center w-14 sm:w-20 lg:w-28 hover:bg-elevated transition-colors"
        @click="toggleColorMode"
      >
        <UIcon
          :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          class="size-5 sm:size-7 lg:size-9 text-highlighted"
        />
      </button>
    </div>

    <!-- Main -->
    <div v-if="selectedFont" class="flex-1 flex flex-col">
      <!-- Mobile: Aa hero -->
      <div class="lg:hidden flex items-center justify-center border-b border-default py-10 select-none bg-elevated">
        <span class="font-thin text-highlighted leading-none" style="font-size: clamp(6rem, 38vw, 14rem)">Aa</span>
      </div>

      <!-- Content area -->
      <div class="flex-1 flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <!-- Info row -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-stretch lg:flex-1 lg:min-h-0 gap-10 lg:gap-0">
          <!-- Left: title + meta -->
          <div class="flex flex-col justify-between gap-8 lg:gap-0">
            <h1 class="font-thin text-highlighted leading-tight" style="font-size: clamp(1.75rem, 4vw, 3rem)">
              My Favorite<br>Fonts
            </h1>

            <div class="grid grid-cols-2 gap-x-10 gap-y-5 pt-6 border-t border-default sm:gap-x-16 lg:gap-x-14">
              <div>
                <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-1.5">
                  For
                </p>
                <p class="text-sm lg:text-base font-light capitalize text-highlighted">
                  {{ selectedFont.category }}
                </p>
              </div>
              <div>
                <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-1.5">
                  Typeface
                </p>
                <p class="text-sm lg:text-base font-light text-highlighted">
                  {{ selectedFont.family }}
                </p>
              </div>
              <div>
                <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-1.5">
                  Variants
                </p>
                <p class="text-sm lg:text-base font-light text-highlighted">
                  {{ regularVariants.length }} styles
                </p>
              </div>
              <div>
                <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-1.5">
                  Version
                </p>
                <p class="text-sm lg:text-base font-light uppercase text-highlighted">
                  {{ selectedFont.version }}
                </p>
              </div>
              <div v-if="downloadUrl" class="col-span-2">
                <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-1.5">
                  Download
                </p>
                <a
                  :href="downloadUrl"
                  target="_blank"
                  rel="noopener"
                  class="text-sm lg:text-base font-light text-highlighted hover:text-muted transition-colors"
                >
                  {{ selectedFont.family }}-Regular.ttf ↓
                </a>
              </div>
            </div>
          </div>

          <!-- Right: Aa (desktop only) -->
          <div class="hidden lg:flex items-center justify-end select-none">
            <span class="font-thin text-highlighted leading-none" style="font-size: min(46vh, 28vw)">Aa</span>
          </div>
        </div>

        <!-- Characters -->
        <div class="border-t border-default pt-8 mt-8 lg:mt-8 shrink-0">
          <p class="text-[9px] font-semibold tracking-[0.22em] uppercase text-dimmed mb-6">
            Characters
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
            <div class="font-thin text-sm leading-loose text-highlighted">
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789</p>
            </div>
            <div class="font-light text-sm leading-loose text-muted">
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789</p>
            </div>
            <div class="text-xs leading-relaxed text-dimmed sm:col-span-2 lg:col-span-1 lg:self-end lg:text-right">
              <p>{{ selectedFont.subsets.join(' · ') }}</p>
              <p class="mt-1">
                {{ selectedFont.lastModified }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="shrink-0 border-t border-default px-6 sm:px-10 lg:px-16 py-5 flex items-center justify-between gap-4">
      <p class="text-xs text-dimmed">
        Made by Atlas Yiğit Aydın
      </p>
      <a href="https://atlaxt.me" target="_blank" rel="noopener" class="hover:opacity-70 transition-opacity shrink-0">
        <UColorModeImage
          light="https://atlaxt.me/sign_black.png"
          dark="https://atlaxt.me/sign_white.png"
          alt="atlaxt.me"
          class="h-6 w-auto"
        />
      </a>
    </footer>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
