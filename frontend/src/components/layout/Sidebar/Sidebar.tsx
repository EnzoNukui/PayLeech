import { NavLink } from 'react-router-dom'
import { applicationNavigation } from '../../../routes/applicationNavigation'
import LogoutButton from '../LogoutButton/LogoutButton'

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface px-5 py-7 lg:flex">
      <NavLink aria-label="PayLeech, visão geral" className="mb-12 flex items-center px-1" to="/resumo">
        <img alt="PayLeech" className="h-11 w-auto" src="/brand/payleech-horizontal.svg" />
      </NavLink>

      <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
        {applicationNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            end={end}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-control px-3.5 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
              }`
            }
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-card bg-surface-muted p-2">
        <LogoutButton />
      </div>
    </aside>
  )
}

export default Sidebar
