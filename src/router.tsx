import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

// Layouts
import HomeLayout from '@/layouts/HomeLayout'
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'))
const ProfileLayout = lazy(() => import('@/layouts/ProfileLayout'))
const CreateProjectLayout = lazy(() => import('@/layouts/CreateProjectLayout'))
const NotificationsLayout = lazy(() => import('@/layouts/NotificationsLayout'))
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const AppLayout = lazy(() => import('@/layouts/AppLayout'))

// Pages
import HomePage from '@/pages/HomePage'
const ContactUsPage = lazy(() => import('@/pages/ContactUsPage'))
const RequestDemoPage = lazy(() => import('@/pages/RequestDemoPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/policies/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/policies/TermsPage'))
const CancelAndRefundPage = lazy(() => import('@/pages/policies/CancelAndRefundPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const CreateProjectPage = lazy(() => import('@/pages/CreateProjectPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const AdminUsersListPage = lazy(() => import('@/pages/AdminUsersListPage'))
const AdminUserDetailPage = lazy(() => import('@/pages/AdminUserDetailPage'))
const AdminJobHistoryPage = lazy(() => import('@/pages/AdminJobHistoryPage'))
const AdminProjectDetailPage = lazy(() => import('@/pages/AdminProjectDetailPage'))
const ProjectsBreakdownPage = lazy(() => import('@/pages/ProjectsBreakdownPage'))
const AdminLLMCostsPage = lazy(() => import('@/pages/AdminLLMCostsPage'))
const AdminCreateJobRunPage = lazy(() => import('@/pages/AdminCreateJobRunPage'))
const VerifyEmailPage = lazy(() => import('@/pages/verify-email/VerifyEmailPage'))
const VerifyEmailPromptPage = lazy(() => import('@/pages/verify-email-prompt/VerifyEmailPromptPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password/ResetPasswordPage'))
const AuthPricingPage = lazy(() => import('@/pages/AuthPricingPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))

// App Views (New Route-Based Navigation)
const DashboardView = lazy(() => import('@/pages/app/DashboardView'))
const LeadsView = lazy(() => import('@/pages/app/LeadsView'))
const OpportunitiesView = lazy(() => import('@/pages/app/OpportunitiesView'))
const SettingsView = lazy(() => import('@/pages/app/SettingsView'))
const GuideView = lazy(() => import('@/pages/app/GuideView'))
import ProjectRouteGuard from '@/components/app/ProjectRouteGuard'
import DashboardRedirect from '@/components/DashboardRedirect'
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
import ProjectProviderWrapper from '@/components/ProjectProviderWrapper'

export default function AppRouter() {
  const location = useLocation()
  const canonicalRoot = 'https://www.userixly.com'

  const setRobotsMeta = (value: string) => {
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta")
      robotsMeta.setAttribute("name", "robots")
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.setAttribute("content", value)
  }

  const setCanonicalLink = (href: string) => {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', href)
  }

  const setMetaByName = (name: string, value: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', value)
  }

  const setMetaByProperty = (property: string, value: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', value)
  }

  // Set default page title and route-level indexing hints
  useEffect(() => {
    document.title = 'Rixly finds warm leads across platforms and turns them into sales.'

    const noIndexPrefixes = ["/login", "/forgot-password", "/reset-password", "/verify-email", "/verify-email-prompt", "/app", "/admin"]
    const shouldNoIndex = noIndexPrefixes.some((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`))
    const publicCanonical = `${canonicalRoot}${location.pathname === '/' ? '/' : location.pathname}`
    const canonical = shouldNoIndex ? `${canonicalRoot}/` : publicCanonical

    setRobotsMeta(shouldNoIndex ? "noindex, nofollow" : "index, follow")
    setCanonicalLink(canonical)
    setMetaByProperty('og:url', canonical)
    setMetaByName('twitter:url', canonical)
  }, [location.pathname])

  return (
    <Suspense fallback={null}>
      <Routes>
        {/* New Landing Route (exact RixlyNew landing implementation) */}
        <Route path="/" element={<HomePage />} />

        {/* Public Routes with Home Layout */}
        <Route element={<HomeLayout />}>
          <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
          <Route path="/contactus" element={<ContactUsPage />} />
          <Route path="/request-demo" element={<RequestDemoPage />} />
          <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/policies/terms" element={<TermsPage />} />
          <Route
            path="/policies/cancelandrefund"
            element={<CancelAndRefundPage />}
          />
        </Route>

        {/* Landing-compatible legacy aliases */}
        <Route path="/privacy" element={<Navigate to="/policies/privacy" replace />} />
        <Route path="/terms" element={<Navigate to="/policies/terms" replace />} />
        <Route path="/cancelandrefund" element={<Navigate to="/policies/cancelandrefund" replace />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Verify Email Routes (no layout) */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email-prompt" element={<VerifyEmailPromptPage />} />

        {/* Password Reset Routes (no layout) */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Auth Pricing Route */}
        <Route path="/auth-pricing" element={<AuthPricingPage />} />

        {/* Dashboard Routes - OLD (Backward Compatibility) */}
        {/* Redirect old /dashboard to new /app/:projectId/dashboard structure */}
        <Route path="/dashboard" element={<ProjectProviderWrapper><DashboardRedirect /></ProjectProviderWrapper>} />

        {/* App Routes - NEW (Route-Based Navigation) */}
        {/* Redirect /app to appropriate location */}
        <Route path="/app" element={<ProjectProviderWrapper><DashboardRedirect /></ProjectProviderWrapper>} />

        {/* Onboarding (redirects to dashboard if user has projects) */}
        <Route path="/app/onboarding" element={<ProjectProviderWrapper><OnboardingPage /></ProjectProviderWrapper>} />

        {/* App routes with project guard */}
        <Route element={<ProjectProviderWrapper><ProjectRouteGuard><AppLayout /></ProjectRouteGuard></ProjectProviderWrapper>}>
          <Route path="/app/:projectId/dashboard" element={<DashboardView />} />
          <Route path="/app/:projectId/leads" element={<LeadsView />} />
          <Route path="/app/:projectId/opportunities" element={<OpportunitiesView />} />
          <Route path="/app/:projectId/settings" element={<SettingsView />} />
          <Route path="/app/:projectId/playbook" element={<GuideView />} />
          {/* Redirect /app/:projectId to /app/:projectId/dashboard */}
          <Route path="/app/:projectId" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Profile Routes */}
        <Route element={<ProfileLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Create Project Routes */}
        <Route element={<ProjectProviderWrapper><CreateProjectLayout /></ProjectProviderWrapper>}>
          <Route path="/create-project" element={<CreateProjectPage />} />
        </Route>

        {/* Notifications Routes */}
        <Route element={<ProjectProviderWrapper><NotificationsLayout /></ProjectProviderWrapper>}>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersListPage />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetailPage />} />
          <Route path="/admin/users/:userId/projects/:projectId" element={<AdminProjectDetailPage />} />
          <Route path="/admin/jobs" element={<AdminJobHistoryPage />} />
          <Route path="/admin/projects-breakdown" element={<ProjectsBreakdownPage />} />
          <Route path="/admin/llm-costs" element={<AdminLLMCostsPage />} />
          <Route path="/admin/job-runs/new" element={<AdminCreateJobRunPage />} />
        </Route>

        {/* 404 - Catch all */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg text-neutral-600">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  )
}
