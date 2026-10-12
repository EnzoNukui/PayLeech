import type { Periodicidade } from '../types/assinatura'

export interface ManualServicePlan {
  planName: string
  amount: number
  /** Period that `amount` represents; defaults to monthly. */
  amountPeriod?: Periodicidade
  /** Published prices by cadence, when the provider publishes them. */
  periodAmounts?: Partial<Record<Periodicidade, number>>
  currency?: string
}

export interface ManualServicePrice extends ManualServicePlan {
  additionalPlans?: ManualServicePlan[]
  checkedAt: string
  sourceUrl: string
  sourceLabel: string
  note?: string
}

const units: Record<Periodicidade, number> = { MENSAL: 1, TRIMESTRAL: 3, ANUAL: 12 }

export function priceForPeriod(plan: ManualServicePlan, periodicidade: Periodicidade) {
  const exact = plan.periodAmounts?.[periodicidade]
  if (exact !== undefined) return { amount: exact, estimated: false }
  const sourceUnits = units[plan.amountPeriod ?? 'MENSAL']
  return { amount: Math.round((plan.amount / sourceUnits * units[periodicidade] + Number.EPSILON) * 100) / 100, estimated: true }
}

const brazilPricesPage = 'https://pricebycountry.com/prices-in/brazil/'
const aiPage = (slug: string) => `https://pricebycountry.com/ai-prices/${slug}/`

/**
 * Curated Brazil price references. These are snapshots, not live quotes.
 * Keep the observation date and source beside every amount so the UI can
 * disclose where the suggestion came from and users can confirm it.
 */
