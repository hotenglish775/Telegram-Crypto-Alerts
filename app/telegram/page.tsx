'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle, XCircle, Send, Copy, ExternalLink } from 'lucide-react'
import { DashboardLayout } from '../components/layout/dashboard-layout'
import { LoadingSpinner } from '../components/ui/loading'
import toast from 'react-hot-toast'

interface TelegramStatus {
  connected: boolean
  chatId?: string
  groupName?: string
  lastTestSent?: string
}

export default function TelegramPage() {
  const [status, setStatus] = useState<TelegramStatus>({ connected: false })
  const [loading, setLoading] = useState(true)
  const [chatId, setChatId] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [testing, setTesting] = useState(false)

  const BOT_USERNAME = '@CryptoAlertsBot' // This would come from your backend

  useEffect(() => {
    // Simulate API call to check Telegram status
    setTimeout(() => {
      setStatus({
        connected: true,
        chatId: '123456789',
        groupName: 'My Trading Group',
        lastTestSent: '2024-01-21T10:30:00Z'
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleConnect = async () => {
    if (!chatId.trim()) {
      toast.error('Please enter a chat ID')
      return
    }

    setConnecting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus({
        connected: true,
        chatId: chatId.trim(),
        groupName: 'Connected Chat'
      })
      toast.success('Telegram connected successfully!')
    } catch (error) {
      toast.error('Failed to connect to Telegram')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Telegram?')) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus({ connected: false })
      setChatId('')
      toast.success('Telegram disconnected')
    } catch (error) {
      toast.error('Failed to disconnect Telegram')
    }
  }

  const handleTestAlert = async () => {
    setTesting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus(prev => ({
        ...prev,
        lastTestSent: new Date().toISOString()
      }))
      toast.success('Test alert sent successfully!')
    } catch (error) {
      toast.error('Failed to send test alert')
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
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
            Telegram Setup
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect your Telegram account to receive real-time crypto alerts
          </p>
        </div>

        {/* Connection Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connection Status
            </h2>
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {status.connected ? (
              <CheckCircle className="h-8 w-8 text-success-500" />
            ) : (
              <XCircle className="h-8 w-8 text-danger-500" />
            )}
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {status.connected ? 'Connected' : 'Not Connected'}
              </p>
              {status.connected && status.groupName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connected to: {status.groupName}
                </p>
              )}
              {status.connected && status.chatId && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chat ID: {status.chatId}
                </p>
              )}
            </div>
          </div>

          {status.connected ? (
            <div className="flex space-x-4">
              <button
                onClick={handleTestAlert}
                disabled={testing}
                className="btn-primary flex items-center space-x-2"
              >
                {testing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Send Test Alert</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="btn-danger"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="label">
                  Chat ID or Group ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter your Telegram chat ID"
                  />
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {connecting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {status.lastTestSent && (
            <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <p className="text-sm text-success-700 dark:text-success-300">
                Last test alert sent: {new Date(status.lastTestSent).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Setup Instructions
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Start a chat with our bot
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Open Telegram and search for our bot, then start a conversation.
                </p>
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    {BOT_USERNAME}
                  </code>
                  <button
                    onClick={() => copyToClipboard(BOT_USERNAME)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={`https://t.me/${BOT_USERNAME.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Get your Chat ID
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Send <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">/start</code> to the bot, 
                  and it will reply with your Chat ID.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For groups: Add the bot to your group and use <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">/chatid</code>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Enter your Chat ID above
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Copy the Chat ID from the bot and paste it in the input field above, then click Connect.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Telegram Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Instant Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive alerts immediately when your conditions are met
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Rich Formatting
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alerts include charts, prices, and direct links to exchanges
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Group Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share alerts with your trading team or community
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  No Spam
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart cooldowns prevent alert spam and noise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}