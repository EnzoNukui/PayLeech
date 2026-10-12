import { AnimatePresence } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition/PageTransition'
import Assinaturas from '../pages/Assinaturas'
import Cadastro from '../pages/Cadastro'
import ErrorPage from '../pages/Error'
import Gastos from '../pages/Gastos'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Resumo from '../pages/Resumo'
import { GuestRoute, ProtectedRoute } from '../components/auth/RouteGuards/RouteGuards'

function AppRoutes() {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/cadastro'
  const routes = (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/resumo" element={<PageTransition><Resumo /></PageTransition>} />
        <Route path="/assinaturas" element={<PageTransition><Assinaturas /></PageTransition>} />
        <Route path="/gastos" element={<PageTransition><Gastos /></PageTransition>} />
      </Route>
      <Route path="/404" element={<PageTransition><ErrorPage /></PageTransition>} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  )

  // Login and sign-up should switch immediately; waiting for an exit animation
  // leaves the app background visible between the two full-screen layouts.
  if (isAuthRoute) return routes

  return (
    <AnimatePresence initial={false} mode="wait">
      {routes}
    </AnimatePresence>
  )
}

export default AppRoutes
