'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Check, Zap, Crown, Building, Star } from 'lucide-react'
import { DashboardLayout } from '../components/layout/dashboard-layout'
import { LoadingSpinner } from '../components/ui/loading'
import toast from 'react-hot-toast'
import clsx from 'clsx'

interface BillingInfo {
  currentPlan: 'free' | 'trader' | 'pro' | 'business'
  alertsUsed: number
  alertsLimit: number
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate?: string
  paymentMethod?: string
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    alerts: 5,
    features: [
      '5 Active Alerts',
      'Basic Indicators',
      'Telegram Integration',
      'Email Support'
    ],
    icon: Star,
    color: 'gray'
  },
  {
    id: 'trader',
    name: 'Trader',
    price: 19,
    yearlyPrice: 190,
    alerts: 50,
    features: [
      '50 Active Alerts',
      'All Technical Indicators',
      'Multiple Telegram Groups',
      'Webhook Support',
      'Priority Support'
    ],
    icon: Zap,
    color: 'primary',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    yearlyPrice: 490,
    alerts: 200,
    features: [
      '200 Active Alerts',
      'Advanced Analytics',
      'API Access',
      'Custom Indicators',
      '24/7 Support'
    ],
    icon: Crown,
    color: 'purple'
  },
  {
    id: 'business',
    name: 'Business',
    price: 99,
    yearlyPrice: 990,
    alerts: 'Unlimited',
    features: [
      'Unlimited Alerts',
      'Team Management',
      'White-label Options',
      'Dedicated Support',
      'Custom Integration'
    ],
    icon: Building,
    color: 'indigo'
  }
]

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    currentPlan: 'trader',
    alertsUsed: 12,
    alertsLimit: 50,
    billingCycle: 'monthly',
    nextBillingDate: '2024-02-15',
    paymentMethod: '**** 4242'
  })
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    
    try {
      // Simulate API call to create checkout session
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would redirect to Stripe/payment processor
      toast.success('Redirecting to payment...')
      
      // Simulate successful upgrade
      setTimeout(() => {
        setBillingInfo(prev => ({ ...prev, currentPlan: planId as any }))
        toast.success('Plan upgraded successfully!')
      }, 3000)
      
    } catch (error) {
      toast.error('Failed to process upgrade')
    } finally {
      setUpgrading(null)
    }
  }

  const currentPlan = PLANS.find(plan => plan.id === billingInfo.currentPlan)
  const usagePercentage = (billingInfo.alertsUsed / billingInfo.alertsLimit) * 100

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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing & Plans
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Plan
              </h2>
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {currentPlan && (
                  <>
                    <div className={`w-10 h-10 bg-${currentPlan.color}-100 dark:bg-${currentPlan.color}-900 rounded-lg flex items-center justify-center`}>
                      <currentPlan.icon className={`h-5 w-5 text-${currentPlan.color}-600 dark:text-${currentPlan.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {currentPlan.name} Plan
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${currentPlan.price}/{billingInfo.billingCycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {billingInfo.nextBillingDate && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next billing date: {new Date(billingInfo.nextBillingDate).toLocaleDateString()}
                </div>
              )}

              {billingInfo.paymentMethod && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Payment method: {billingInfo.paymentMethod}
                </div>
              )}
            </div>
          </div>

          {/* Usage */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Alert Usage
              </h2>
              <Zap className="h-6 w-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Alerts Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {billingInfo.alertsUsed} / {billingInfo.alertsLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={clsx(
                      'h-2 rounded-full transition-all duration-300',
                      usagePercentage > 80 ? 'bg-danger-500' : 
                      usagePercentage > 60 ? 'bg-warning-500' : 'bg-success-500'
                    )}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              {usagePercentage > 80 && (
                <div className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                  <p className="text-sm text-warning-700 dark:text-warning-300">
                    You're approaching your alert limit. Consider upgrading your plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Yearly
              <span className="ml-1 text-xs text-success-600 dark:text-success-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === billingInfo.currentPlan
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price
            const Icon = plan.icon

            return (
              <div
                key={plan.id}
                className={clsx(
                  'card relative',
                  plan.popular && 'border-2 border-primary-500',
                  isCurrentPlan && 'ring-2 ring-success-500'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-success-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`w-12 h-12 bg-${plan.color}-100 dark:bg-${plan.color}-900 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-6 w-6 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>

                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    ${price}
                    <span className="text-lg text-gray-500">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>

                  {billingCycle === 'yearly' && plan.price > 0 && (
                    <p className="text-sm text-success-600 dark:text-success-400 mb-4">
                      Save ${(plan.price * 12) - plan.yearlyPrice}/year
                    </p>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {typeof plan.alerts === 'number' ? `${plan.alerts} alerts` : plan.alerts}
                  </p>

                  <ul className="space-y-2 mb-6 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-success-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <button className="btn-secondary w-full" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading === plan.id}
                      className="btn-primary w-full"
                    >
                      {upgrading === plan.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        plan.id === 'free' ? 'Downgrade' : 'Upgrade'
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Billing History */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Billing History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    Jan 15, 2024
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    Trader Plan - Monthly
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    $19.00
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
                      Paid
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    Dec 15, 2023
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    Trader Plan - Monthly
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    $19.00
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
                      Paid
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}