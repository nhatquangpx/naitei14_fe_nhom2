import { createBrowserRouter, Outlet } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { RenderHome } from '@/features/home'
import { RegisterPage, ActivatePage, LoginPage } from '@/features/auth'
import { RenderProducts } from '@/features/product-list'
import { RenderProductDetail } from '@/features/product-detail'

const LayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      {
        path: '/',
        element: <RenderHome />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: 'auth/activate',
        element: <ActivatePage />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: '/products',
        element: <RenderProducts />,
      },
      {
        path: '/products/:id',
        element: <RenderProductDetail />,
      },
    ],
  },
])
