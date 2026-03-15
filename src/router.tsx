import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

// Layouts
import HomeLayout from '@/layouts/HomeLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProfileLayout from '@/layouts/ProfileLayout'
import CreateProjectLayout from '@/layouts/CreateProjectLayout'
import NotificationsLayout from '@/layouts/NotificationsLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AppLayout from '@/layouts/AppLayout'

// Pages
import HomePage from '@/pages/HomePage'
import PricingPage from '@/pages/PricingPage'
import ContactUsPage from '@/pages/ContactUsPage'
import RequestDemoPage from '@/pages/RequestDemoPage'
import PrivacyPolicyPage from '@/pages/policies/PrivacyPolicyPage'
import TermsPage from '@/pages/policies/TermsPage'
import CancelAndRefundPage from '@/pages/policies/CancelAndRefundPage'
import LoginPage from '@/pages/LoginPage'
import ProfilePage from '@/pages/ProfilePage'
import CreateProjectPage from '@/pages/CreateProjectPage'
import NotificationsPage from '@/pages/NotificationsPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminUsersListPage from '@/pages/AdminUsersListPage'
import AdminUserDetailPage from '@/pages/AdminUserDetailPage'
import AdminJobHistoryPage from '@/pages/AdminJobHistoryPage'
import AdminProjectDetailPage from '@/pages/AdminProjectDetailPage'
import ProjectsBreakdownPage from '@/pages/ProjectsBreakdownPage'
import VerifyEmailPage from '@/pages/verify-email/VerifyEmailPage'
import VerifyEmailPromptPage from '@/pages/verify-email-prompt/VerifyEmailPromptPage'
import ForgotPasswordPage from '@/pages/forgot-password/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/reset-password/ResetPasswordPage'
import AuthPricingPage from '@/pages/AuthPricingPage'
const BlogPage = lazy(() => import('@/pages/BlogPage'))

// App Views (New Route-Based Navigation)
import DashboardView from '@/pages/app/DashboardView'
import LeadsView from '@/pages/app/LeadsView'
import OpportunitiesView from '@/pages/app/OpportunitiesView'
import SettingsView from '@/pages/app/SettingsView'
import ProjectRouteGuard from '@/components/app/ProjectRouteGuard'
import DashboardRedirect from '@/components/DashboardRedirect'
import OnboardingPage from '@/pages/OnboardingPage'

export default function AppRouter() {
  // Set default page title and meta description
  useEffect(() => {
    document.title = 'RIXLY - Reddit Intelligence Platform'
  }, [])

  return (
    <Routes>
        {/* New Landing Route (exact RixlyNew landing implementation) */}
        <Route path="/" element={<HomePage />} />

        {/* Public Routes with Home Layout */}
        <Route element={<HomeLayout />}>
          <Route path="/pricing" element={<PricingPage />} />
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
        <Route path="/blogs" element={<Suspense fallback={null}><BlogPage /></Suspense>} />
        <Route path="/blog/:slug" element={<Suspense fallback={null}><BlogPage /></Suspense>} />

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
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* App Routes - NEW (Route-Based Navigation) */}
        {/* Onboarding (no guard needed - for users with 0 projects) */}
        <Route path="/app/onboarding" element={<OnboardingPage />} />

        {/* App routes with project guard */}
        <Route element={<ProjectRouteGuard><AppLayout /></ProjectRouteGuard>}>
          <Route path="/app/:projectId/dashboard" element={<DashboardView />} />
          <Route path="/app/:projectId/leads" element={<LeadsView />} />
          <Route path="/app/:projectId/opportunities" element={<OpportunitiesView />} />
          <Route path="/app/:projectId/settings" element={<SettingsView />} />
          {/* Redirect /app/:projectId to /app/:projectId/dashboard */}
          <Route path="/app/:projectId" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Profile Routes */}
        <Route element={<ProfileLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Create Project Routes */}
        <Route element={<CreateProjectLayout />}>
          <Route path="/create-project" element={<CreateProjectPage />} />
        </Route>

        {/* Notifications Routes */}
        <Route element={<NotificationsLayout />}>
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
  )
}
