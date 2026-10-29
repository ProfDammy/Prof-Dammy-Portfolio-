import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AdminLoginPage from './login/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('AdminLoginPage', () => {
  it('renders login form with title and inputs', () => {
    render(<AdminLoginPage />)
    expect(screen.getByText('Admin CMS Portal')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('admin@profdammy.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('handles valid authentication submission', async () => {
    render(<AdminLoginPage />)
    const emailInput = screen.getByPlaceholderText('admin@profdammy.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /sign in to dashboard/i })

    fireEvent.change(emailInput, { target: { value: 'admin@profdammy.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/authorization granted/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
