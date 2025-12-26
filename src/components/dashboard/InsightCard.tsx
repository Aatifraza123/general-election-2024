import { AlertCircle, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InsightData } from '@/types/election';

interface InsightCardProps {
  insight: InsightData;
  delay?: number;
}

const iconMap = {
  highlight: TrendingUp,
  warning: AlertCircle,
  trend: BarChart3,
  comparison: Lightbulb,
};

const colorMap = {
  highlight: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  trend: 'border-l-primary',
  comparison: 'border-l-purple-500',
};

const bgMap = {
  highlight: 'bg-emerald-500/10',
  warning: 'bg-amber-500/10',
  trend: 'bg-primary/10',
  comparison: 'bg-purple-500/10',
};

export function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  const Icon = iconMap[insight.type];
  
  return (
    <div 
      className={cn(
        "insight-card animate-slide-up",
        colorMap[insight.type]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("rounded-lg p-2", bgMap[insight.type])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface InsightsListProps {
  insights: InsightData[];
}

export function InsightsList({ insights }: InsightsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        Key Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} delay={index * 100} />
        ))}
      </div>
    </div>
  );
}
