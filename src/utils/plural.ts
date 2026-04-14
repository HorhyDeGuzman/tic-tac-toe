export type PluralForms = [one: string, few: string, many: string]

export function pluralRu(n: number, forms: PluralForms): string {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

export const RU = {
  wins: ['Победа', 'Победы', 'Побед'] as PluralForms,
  draws: ['Ничья', 'Ничьи', 'Ничьих'] as PluralForms,
  losses: ['Поражение', 'Поражения', 'Поражений'] as PluralForms,
  games: ['Игра', 'Игры', 'Игр'] as PluralForms,
  crystals: ['Кристалл', 'Кристалла', 'Кристаллов'] as PluralForms,
}
