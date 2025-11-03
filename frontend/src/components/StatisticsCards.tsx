import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp, CheckCircle } from 'lucide-react'
import { attendanceAPI } from '../api/attendance'
import { StatCardSkeleton } from './Skeleton'

interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
  color: string
  bgColor: string
}

interface StatisticsCardsProps {
  month?: number
  year?: number
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ 
  month = new Date().getMonth() + 1, 
  year = new Date().getFullYear() 
}) => {
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [month, year])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await attendanceAPI.getMonthlySummary(month, year)
      const { summary } = response.data

      const cards: StatCard[] = [
        {
          title: 'Total Hari Kerja',
          value: summary.totalDays,
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
          title: 'Hari Completed',
          value: summary.completedDays,
          change: `${summary.totalDays > 0 ? ((summary.completedDays / summary.totalDays) * 100).toFixed(1) : 0}%`,
          changeType: summary.completedDays === summary.totalDays ? 'increase' : 'neutral',
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
          title: 'Total Jam Kerja',
          value: `${summary.totalWorkingHours.toFixed(1)}`,
          change: 'jam',
          changeType: 'neutral',
          icon: Clock,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
          title: 'Rata-rata Harian',
          value: `${summary.averageWorkingHours}`,
          change: 'jam/hari',
          changeType: parseFloat(summary.averageWorkingHours) >= 8 ? 'increase' : 'neutral',
          icon: TrendingUp,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
      ]

      setStats(cards)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      // Set default empty stats
      setStats([
        {
          title: 'Total Hari Kerja',
          value: 0,
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
          title: 'Hari Completed',
          value: 0,
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
          title: 'Total Jam Kerja',
          value: '0.0',
          icon: Clock,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
          title: 'Rata-rata Harian',
          value: '0.0',
          icon: TrendingUp,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'decrease':
        return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />
      default:
        return null
    }
  }

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500'
      case 'decrease':
        return 'text-red-500'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </h3>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {stat.value}
                </motion.p>
                
                {stat.change && (
                  <div className={`flex items-center space-x-1 mt-1 ${getChangeColor(stat.changeType)}`}>
                    {getChangeIcon(stat.changeType)}
                    <span className="text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StatisticsCards