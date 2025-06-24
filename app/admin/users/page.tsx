'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, MoreHorizontal, Eye, Ban, RefreshCw } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { LoadingSpinner } from '../../components/ui/loading'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import Link from 'next/link'

interface User {
  id: string
  email: string
  plan: 'free' | 'trader' | 'pro' | 'business'
  alertsCreated: number
  alertsUsed: number
  alertsLimit: number
  lastActive: string
  status: 'active' | 'suspended'
  joinedAt: string
  totalSpent: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          email: 'john.doe@example.com',
          plan: 'trader',
          alertsCreated: 12,
          alertsUsed: 8,
          alertsLimit: 50,
          lastActive: '2024-01-21T10:30:00Z',
          status: 'active',
          joinedAt: '2024-01-15T09:00:00Z',
          totalSpent: 57
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          plan: 'pro',
          alertsCreated: 45,
          alertsUsed: 32,
          alertsLimit: 200,
          lastActive: '2024-01-21T08:15:00Z',
          status: 'active',
          joinedAt: '2024-01-10T14:30:00Z',
          totalSpent: 147
        },
        {
          id: '3',
          email: 'mike.wilson@example.com',
          plan: 'free',
          alertsCreated: 3,
          alertsUsed: 2,
          alertsLimit: 5,
          lastActive: '2024-01-20T16:45:00Z',
          status: 'active',
          joinedAt: '2024-01-18T11:20:00Z',
          totalSpent: 0
        },
        {
          id: '4',
          email: 'sarah.johnson@example.com',
          plan: 'business',
          alertsCreated: 156,
          alertsUsed: 89,
          alertsLimit: 999999,
          lastActive: '2024-01-19T12:00:00Z',
          status: 'suspended',
          joinedAt: '2024-01-05T10:15:00Z',
          totalSpent: 297
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const handleSuspendUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus as User['status'] }
        : user
    ))

    toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`)
  }

  const handleResetAlerts = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s alerts?')) return

    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, alertsCreated: 0, alertsUsed: 0 }
        : user
    ))

    toast.success('User alerts reset successfully')
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
      case 'trader': return 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
      case 'pro': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
      case 'business': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20'
      case 'suspended': return 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage users, plans, and account status
          </p>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Plan Filter */}
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="input-field"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="trader">Trader</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Alerts
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Last Active
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Total Spent
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(user.plan)}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.alertsUsed} / {user.alertsLimit === 999999 ? '∞' : user.alertsLimit}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {user.alertsCreated} created
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        ${user.totalSpent}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleSuspendUser(user.id, user.status)}
                            className="p-1 text-gray-400 hover:text-warning-600 dark:hover:text-warning-400"
                            title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetAlerts(user.id)}
                            className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            title="Reset alerts"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}