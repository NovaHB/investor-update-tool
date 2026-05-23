import { createContext, useContext, useState } from 'react'

const MetricsContext = createContext()

export const defaultMetrics = {
  mrr: '24000',
  mrrChange: '+14.3%',
  activeUsers: '520',
  userChange: '+26.8%',
  churnRate: '2.4%',
  runway: '18',
  cashPosition: '450000',
  burnRate: '25000',
  highlights: 'Closed 3 enterprise deals worth $8,400 ARR\nLaunched v2.0 with AI-powered features\nHired 2 engineers, 1 growth lead\nCAC dropped 18% through referral optimization',
  challenges: 'CAC increased slightly in paid channels\nHiring slower than planned for engineering roles',
  nextMonth: 'Expand to 3 new markets, close Series A lead',
  asks: 'Need 2 intros to Series A fintech investors\nAdvice on enterprise pricing strategy',
  mrrHistory: [
    { month: 'Jan', mrr: 12000 },
    { month: 'Feb', mrr: 15000 },
    { month: 'Mar', mrr: 14500 },
    { month: 'Apr', mrr: 18000 },
    { month: 'May', mrr: 21000 },
    { month: 'Jun', mrr: 24000 },
  ],
  userHistory: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 180 },
    { month: 'Mar', users: 240 },
    { month: 'Apr', users: 310 },
    { month: 'May', users: 410 },
    { month: 'Jun', users: 520 },
  ]
}

export function MetricsProvider({ children }) {
  const [metrics, setMetrics] = useState(defaultMetrics)

  const updateMetrics = (newMetrics) => {
    setMetrics(prev => {
      const updated = { ...prev, ...newMetrics }

      // Update chart history with latest MRR and users
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const currentMonth = months[new Date().getMonth()]

      updated.mrrHistory = [
        ...prev.mrrHistory.slice(-5),
        { month: currentMonth, mrr: Number(newMetrics.mrr) || prev.mrr }
      ]
      updated.userHistory = [
        ...prev.userHistory.slice(-5),
        { month: currentMonth, users: Number(newMetrics.activeUsers) || prev.activeUsers }
      ]

      return updated
    })
  }

  return (
    <MetricsContext.Provider value={{ metrics, updateMetrics }}>
      {children}
    </MetricsContext.Provider>
  )
}

export const useMetrics = () => useContext(MetricsContext)