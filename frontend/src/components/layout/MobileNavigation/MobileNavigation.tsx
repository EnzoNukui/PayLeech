import { NavLink } from 'react-router-dom'
import { applicationNavigation } from '../../../routes/applicationNavigation'
import LogoutButton from '../LogoutButton/LogoutButton'

function MobileNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {applicationNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            end={end}
            to={to}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon aria-hidden="true" size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <LogoutButton variant="mobile" />
      </div>
    </nav>
  )
}

export default MobileNavigation
