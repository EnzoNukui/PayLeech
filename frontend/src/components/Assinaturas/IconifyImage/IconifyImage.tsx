import { useState } from 'react'

const iconifyHosts = [
  'https://api.iconify.design',
  'https://api.simplesvg.com',
  'https://api.unisvg.com',
]

interface IconifyImageProps {
  icon: string
  color?: string
  className?: string
  onUnavailable?: () => void
}

function IconifyImage({ icon, color, className = '', onUnavailable }: IconifyImageProps) {
  const [sourceState, setSourceState] = useState({ icon, hostIndex: 0, failed: false })
  const isCurrentIcon = sourceState.icon === icon
  const hostIndex = isCurrentIcon ? sourceState.hostIndex : 0
  const failed = isCurrentIcon && sourceState.failed
  const [prefix, name] = icon.split(':')
  const colorQuery = color ? `?color=%23${color}` : ''
  const src = `${iconifyHosts[hostIndex]}/${prefix}/${name}.svg${colorQuery}`

  if (failed || !prefix || !name) return null

  return (
    <img
      alt=""
      className={className}
      loading="lazy"
      onError={() => {
        if (hostIndex < iconifyHosts.length - 1) setSourceState({ icon, hostIndex: hostIndex + 1, failed: false })
        else {
          setSourceState({ icon, hostIndex, failed: true })
          onUnavailable?.()
        }
      }}
      src={src}
    />
  )
}

export default IconifyImage
