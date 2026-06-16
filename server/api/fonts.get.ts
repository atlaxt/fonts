const ALLOWED_FONTS = [
  'Figtree',
  'Outfit',
  'Inter',
  'Doto',
  'Quicksand',
  'Poppins',
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const data = await $fetch<{ items: unknown[] }>(
    'https://www.googleapis.com/webfonts/v1/webfonts',
    { params: { key: config.webFontsDeveloperApi } },
  )

  return data.items.filter(
    (font: any) => ALLOWED_FONTS.includes(font.family),
  )
})
