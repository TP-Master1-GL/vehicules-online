// src/routes/AppRouter.jsx
import React, { Suspense, lazy } from 'react'
import { 
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate 
} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

// Lazy loading des pages
const Home = lazy(() => import('../pages/Home'))
const Catalog = lazy(() => import('../pages/Catalog'))
const VehicleDetail = lazy(() => import('../pages/VehicleDetail'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Fleet = lazy(() => import('../pages/Fleet'))
const FleetDashboard = lazy(() => import('../pages/FleetDashboard'))
const Contact = lazy(() => import('../pages/Contact'))
const Documents = lazy(() => import('../pages/Documents'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const About = lazy(() => import('../pages/About'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Protected route wrapper component
const ProtectedRoute = ({ children, requireCompany = false }) => {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requireCompany && user?.customerType !== 'company' && user?.customerType !== 'professional') {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Main Layout component
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
)

// Routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'catalogue',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Catalog />
          </Suspense>
        )
      },
      {
        path: 'vehicule/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <VehicleDetail />
          </Suspense>
        )
      },
      {
        path: 'achat-flotte',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Fleet />
          </Suspense>
        )
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        )
      },
      {
        path: 'a-propos',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        )
      },
      {
        path: 'panier',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'entreprise/dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute requireCompany>
              <FleetDashboard />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'documents',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Register />
      </Suspense>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true
  }
})

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter