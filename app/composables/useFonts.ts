interface FontFile {
  [weight: string]: string
}

interface Font {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: FontFile
  category: string
  kind: string
  menu: string
}

interface WebFontsResponse {
  kind: string
  items: Font[]
}

export function useFonts() {
  const config = useRuntimeConfig()

  const { data, status, error } = useFetch<WebFontsResponse>(
    'https://www.googleapis.com/webfonts/v1/webfonts',
    {
      params: { key: config.public.webFontsDeveloperApi },
    },
  )

  const fonts = computed(() => data.value?.items ?? [])

  return { fonts, status, error }
}
