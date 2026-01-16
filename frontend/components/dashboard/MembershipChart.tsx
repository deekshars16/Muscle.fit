import React, { useState } from 'react'

interface ChartDataPoint {
  week: string
  members: number
}

interface MembershipChartProps {
  data: ChartDataPoint[]
  title: string
  subtitle: string
  selectedDate?: Date | null
}

const MembershipChart: React.FC<MembershipChartProps> = ({ data, title, subtitle, selectedDate }) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  
  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.members), 100)
  const yAxisMarks = [0, 20, 40, 60, 80]

  // Update subtitle based on selected date
  const displaySubtitle = selectedDate 
    ? `Selected: ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – Weekly overview`
    : subtitle

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{displaySubtitle}</p>
      </div>

      {/* Chart Container */}
      <div className="relative h-64">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 -ml-8">
          {yAxisMarks.reverse().map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="relative h-full pl-4">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between border-l border-gray-200 dark:border-gray-700">
            {yAxisMarks.map((_, index) => (
              <div
                key={index}
                className="w-full border-t border-gray-100 dark:border-gray-700"
                style={{ borderStyle: index === 0 ? 'solid' : 'dashed' }}
              />
            ))}
          </div>

          {/* SVG Chart */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area Chart */}
            {data.length > 0 && (
              <>
                {/* Line Path */}
                <polyline
                  points={data
                    .map(
                      (d, i) =>
                        `${(i / (data.length - 1)) * 400},${200 - (d.members / maxValue) * 200}`
                    )
                    .join(' ')}
                  fill="none"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Fill Area */}
                <polygon
                  points={`0,200 ${data
                    .map(
                      (d, i) =>
                        `${(i / (data.length - 1)) * 400},${200 - (d.members / maxValue) * 200}`
                    )
                    .join(' ')} 400,200`}
                  fill="url(#chart-gradient)"
                />

                {/* Data Points */}
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i / (data.length - 1)) * 400}
                    cy={200 - (d.members / maxValue) * 200}
                    r="5"
                    fill="rgb(168, 85, 247)"
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedWeek(i)}
                  />
                ))}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* X-Axis Labels - Clickable */}
      <div className="flex justify-between mt-8 pl-4 text-xs text-gray-600 dark:text-gray-400">
        {data.map((d, index) => (
          <button
            key={index}
            onClick={() => setSelectedWeek(index)}
            className={`px-2 py-1 rounded transition-colors ${
              selectedWeek === index
                ? 'bg-purple-500 text-white font-semibold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {d.week}
          </button>
        ))}
      </div>

      {/* Selected Week Info */}
      {selectedWeek !== null && data[selectedWeek] && (
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-semibold">{data[selectedWeek].week}:</span> {data[selectedWeek].members} members
          </p>
        </div>
      )}
    </div>
  )
}

export default MembershipChart
