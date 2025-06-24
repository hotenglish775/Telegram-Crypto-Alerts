'use client'

import { useState, useEffect } from 'react'
import { User, Bell, Shield, Trash2, Save } from 'lucide-react'
import { DashboardLayout } from '../components/layout/dashboard-layout'
import { LoadingSpinner } from '../components/ui/loading'
import { useAuth } from '../providers'
import toast from 'react-hot-toast'

interface UserSettings {
  email: string
  notifications: {
    email: boolean
    telegram: boolean
    webhook: boolean
  }
  preferences: {
    timezone: string
    dateFormat: string
    theme: string
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    notifications: {
      email: true,
      telegram: true,
      webhook: false
    },
    preferences: {
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      theme: 'system'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.email || ''
      }))
    }
    setLoading(false)
  }, [user])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to update password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your alerts and data. Are you absolutely sure?')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Account deleted successfully')
      // In a real app, this would sign out the user and redirect
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
                disabled
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Contact support to change your email address
              </p>
            </div>

            <div>
              <label className="label">
                Timezone
              </label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, timezone: e.target.value }
                }))}
                className="input-field"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <div>
              <label className="label">
                Date Format
              </label>
              <select
                value={settings.preferences.dateFormat}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, dateFormat: e.target.value }
                }))}
                className="input-field"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Email notifications
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.telegram}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, telegram: e.target.checked }
                }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Telegram notifications
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.webhook}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, webhook: e.target.checked }
                }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Webhook notifications
              </span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={!newPassword || !confirmPassword}
                  className="btn-primary"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Settings</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="card border-danger-200 dark:border-danger-800">
          <div className="flex items-center space-x-3 mb-6">
            <Trash2 className="h-6 w-6 text-danger-500" />
            <h2 className="text-xl font-semibold text-danger-600 dark:text-danger-400">
              Danger Zone
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="btn-danger"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}