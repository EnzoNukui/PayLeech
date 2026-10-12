import { FiBarChart2, FiHome, FiRepeat } from 'react-icons/fi'

export const applicationPaths = ['/resumo', '/assinaturas', '/gastos'] as const

export const applicationNavigation = [
  { to: '/resumo', label: 'Visão geral', icon: FiHome, end: true },
  { to: '/assinaturas', label: 'Assinaturas', icon: FiRepeat, end: false },
  { to: '/gastos', label: 'Gastos', icon: FiBarChart2, end: false },
] as const

export function isApplicationPath(pathname: string) {
  return applicationPaths.includes(pathname as (typeof applicationPaths)[number])
}
