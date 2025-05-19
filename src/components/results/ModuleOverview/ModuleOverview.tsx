import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Module } from '@/lib/types/results';
import { getStatusColor, getStatusLabel } from '@/lib/utils/scores';
import { formatDate } from '@/lib/utils/date';

interface ModuleOverviewProps {
  modules: Module[];
  layout?: 'grid' | 'list';
}

export const ModuleOverview = ({ modules, layout = 'grid' }: ModuleOverviewProps) => {
  const radarData = modules.map(module => ({
    subject: module.name,
    score: module.score,
    fullMark: 100
  }));

  return (
    <motion.div
      className="module-overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Module Overzicht</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${
              layout === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => layout === 'list' && window.dispatchEvent(new CustomEvent('change-layout', { detail: 'grid' }))}
          >
            Grid
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              layout === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => layout === 'grid' && window.dispatchEvent(new CustomEvent('change-layout', { detail: 'list' }))}
          >
            Lijst
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {modules.map((module) => (
          <motion.div
            key={module.id}
            className="module-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Laatste update: {formatDate(module.lastUpdated)}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                {getStatusLabel(module.status)}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Score</span>
                <span>{module.score}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${module.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Prestaties</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <RadarChart width={500} height={400} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </div>
      </div>
    </motion.div>
  );
}; 