"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      onSuccess?.()
    } catch (error) {
      // Add specific error handling for network issues
      if (error instanceof Error) {
        if (error.message.includes("Network error") || error.message.includes("Failed to fetch")) {
          setErrors({
            ...errors,
            form: "Unable to connect to the server. Please check your internet connection and try again.",
          })
        } else if (error.message.includes("timed out")) {
          setErrors({
            ...errors,
            form: "The server is taking too long to respond. Please try again later.",
          })
        } else {
          setErrors({
            ...errors,
            form: error.message,
          })
        }
      } else {
        setErrors({
          ...errors,
          form: "An unexpected error occurred. Please try again.",
        })
      }
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300">Join us to create amazing travel invites</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-900 dark:text-white font-semibold">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="h-12 pl-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl"
                disabled={isLoading}
              />
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-900 dark:text-white font-semibold">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="h-12 pl-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl"
                disabled={isLoading}
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-900 dark:text-white font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
                className="h-12 pl-12 pr-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl"
                disabled={isLoading}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-white font-semibold">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className="h-12 pl-12 pr-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl"
                disabled={isLoading}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {errors.form}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={onSwitchToLogin}
                className="p-0 h-auto font-semibold text-green-600 dark:text-purple-400 hover:text-green-700 dark:hover:text-purple-300"
              >
                Sign in
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
