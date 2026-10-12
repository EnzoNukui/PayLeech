import { serviceIconColors } from './serviceIconColors'

const serviceIconByName: Record<string, string> = {
  'adobe creative cloud': 'adobecreativecloud', adobe: 'adobe', 'apple music': 'applemusic',
  'apple tv': 'appletv', 'apple tv+': 'appletv', crunchyroll: 'crunchyroll',
  'disney plus': 'streamline-logos:disney-plus-logo',
  'disney+': 'streamline-logos:disney-plus-logo', 'google one': 'ion:logo-google', google: 'ion:logo-google',
  'hbo max': 'streamline-logos:hbo-max-logo', max: 'streamline-logos:hbo-max-logo',
  'youtube premium': 'youtube', youtube: 'youtube', 'youtube music': 'youtubemusic',
  netflix: 'netflix', spotify: 'spotify',
  icloud: 'icloud', 'icloud+': 'icloud', 'prime video': 'primevideo', primevideo: 'primevideo',
  dropbox: 'dropbox', twitch: 'twitch', deezer: 'deezer', canva: 'canva', 'canva pro': 'canva',
  tidal: 'tidal', mubi: 'mubi', 'paramount+': 'paramountplus', globoplay: 'globoplay',
  'microsoft 365': 'microsoft365', 'office 365': 'microsoft365',
  'microsoft office': 'microsoft365', playstation: 'playstation', xbox: 'xbox',
  'playstation plus': 'playstation', 'xbox game pass': 'xbox', 'nintendo switch online': 'nintendoswitch',
  'ea play': 'ea', 'discord nitro': 'discord',
  notion: 'notion', 'notion plus': 'notion', todoist: 'todoist', 'todoist pro': 'todoist',
  evernote: 'evernote', 'evernote personal': 'evernote', figma: 'figma', zoom: 'zoom', 'zoom pro': 'zoom',
  linkedin: 'linkedin', 'linkedin premium': 'linkedin', grammarly: 'grammarly', 'grammarly premium': 'grammarly',
  'google workspace': 'googleworkspace', onedrive: 'onedrive', pcloud: 'pcloud',
  revolut: 'revolut',
  chatgpt: 'openai', 'chat gpt': 'openai', 'chatgpt plus': 'openai', openai: 'openai',
  'chatgpt pro': 'openai',
  claude: 'claude', 'claude pro': 'claude', gemini: 'googlegemini', 'gemini advanced': 'googlegemini',
  'google gemini': 'googlegemini', perplexity: 'perplexity', 'perplexity pro': 'perplexity',
  deepseek: 'deepseek', 'github copilot': 'githubcopilot',
  'microsoft copilot': 'microsoft', 'copilot pro': 'microsoft',
  midjourney: 'midjourney', cursor: 'cursor', 'cursor pro': 'cursor', runway: 'runway',
  'kindle unlimited': 'amazonkindle', audible: 'audible', duolingo: 'duolingo', 'duolingo super': 'duolingo',
  '1password': '1password', nordvpn: 'nordvpn',
}

function normalizeServiceName(name: string) {
  return name.toLocaleLowerCase('pt-BR').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function knownServiceIcon(name: string) {
  const iconName = serviceIconByName[normalizeServiceName(name)]
  if (!iconName) return ''
  return iconName.includes(':') ? iconName : `simple-icons:${iconName}`
}

export function colorForServiceIcon(icon: string) {
  const [prefix, name] = icon.split(':')
  if (prefix !== 'simple-icons') return undefined
  return serviceIconColors[name] ?? '765548'
}
