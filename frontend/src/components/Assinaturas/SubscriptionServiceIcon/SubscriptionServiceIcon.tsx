import { useState } from 'react'
import { colorForServiceIcon, knownServiceIcon } from '../../../data/serviceIcons'
import IconifyImage from '../IconifyImage/IconifyImage'

function getIconReference(name: string, icon?: string | null) {
  if (icon?.startsWith('simple-icons:')) return icon
  return knownServiceIcon(name) || undefined
}

interface SubscriptionServiceIconProps {
  name: string
  icon?: string | null
  size?: 'regular' | 'compact'
}

function SubscriptionServiceIcon({ name, icon, size = 'regular' }: SubscriptionServiceIconProps) {
  const [failedIconUrl, setFailedIconUrl] = useState('')
  const iconReference = getIconReference(name, icon)
  const iconFailed = Boolean(iconReference && failedIconUrl === iconReference)
  const compact = size === 'compact'

  return (
    <span aria-hidden="true" className={`relative grid shrink-0 place-items-center overflow-hidden border border-border bg-surface-raised font-semibold text-accent ${compact ? 'size-9 rounded-xl text-sm' : 'size-12 rounded-2xl text-lg shadow-sm'}`}>
      {(!iconReference || iconFailed) && <span>{name.trim().charAt(0).toLocaleUpperCase('pt-BR')}</span>}
      {iconReference && !iconFailed && <IconifyImage
        className={`absolute object-contain ${compact ? 'size-5' : 'size-6'}`}
        color={colorForServiceIcon(iconReference)}
        icon={iconReference}
        onUnavailable={() => setFailedIconUrl(iconReference)}
      />}
    </span>
  )
}

export default SubscriptionServiceIcon

