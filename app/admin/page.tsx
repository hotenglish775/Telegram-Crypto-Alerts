'use client'

import { useState, useEffect } from 'react'
import { Users, Bell, TrendingUp, DollarSign, Activity, AlertTriangle } from 'lucide-react'
import { DashboardLayout } from '../components/layout/dashboard-layout'
import { StatsCard } from '../components/dashboard/stats-card'
import { LoadingSpinner } from '../components/ui/loading'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface AdminStats {
  totalUsers: number
  totalAlerts: number
  dailyTriggers: number
  monthlyRevenue: number
  activeUsers: number
  systemHealth: number
}

const mockChartData = [
  { name: 'Jan', users: 120, alerts: 450, revenue: 2400 },
  { name: 'Feb', users: 150, alerts: 520, revenue: 2800 },
  { name: 'Mar', users: 180, alerts: 680, revenue: 3200 },
  { name: 'Apr', users: 220, alerts: 750, revenue: 3800 },
  { name: 'May', users: 280, alerts: 920, revenue: 4500 },
  { name: 'Jun', users: 320, alerts: 1100, revenue: 5200 },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAlerts: 0,
    dailyTriggers: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    systemHealth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalAlerts: 5680,
        dailyTriggers: 342,
        monthlyRevenue: 15420,
        activeUsers: 892,
        systemHealth: 99.2
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            System overview and key metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12% this month"
            changeType="positive"
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            change="71% of total"
            changeType="neutral"
            icon={Activity}
            loading={loading}
          />
          <StatsCard
            title="Total Alerts"
            value={stats.totalAlerts.toLocaleString()}
            change="+8% this week"
            changeType="positive"
            icon={Bell}
            loading={loading}
          />
          <StatsCard
            title="Daily Triggers"
            value={stats.dailyTriggers.toLocaleString()}
            change="+15% from yesterday"
            changeType="positive"
            icon={TrendingUp}
            loading={loading}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            change="+23% from last month"
            changeType="positive"
            icon={DollarSign}
            loading={loading}
          />
          <StatsCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            change="All systems operational"
            changeType="positive"
            icon={AlertTriangle}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              User Growth
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Monthly Revenue
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Users
            </h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { email: 'john.doe@example.com', plan: 'Trader', joined: '2 hours ago' },
                  { email: 'jane.smith@example.com', plan: 'Pro', joined: '4 hours ago' },
                  { email: 'mike.wilson@example.com', plan: 'Free', joined: '6 hours ago' },
                  { email: 'sarah.johnson@example.com', plan: 'Trader', joined: '8 hours ago' },
                  { email: 'david.brown@example.com', plan: 'Business', joined: '1 day ago' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.plan} Plan • {user.joined}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              System Status
            </h3>
            <div className="space-y-4">
              {[
                { service: 'API Server', status: 'operational', uptime: '99.9%' },
                { service: 'Database', status: 'operational', uptime: '99.8%' },
                { service: 'Telegram Bot', status: 'operational', uptime: '99.7%' },
                { service: 'Alert Engine', status: 'operational', uptime: '99.9%' },
                { service: 'Payment System', status: 'operational', uptime: '99.6%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.service}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                      {item.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.uptime} uptime
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}