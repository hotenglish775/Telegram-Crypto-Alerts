'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, CreditCard, Users, Calendar } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { StatsCard } from '../../components/dashboard/stats-card'
import { LoadingSpinner } from '../../components/ui/loading'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SalesStats {
  totalRevenue: number
  monthlyRevenue: number
  newSubscribers: number
  churnedUsers: number
  averageRevenuePerUser: number
  conversionRate: number
}

const revenueData = [
  { month: 'Jul', revenue: 8400, subscribers: 45 },
  { month: 'Aug', revenue: 9200, subscribers: 52 },
  { month: 'Sep', revenue: 10800, subscribers: 61 },
  { month: 'Oct', revenue: 12400, subscribers: 68 },
  { month: 'Nov', revenue: 14200, subscribers: 78 },
  { month: 'Dec', revenue: 15400, subscribers: 85 },
]

const planDistribution = [
  { name: 'Free', value: 45, color: '#6b7280' },
  { name: 'Trader', value: 35, color: '#3b82f6' },
  { name: 'Pro', value: 15, color: '#8b5cf6' },
  { name: 'Business', value: 5, color: '#6366f1' },
]

export default function AdminSalesPage() {
  const [stats, setStats] = useState<SalesStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    newSubscribers: 0,
    churnedUsers: 0,
    averageRevenuePerUser: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRevenue: 156420,
        monthlyRevenue: 15400,
        newSubscribers: 23,
        churnedUsers: 5,
        averageRevenuePerUser: 42.50,
        conversionRate: 12.8
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sales & Revenue
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track revenue, subscriptions, and financial metrics
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input-field"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+18% from last month"
            changeType="positive"
            icon={DollarSign}
            loading={loading}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            change="+8.5% from last month"
            changeType="positive"
            icon={TrendingUp}
            loading={loading}
          />
          <StatsCard
            title="New Subscribers"
            value={stats.newSubscribers}
            change="+12% this month"
            changeType="positive"
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Churned Users"
            value={stats.churnedUsers}
            change="-2 from last month"
            changeType="positive"
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="ARPU"
            value={`$${stats.averageRevenuePerUser}`}
            change="+5.2% from last month"
            changeType="positive"
            icon={CreditCard}
            loading={loading}
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change="+1.2% from last month"
            changeType="positive"
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Revenue Trend
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Plan Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Plan Distribution
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Users']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="ml-8 space-y-2">
                  {planDistribution.map((plan, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: plan.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.name}: {plan.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Transactions
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
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { email: 'john.doe@example.com', plan: 'Trader', amount: 19, date: '2024-01-21', status: 'completed' },
                    { email: 'jane.smith@example.com', plan: 'Pro', amount: 49, date: '2024-01-21', status: 'completed' },
                    { email: 'mike.wilson@example.com', plan: 'Business', amount: 99, date: '2024-01-20', status: 'completed' },
                    { email: 'sarah.johnson@example.com', plan: 'Trader', amount: 19, date: '2024-01-20', status: 'pending' },
                    { email: 'david.brown@example.com', plan: 'Pro', amount: 49, date: '2024-01-19', status: 'completed' }
                  ].map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                          {transaction.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        ${transaction.amount}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                            : 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}