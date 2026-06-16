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

const ALLOWED_FONTS = [
  'Figtree',
  'Outfit',
  'Inter',
  'Doto',
  'Quicksand',
  'Poppins',
]

export function useFonts() {
  const config = useRuntimeConfig()

  const { data, status, error } = useFetch<WebFontsResponse>(
    'https://www.googleapis.com/webfonts/v1/webfonts',
    {
      params: { key: config.public.webFontsDeveloperApi },
    },
  )

  const fonts = computed(() =>
    (data.value?.items ?? []).filter(font => ALLOWED_FONTS.includes(font.family)),
  )

  return { fonts, status, error }
}
