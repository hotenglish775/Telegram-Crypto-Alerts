'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { LoadingSpinner } from '../../components/ui/loading'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Indicator {
  id: string
  name: string
  type: 'simple' | 'technical'
  params?: Array<{
    name: string
    description: string
    default: any
    type: 'number' | 'string' | 'boolean'
  }>
  outputs?: string[]
}

const CRYPTO_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT', 'XRP/USDT',
  'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'LUNA/USDT', 'LINK/USDT', 'ATOM/USDT'
]

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', '12h', '1d', '1w']

const COMPARISONS = ['ABOVE', 'BELOW']
const SIMPLE_COMPARISONS = ['ABOVE', 'BELOW', 'PCTCHG', '24HRCHG']

export default function NewAlertPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    pair: '',
    indicator: '',
    type: 'simple' as 'simple' | 'technical',
    comparison: '',
    target: '',
    timeframe: '1h',
    outputValue: '',
    params: {} as Record<string, any>,
    cooldown: '',
    deliveryMethods: {
      telegram: true,
      email: false,
      webhook: false
    }
  })

  useEffect(() => {
    // Simulate API call to fetch indicators
    setTimeout(() => {
      setIndicators([
        {
          id: 'PRICE',
          name: 'Price',
          type: 'simple'
        },
        {
          id: 'RSI',
          name: 'Relative Strength Index',
          type: 'technical',
          params: [
            { name: 'period', description: 'Period length', default: 14, type: 'number' }
          ],
          outputs: ['value']
        },
        {
          id: 'MACD',
          name: 'Moving Average Convergence Divergence',
          type: 'technical',
          params: [
            { name: 'fastPeriod', description: 'Fast period', default: 12, type: 'number' },
            { name: 'slowPeriod', description: 'Slow period', default: 26, type: 'number' },
            { name: 'signalPeriod', description: 'Signal period', default: 9, type: 'number' }
          ],
          outputs: ['valueMACD', 'valueMACDSignal', 'valueMACDHist']
        },
        {
          id: 'BBANDS',
          name: 'Bollinger Bands',
          type: 'technical',
          params: [
            { name: 'period', description: 'Period length', default: 20, type: 'number' },
            { name: 'stddev', description: 'Standard deviation', default: 2, type: 'number' }
          ],
          outputs: ['valueUpperBand', 'valueMiddleBand', 'valueLowerBand']
        },
        {
          id: 'MA',
          name: 'Moving Average',
          type: 'technical',
          params: [
            { name: 'period', description: 'Period length', default: 30, type: 'number' }
          ],
          outputs: ['value']
        },
        {
          id: 'EMA',
          name: 'Exponential Moving Average',
          type: 'technical',
          params: [
            { name: 'period', description: 'Period length', default: 30, type: 'number' }
          ],
          outputs: ['value']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const selectedIndicator = indicators.find(ind => ind.id === formData.indicator)

  const handleIndicatorChange = (indicatorId: string) => {
    const indicator = indicators.find(ind => ind.id === indicatorId)
    if (!indicator) return

    setFormData(prev => ({
      ...prev,
      indicator: indicatorId,
      type: indicator.type,
      params: indicator.params?.reduce((acc, param) => ({
        ...acc,
        [param.name]: param.default
      }), {}) || {},
      outputValue: indicator.outputs?.[0] || '',
      comparison: indicator.type === 'simple' ? '' : 'ABOVE'
    }))
  }

  const handleParamChange = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        [paramName]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.pair || !formData.indicator || !formData.comparison || !formData.target) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Alert created successfully!')
      router.push('/alerts')
    } catch (error) {
      toast.error('Failed to create alert')
    } finally {
      setSubmitting(false)
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/alerts"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Alert
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Set up a new cryptocurrency alert
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Crypto Pair */}
          <div>
            <label className="label">
              Cryptocurrency Pair *
            </label>
            <select
              value={formData.pair}
              onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select a pair</option>
              {CRYPTO_PAIRS.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          {/* Indicator */}
          <div>
            <label className="label">
              Indicator *
            </label>
            <select
              value={formData.indicator}
              onChange={(e) => handleIndicatorChange(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select an indicator</option>
              {indicators.map(indicator => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.name} ({indicator.type})
                </option>
              ))}
            </select>
          </div>

          {/* Technical Indicator Parameters */}
          {selectedIndicator?.type === 'technical' && selectedIndicator.params && (
            <div>
              <label className="label">Parameters</label>
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {selectedIndicator.params.map(param => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {param.name} - {param.description}
                    </label>
                    <input
                      type={param.type === 'number' ? 'number' : 'text'}
                      value={formData.params[param.name] || param.default}
                      onChange={(e) => handleParamChange(param.name, 
                        param.type === 'number' ? Number(e.target.value) : e.target.value
                      )}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeframe (for technical indicators) */}
          {selectedIndicator?.type === 'technical' && (
            <div>
              <label className="label">
                Timeframe *
              </label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                className="input-field"
                required
              >
                {TIMEFRAMES.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
          )}

          {/* Output Value (for technical indicators) */}
          {selectedIndicator?.type === 'technical' && selectedIndicator.outputs && (
            <div>
              <label className="label">
                Output Value *
              </label>
              <select
                value={formData.outputValue}
                onChange={(e) => setFormData(prev => ({ ...prev, outputValue: e.target.value }))}
                className="input-field"
                required
              >
                {selectedIndicator.outputs.map(output => (
                  <option key={output} value={output}>{output}</option>
                ))}
              </select>
            </div>
          )}

          {/* Comparison */}
          <div>
            <label className="label">
              Comparison *
            </label>
            <select
              value={formData.comparison}
              onChange={(e) => setFormData(prev => ({ ...prev, comparison: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select comparison</option>
              {(selectedIndicator?.type === 'simple' ? SIMPLE_COMPARISONS : COMPARISONS).map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>

          {/* Target Value */}
          <div>
            <label className="label">
              Target Value *
            </label>
            <input
              type="number"
              step="any"
              value={formData.target}
              onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
              className="input-field"
              placeholder="Enter target value"
              required
            />
            {formData.comparison === 'PCTCHG' && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter percentage (e.g., 10 for 10%)
              </p>
            )}
          </div>

          {/* Cooldown */}
          <div>
            <label className="label">
              Cooldown (Optional)
            </label>
            <input
              type="text"
              value={formData.cooldown}
              onChange={(e) => setFormData(prev => ({ ...prev, cooldown: e.target.value }))}
              className="input-field"
              placeholder="e.g., 30s, 5m, 1h"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Time to wait before triggering again. Leave empty for one-time alerts.
            </p>
          </div>

          {/* Delivery Methods */}
          <div>
            <label className="label">
              Delivery Methods
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.deliveryMethods.telegram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    deliveryMethods: {
                      ...prev.deliveryMethods,
                      telegram: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Telegram
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.deliveryMethods.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    deliveryMethods: {
                      ...prev.deliveryMethods,
                      email: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Email
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.deliveryMethods.webhook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    deliveryMethods: {
                      ...prev.deliveryMethods,
                      webhook: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Webhook
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Link
              href="/alerts"
              className="btn-secondary flex-1"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {submitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}