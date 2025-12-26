import { cn } from '@/lib/utils';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';

interface PartyBadgeProps {
  party: string;
  size?: 'sm' | 'md' | 'lg';
  showFull?: boolean;
  className?: string;
}

export function PartyBadge({ party, size = 'md', showFull = false, className }: PartyBadgeProps) {
  const shortName = getPartyShortName(party);
  const color = getPartyColor(party);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        "party-badge font-semibold rounded-full",
        sizeClasses[size],
        className
      )}
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
      }}
      title={party}
    >
      {showFull ? party : shortName}
    </span>
  );
}
