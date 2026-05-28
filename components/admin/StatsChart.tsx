'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface StatsChartProps {
  data: { date: string; count: number }[]
}

export default function StatsChart({ data }: StatsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3182f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3182f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f2f4f6" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8b95a1' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#8b95a1' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid #e5e8eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          labelStyle={{ fontWeight: 600, color: '#191f28' }}
          itemStyle={{ color: '#3182f6' }}
          formatter={(value: number) => [`${value}명`, '신규 가입']}
        />
        <Area type="monotone" dataKey="count" stroke="#3182f6" strokeWidth={2} fill="url(#colorCount)" dot={{ fill: '#3182f6', r: 4, strokeWidth: 2, stroke: '#fff' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