export const manualServicePrices: Record<string, ManualServicePrice> = {
  netflix: { planName: 'Plano mensal listado', amount: 44.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  spotify: { planName: 'Premium Individual', amount: 23.90, periodAmounts: { ANUAL: 239.00 }, additionalPlans: [{ planName: 'Student', amount: 12.90 }, { planName: 'Duo', amount: 31.90 }, { planName: 'Family', amount: 40.90 }], checkedAt: '06/10/2026', sourceUrl: 'https://pricebycountry.com/streaming-prices/spotify/', sourceLabel: 'PriceByCountry' },
  'youtube premium': { planName: 'Premium Individual', amount: 24.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'youtube music': { planName: 'Individual', amount: 21.90, periodAmounts: { ANUAL: 219.00 }, additionalPlans: [{ planName: 'Estudante', amount: 11.90 }, { planName: 'Família', amount: 34.90 }], checkedAt: '05/09/2026', sourceUrl: 'https://lensub.app/precos/youtube-music', sourceLabel: 'Lensub (preço conferido na página do fornecedor)', note: 'O plano anual individual é pré-pago, sem renovação automática.' },
  'amazon prime': { planName: 'Prime mensal', amount: 19.90, checkedAt: '11/10/2026', sourceUrl: 'https://www.aboutamazon.com.br/noticias/loja/quando-e-o-prime-day-2026-aproveite-as-ofertas-de-1-a-7-de-julho', sourceLabel: 'About Amazon Brasil' },
  'prime video': { planName: 'Amazon Prime mensal', amount: 19.90, checkedAt: '11/10/2026', sourceUrl: 'https://www.aboutamazon.com.br/noticias/loja/quando-e-o-prime-day-2026-aproveite-as-ofertas-de-1-a-7-de-julho', sourceLabel: 'About Amazon Brasil', note: 'Acesso ao Prime Video incluído na assinatura Amazon Prime.' },
  'disney+': { planName: 'Plano mensal listado', amount: 69.90, checkedAt: '06/10/2026', sourceUrl: 'https://worldpriceindex.org/subscriptions/disney-plus', sourceLabel: 'World Price Index' },
  'disney plus': { planName: 'Plano mensal listado', amount: 69.90, checkedAt: '06/10/2026', sourceUrl: 'https://worldpriceindex.org/subscriptions/disney-plus', sourceLabel: 'World Price Index' },
  'max': { planName: 'Básico com anúncios', amount: 29.90, additionalPlans: [{ planName: 'Standard', amount: 39.90 }, { planName: 'Platinum', amount: 55.90 }], checkedAt: '11/10/2026', sourceUrl: 'https://help.max.com/br/Answer/Detail/000002547', sourceLabel: 'Central de ajuda Max' },
  'paramount+': { planName: 'Básico mensal', amount: 27.90, additionalPlans: [{ planName: 'Padrão mensal', amount: 34.90 }, { planName: 'Premium mensal', amount: 44.90 }], checkedAt: '11/10/2026', sourceUrl: 'https://apps.apple.com/br/app/paramount/id1340650234?platform=tv', sourceLabel: 'App Store' },
  'apple tv+': { planName: 'Assinatura mensal', amount: 34.90, checkedAt: '11/10/2026', sourceUrl: 'https://www.apple.com/br/apple-tv/', sourceLabel: 'Apple Brasil' },
  'globoplay': { planName: 'Padrão com anúncios', amount: 22.90, checkedAt: '04/09/2026', sourceUrl: 'https://lensub.app/precos/globoplay', sourceLabel: 'Lensub' },
  'crunchyroll': { planName: 'Plano mensal listado', amount: 24.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'mubi': { planName: 'Plano mensal listado', amount: 34.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'apple music': { planName: 'Individual', amount: 23.90, additionalPlans: [{ planName: 'Estudante', amount: 12.90 }, { planName: 'Família', amount: 40.90 }], checkedAt: '05/10/2026', sourceUrl: 'https://pricebycountry.com/streaming-prices/apple-music/', sourceLabel: 'PriceByCountry' },
  'deezer': { planName: 'Plano mensal listado', amount: 29.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'tidal': { planName: 'Plano mensal listado', amount: 30.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'microsoft 365': { planName: 'Plano mensal listado', amount: 51.00, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'canva pro': { planName: 'Plano mensal listado', amount: 35.00, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store; confirme o plano e o canal de cobrança.' },
  'adobe creative cloud': { planName: 'Creative Cloud', amount: 227.45, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'notion plus': { planName: 'Notion Plus', amount: 59.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'todoist pro': { planName: 'Plano mensal listado', amount: 24.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'evernote personal': { planName: 'Plano mensal listado', amount: 54.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'zoom pro': { planName: 'Plano mensal listado', amount: 77.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'linkedin premium': { planName: 'Plano mensal listado', amount: 89.99, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'grammarly premium': { planName: 'Plano mensal listado', amount: 162.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'icloud+': { planName: '50 GB', amount: 5.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'google one': { planName: '100 GB', amount: 9.99, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'google workspace': { planName: 'Business Starter (por usuário)', amount: 40.90, additionalPlans: [{ planName: 'Business Standard (por usuário)', amount: 98.00 }, { planName: 'Business Plus (por usuário)', amount: 154.00 }], checkedAt: '11/10/2026', sourceUrl: 'https://workspace.google.com/intl/pt-BR/business/', sourceLabel: 'Google Workspace Brasil' },
  'dropbox': { planName: 'Plano mensal listado', amount: 45.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'onedrive': { planName: 'Plano mensal listado', amount: 51.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'chatgpt plus': { planName: 'Plus', amount: 99.90, periodAmounts: { ANUAL: 999.00 }, checkedAt: '06/10/2026', sourceUrl: aiPage('chatgpt'), sourceLabel: 'PriceByCountry', note: 'O plano anual aparece como compra anual no site; confirme a disponibilidade na sua conta.' },
  'claude pro': { planName: 'Pro', amount: 129.90, periodAmounts: { ANUAL: 749.00 }, additionalPlans: [{ planName: 'Max 5x', amount: 799.90 }, { planName: 'Max 20x', amount: 1500.00 }], checkedAt: '06/10/2026', sourceUrl: aiPage('claude'), sourceLabel: 'PriceByCountry', note: 'Preço anual verificado para o Pro; os planos Max foram encontrados apenas com preço mensal.' },
  'gemini advanced': { planName: 'Google AI Pro', amount: 64.90, checkedAt: '27/07/2026', sourceUrl: aiPage('gemini'), sourceLabel: 'PriceByCountry' },
  'perplexity pro': { planName: 'Professional', amount: 129.90, checkedAt: '04/10/2026', sourceUrl: aiPage('perplexity'), sourceLabel: 'PriceByCountry' },
  'github copilot': { planName: 'Plano mensal listado', amount: 49.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store; confirme o plano e o canal de cobrança.' },
  'microsoft copilot': { planName: 'Plano mensal listado', amount: 109.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store; confirme o plano e o canal de cobrança.' },
  'cursor pro': { planName: 'Pro+ (referência)', amount: 179.90, checkedAt: '06/10/2026', sourceUrl: aiPage('cursor'), sourceLabel: 'PriceByCountry', note: 'A referência disponível é do plano Pro+, não do Pro.' },
  'runway': { planName: 'Standard', amount: 99.90, checkedAt: '09/09/2026', sourceUrl: aiPage('runwayml'), sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'playstation plus': { planName: 'Essential', amount: 43.90, periodAmounts: { TRIMESTRAL: 114.90, ANUAL: 359.90 }, additionalPlans: [{ planName: 'Extra', amount: 65.90, periodAmounts: { TRIMESTRAL: 186.90, ANUAL: 592.90 } }, { planName: 'Deluxe', amount: 76.90, periodAmounts: { TRIMESTRAL: 219.90, ANUAL: 691.90 } }], checkedAt: '11/10/2026', sourceUrl: 'https://blog.br.playstation.com/2025/04/09/novidades-de-abril-para-o-catalogo-de-jogos-playstation-plus-hogwarts-legacy-blue-prince-lost-records-bloom-rage-tape-2-e-mais/', sourceLabel: 'PlayStation Blog Brasil', note: 'Tarifas publicadas para novas assinaturas em 2025; assinantes antigos podem ter valores diferentes. Confira a oferta na sua conta.' },
  'xbox game pass': { planName: 'Plano mensal listado', amount: 59.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'discord nitro': { planName: 'Plano mensal listado', amount: 24.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry', note: 'Preço observado na App Store.' },
  'nordvpn': { planName: 'Plano mensal listado', amount: 19.90, checkedAt: '06/10/2026', sourceUrl: brazilPricesPage, sourceLabel: 'PriceByCountry' },
  'audible': { planName: 'Plano mensal', amount: 19.90, checkedAt: '11/10/2026', sourceUrl: 'https://www.audible.com.br/ep/beneficios-audible', sourceLabel: 'Audible Brasil' },
  'twitch': { planName: 'Turbo', amount: 26.99, checkedAt: '11/10/2026', sourceUrl: 'https://help.twitch.tv/s/article/turbo-pricing-by-country?language=en_US', sourceLabel: 'Ajuda Twitch', note: 'A Twitch publica apenas a cobrança mensal do Turbo.' },
  'twitch turbo': { planName: 'Turbo', amount: 26.99, checkedAt: '11/10/2026', sourceUrl: 'https://help.twitch.tv/s/article/turbo-pricing-by-country?language=en_US', sourceLabel: 'Ajuda Twitch', note: 'A Twitch publica apenas a cobrança mensal do Turbo.' },
  'nintendo switch online': { planName: 'Individual', amount: 21.90, periodAmounts: { TRIMESTRAL: 44.90, ANUAL: 109.90 }, additionalPlans: [{ planName: 'Pacote adicional individual (anual)', amount: 279.90, amountPeriod: 'ANUAL' }, { planName: 'Familiar (anual)', amount: 194.90, amountPeriod: 'ANUAL' }, { planName: 'Familiar + pacote adicional (anual)', amount: 439.90, amountPeriod: 'ANUAL' }], checkedAt: '11/10/2026', sourceUrl: 'https://ec.nintendo.com/BR/pt/membership', sourceLabel: 'Nintendo eShop Brasil', note: 'Os planos familiares e Pacote adicional são anuais; confirme a disponibilidade e a duração na eShop.' },
  'kindle unlimited': { planName: 'Plano mensal', amount: 24.90, checkedAt: '11/10/2026', sourceUrl: 'https://fastcompanybrasil.com/tech/o-que-e-kindle-unlimited-e-quanto-custa-no-brasil-em-2026/', sourceLabel: 'Fast Company Brasil', note: 'Preço mensal encontrado; não localizei uma tarifa anual recorrente confirmada.' },
  'duolingo super': { planName: 'Super individual', amount: 31.90, periodAmounts: { ANUAL: 179.90 }, checkedAt: '11/10/2026', sourceUrl: 'https://apps.apple.com/br/app/duolingo-aprenda-idiomas/id570060128', sourceLabel: 'App Store', note: 'Preço listado na App Store; ofertas e valores podem variar por plataforma e conta.' },
  'figma': { planName: 'Professional Full seat', amount: 20, periodAmounts: { ANUAL: 192 }, currency: 'USD', checkedAt: '11/10/2026', sourceUrl: 'https://www.figma.com/pt-br/pricing/', sourceLabel: 'Figma', note: 'Preço em USD por editor/mês: US$ 20 no mensal ou US$ 16/mês no anual (US$ 192 cobrados por ano). Não convertido para reais.' },
  'pcloud': { planName: 'Premium 500 GB', amount: 59.88, amountPeriod: 'ANUAL', periodAmounts: { ANUAL: 59.88 }, currency: 'USD', additionalPlans: [{ planName: 'Premium Plus 2 TB', amount: 119.88, amountPeriod: 'ANUAL', periodAmounts: { ANUAL: 119.88 } }, { planName: 'Ultra 10 TB', amount: 359.88, amountPeriod: 'ANUAL', periodAmounts: { ANUAL: 359.88 } }], checkedAt: '11/10/2026', sourceUrl: 'https://www.pcloud.com/pt/cloud-storage-pricing-plans.html?discount=Easter&period=year', sourceLabel: 'pCloud', note: 'Referências anuais em USD; o checkout pode mostrar promoções e moeda diferentes. Não convertido para reais.' },
  'midjourney': { planName: 'Basic', amount: 10, currency: 'USD', periodAmounts: { ANUAL: 96 }, additionalPlans: [{ planName: 'Standard', amount: 30, currency: 'USD', periodAmounts: { ANUAL: 288 } }, { planName: 'Pro', amount: 60, currency: 'USD', periodAmounts: { ANUAL: 576 } }, { planName: 'Mega', amount: 120, currency: 'USD', periodAmounts: { ANUAL: 1152 } }], checkedAt: '11/10/2026', sourceUrl: 'https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans', sourceLabel: 'Midjourney', note: 'Preços em USD: anual pago à vista com desconto de 20%. Não convertido para reais.' },
  '1password': { planName: 'Individual', amount: 3.99, currency: 'USD', periodAmounts: { ANUAL: 35.88 }, additionalPlans: [{ planName: 'Família', amount: 5.99, currency: 'USD', periodAmounts: { ANUAL: 53.88 } }], checkedAt: '11/10/2026', sourceUrl: 'https://1password.com/pt/pricing', sourceLabel: '1Password', note: 'Preço da página em USD; valores anuais correspondem ao total cobrado pelo ano. Não convertido para reais.' },
  'deepseek': { planName: 'Chat gratuito', amount: 0, checkedAt: '11/10/2026', sourceUrl: 'https://www.deepseek.com/', sourceLabel: 'DeepSeek', note: 'O chat de consumidor é gratuito. A API é cobrada por tokens consumidos, sem assinatura mensal fixa; por isso não há preço recorrente para aplicar.' },
  'ea play': { planName: 'EA Play anual', amount: 209, amountPeriod: 'ANUAL', periodAmounts: { ANUAL: 209 }, checkedAt: '11/10/2026', sourceUrl: 'https://www.xbox.com/pt-br/games/store/ea-play/cfq7ttc0k5dh/0004?activetab=pivot%3Aoverviewtab', sourceLabel: 'Xbox Brasil', note: 'Preço anual. A estimativa mensal proporcional não representa uma opção mensal de cobrança.' },
  'revolut': { planName: 'Plus', amount: 9.99, additionalPlans: [{ planName: 'Premium', amount: 19.99, periodAmounts: { ANUAL: 199.90 } }, { planName: 'Metal', amount: 79.99 }, { planName: 'Ultra', amount: 249.99 }], checkedAt: '11/10/2026', sourceUrl: 'https://www.revolut.com/pt-BR/cards/', sourceLabel: 'Revolut Brasil', note: 'Premium custa R$ 19,99/mês ou R$ 199,90/ano. Os demais preços listados são mensais; confirme elegibilidade e valor no app.' },
}

export function getManualServicePrice(serviceName: string) {
  return manualServicePrices[serviceName.trim().toLocaleLowerCase('pt-BR')]
}
