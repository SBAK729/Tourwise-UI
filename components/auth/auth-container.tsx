"use client"

import { useState } from "react"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

interface AuthContainerProps {
  onAuthSuccess: () => void
}

export default function AuthContainer({ onAuthSuccess }: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true)

  return isLogin ? (
    <LoginForm onLoginSuccess={onAuthSuccess} onToggleForm={() => setIsLogin(false)} />
  ) : (
    <SignupForm onSignupSuccess={onAuthSuccess} onToggleForm={() => setIsLogin(true)} />
  )
}
