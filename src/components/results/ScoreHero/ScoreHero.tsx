import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface ScoreHeroProps {
  score: number;
  maxScore?: number;
  url: string;
  date?: string;
  previousScore?: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'var(--score-excellent)';
  if (score >= 60) return 'var(--score-good)';
  if (score >= 40) return 'var(--score-warning)';
  return 'var(--score-critical)';
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Goed';
  if (score >= 40) return 'Waarschuwing';
  return 'Kritiek';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ScoreHero = ({ score, maxScore = 100, url, date, previousScore }: ScoreHeroProps) => {
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const percentage = (score / maxScore) * 100;
  const formattedDate = formatDate(date);

  return (
    <motion.div 
      className="score-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="score-circle">
          <CircularProgressbar
            value={percentage}
            text={`${Math.round(percentage)}%`}
            styles={buildStyles({
              pathColor: scoreColor,
              textColor: scoreColor,
              trailColor: '#E5E7EB'
            })}
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{scoreLabel}</h2>
          {previousScore && (
            <p className="text-sm text-gray-600">
              Vorige score: {previousScore}%
              {score > previousScore && (
                <span className="ml-2 text-green-600">
                  ↑ {score - previousScore}%
                </span>
              )}
            </p>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{url}</p>
          {date && (
            <p className="text-xs text-gray-500 mt-1">
              Gescand op: {formattedDate}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 