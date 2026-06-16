interface FontFile {
  [weight: string]: string
}

export interface Font {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: FontFile
  category: string
}

export function useFonts() {
  const { data, status, error } = useFetch<Font[]>('/api/fonts', {
    server: false,
  })

  const fonts = computed(() => data.value ?? [])

  return { fonts, status, error }
}
