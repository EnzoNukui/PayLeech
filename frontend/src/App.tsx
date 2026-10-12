import { MotionConfig, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import LandingFooter from './components/landing/LandingFooter/LandingFooter'
import LandingHeader from './components/landing/LandingHeader/LandingHeader'
import AppRoutes from './routes/AppRoutes'
import AuthHeader from './components/auth/AuthHeader/AuthHeader'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { isApplicationPath } from './routes/applicationNavigation'

function AppLayout() {
  const { pathname } = useLocation()
  const isLandingPage = pathname === '/'
  const { usuario } = useAuth()
  const isApplicationPage = isApplicationPath(pathname) && Boolean(usuario)
  const isAuthPage = pathname === '/login' || pathname === '/cadastro'
  const scrollYProgress = useMotionValue(0)

  useEffect(() => {
    function updateScrollProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      scrollYProgress.set(Math.min(1, Math.max(0, progress)))
    }

    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)

    const pageObserver = new ResizeObserver(updateScrollProgress)
    pageObserver.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
      pageObserver.disconnect()
    }
  }, [scrollYProgress])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const landingBackground = useTransform(
    scrollYProgress,
    [0, 0.15, 0.21, 0.39, 0.5, 1],
    ['#493527', '#80634b', '#80634b', '#f7f4ef', '#f7f4ef', '#f7f4ef'],
  )

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col bg-canvas"
      style={{ backgroundColor: isLandingPage ? landingBackground : 'var(--color-canvas)' }}
    >
      {isLandingPage && <LandingHeader />}
      {isApplicationPage && <Header />}
      {isAuthPage && <AuthHeader variant="split" />}
      <main className={`flex-1 ${isApplicationPage ? 'pb-24 lg:ml-64 lg:pb-0' : ''} ${isAuthPage ? 'flex flex-col' : ''}`}>
        <AppRoutes />
      </main>
      {isLandingPage && <LandingFooter />}
      {isApplicationPage && <Footer />}
    </motion.div>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
