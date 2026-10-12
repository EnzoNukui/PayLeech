import type { ReactNode } from 'react'
import AuthShowcase from '../AuthShowcase/AuthShowcase'

interface AuthPageLayoutProps {
  mode: 'login' | 'cadastro'
  activeField?: 'nome' | 'email' | 'senha'
  showcase?: ReactNode
  fullScreen?: boolean
  children: ReactNode
}

function AuthPageLayout({ mode, activeField, showcase, fullScreen = false, children }: AuthPageLayoutProps) {
  if (fullScreen) {
    return (
      <div className="flex min-h-dvh w-full flex-col bg-canvas lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:flex-row">
        <div className="order-1 flex min-h-[630px] w-full flex-col lg:h-full lg:min-h-0 lg:w-[59%] lg:border-r lg:border-[#ddcdbd]">
          {showcase ?? <AuthShowcase activeField={activeField} mode={mode} />}
        </div>
        <div className="order-2 flex w-full flex-1 items-center justify-center bg-canvas px-6 py-12 sm:px-12 lg:h-full lg:min-h-0 lg:w-[41%] lg:flex-none lg:items-start lg:overflow-y-auto lg:px-[clamp(2rem,5.5vw,6rem)] lg:py-10">
          <div className="my-auto w-full max-w-[390px]">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-124px)] w-full max-w-[1600px] flex-1 flex-col gap-5 px-4 py-5 sm:px-7 sm:py-7 lg:flex-row lg:gap-0 lg:px-0 lg:py-0">
      <div className="flex flex-1 items-center justify-center py-5 lg:px-8 lg:py-12 xl:px-14">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
      <div className="lg:my-5 lg:mr-5 lg:flex lg:w-[48%] lg:min-w-[460px] lg:max-w-[700px]">
        {showcase ?? <AuthShowcase activeField={activeField} mode={mode} />}
      </div>
    </div>
  )
}

export default AuthPageLayout
