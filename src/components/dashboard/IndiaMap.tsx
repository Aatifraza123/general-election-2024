import { useMemo, useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { StateStats } from '@/types/election';

// More accurate SVG India Map with better state paths
const INDIA_SVG_MAP = {
  viewBox: "0 0 800 1000",
  states: {
    // North
    "Jammu & Kashmir": "M 180 40 L 220 30 L 250 40 L 260 70 L 240 95 L 210 90 L 180 75 Z",
    "Ladakh": "M 150 20 L 180 15 L 200 35 L 190 55 L 160 50 Z",
    "Himachal Pradesh": "M 210 95 L 240 90 L 260 105 L 250 125 L 220 120 Z",
    "Punjab": "M 190 120 L 220 115 L 240 135 L 230 155 L 200 150 Z",
    "Chandigarh": "M 215 140 L 220 137 L 223 143 L 218 148 L 215 145 Z",
    "Uttaranchal": "M 250 130 L 280 125 L 300 145 L 290 165 L 260 160 Z",
    "Haryana": "M 200 155 L 230 150 L 250 170 L 240 190 L 210 185 Z",
    "NCT Of Delhi": "M 225 175 L 235 170 L 240 180 L 235 190 L 225 185 Z",
    
    // West
    "Rajasthan": "M 120 170 L 210 160 L 240 195 L 250 270 L 210 310 L 150 290 L 100 230 Z",
    "Gujarat": "M 80 280 L 150 270 L 210 310 L 220 380 L 180 430 L 110 400 L 60 340 Z",
    "Dadra & Nagar Haveli and Daman & Diu": "M 120 360 L 130 355 L 135 365 L 125 375 L 120 370 Z",
    "Maharashtra": "M 180 400 L 280 390 L 330 440 L 320 520 L 250 550 L 180 520 L 140 460 Z",
    "Goa": "M 170 520 L 190 515 L 200 535 L 185 550 L 170 545 Z",
    
    // Central
    "Madhya Pradesh": "M 210 260 L 310 250 L 350 300 L 340 380 L 280 400 L 220 360 Z",
    "Chhattisgarh": "M 310 300 L 380 295 L 400 340 L 390 400 L 340 420 L 300 380 Z",
    
    // East
    "Uttar Pradesh": "M 250 175 L 350 170 L 410 195 L 420 245 L 390 275 L 310 265 L 260 245 Z",
    "Bihar": "M 410 200 L 480 195 L 510 220 L 500 250 L 450 255 L 420 240 Z",
    "Jharkhand": "M 390 280 L 450 275 L 470 315 L 450 355 L 400 360 L 380 325 Z",
    "West Bengal": "M 450 260 L 510 255 L 530 300 L 520 350 L 470 360 L 440 320 Z",
    "Odisha": "M 400 365 L 470 360 L 490 410 L 470 470 L 410 480 L 380 440 Z",
    
    // Northeast
    "Sikkim": "M 510 230 L 525 225 L 535 240 L 525 255 L 510 250 Z",
    "Assam": "M 510 255 L 580 250 L 610 280 L 600 310 L 550 315 L 510 295 Z",
    "Arunachal Pradesh": "M 530 210 L 610 200 L 650 230 L 640 270 L 580 280 L 530 260 Z",
    "Nagaland": "M 640 270 L 660 265 L 670 285 L 655 300 L 640 295 Z",
    "Manipur": "M 640 300 L 660 295 L 670 315 L 655 330 L 640 325 Z",
    "Mizoram": "M 630 330 L 645 325 L 655 345 L 640 360 L 625 355 Z",
    "Tripura": "M 610 310 L 630 305 L 640 325 L 625 340 L 610 335 Z",
    "Meghalaya": "M 580 285 L 610 280 L 625 300 L 610 315 L 580 310 Z",
    
    // South
    "Telangana": "M 320 420 L 380 415 L 410 460 L 400 520 L 350 540 L 320 500 Z",
    "Andhra Pradesh": "M 330 520 L 410 510 L 450 560 L 440 630 L 380 660 L 330 640 Z",
    "Karnataka": "M 190 550 L 290 540 L 330 600 L 310 680 L 240 700 L 190 660 Z",
    "Tamil Nadu": "M 240 700 L 310 690 L 350 740 L 340 820 L 280 850 L 220 820 L 200 760 Z",
    "Kerala": "M 190 660 L 240 650 L 260 710 L 250 790 L 210 820 L 180 780 Z",
    "Puducherry": "M 310 730 L 320 725 L 325 735 L 315 745 L 310 740 Z",
    
    // Islands
    "Andaman & Nicobar Islands": "M 480 780 L 490 775 L 500 800 L 490 825 L 480 820 Z",
    "Lakshadweep": "M 110 730 L 120 725 L 125 735 L 115 745 L 110 740 Z",
  }
};

interface IndiaMapProps {
  stateStats: StateStats[];
  onStateClick?: (state: string) => void;
}

export function IndiaMap({ stateStats, onStateClick }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Calculate dominant party per state
  const statePartyData = useMemo(() => {
    const result: { [state: string]: { party: string; seats: number; total: number; color: string } } = {};
    
    stateStats.forEach(state => {
      const parties = Object.entries(state.parties);
      if (parties.length > 0) {
        const dominant = parties.reduce((a, b) => a[1] > b[1] ? a : b);
        result[state.state] = {
          party: dominant[0],
          seats: dominant[1],
          total: state.totalSeats,
          color: getPartyColor(dominant[0])
        };
      }
    });
    
    return result;
  }, [stateStats]);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    onStateClick?.(stateName);
  };

  const getStateColor = (stateName: string) => {
    const data = statePartyData[stateName];
    if (!data) return 'hsl(220, 10%, 40%)';
    return data.color;
  };

  const getStateOpacity = (stateName: string) => {
    if (hoveredState === stateName) return 0.9;
    if (selectedState === stateName) return 1;
    return 0.7;
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          State-wise Election Map
        </h3>
        {selectedState && (
          <button
            onClick={() => setSelectedState(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
        <Info className="h-4 w-4" />
        Interactive map showing dominant party per state. Hover for details, click to select.
      </p>
      
      <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg p-6 border border-border shadow-lg">
        <svg 
          viewBox={INDIA_SVG_MAP.viewBox} 
          className="w-full h-auto max-h-[700px]"
          style={{ 
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          }}
        >
          {/* Background */}
          <rect x="0" y="0" width="800" height="1000" fill="transparent" />
          
          {/* States */}
          {Object.entries(INDIA_SVG_MAP.states).map(([stateName, path]) => {
            const data = statePartyData[stateName];
            const isHovered = hoveredState === stateName;
            const isSelected = selectedState === stateName;
            
            return (
              <g key={stateName}>
                <path
                  d={path}
                  fill={getStateColor(stateName)}
                  fillOpacity={getStateOpacity(stateName)}
                  stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                  strokeWidth={isSelected ? "3" : isHovered ? "2" : "1"}
                  className="transition-all duration-300 cursor-pointer hover:brightness-110"
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(stateName)}
                  style={{
                    transformOrigin: 'center',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  }}
                />
                {/* State Labels for larger states */}
                {['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu'].includes(stateName) && (
                  <text
                    x={getStateLabelPosition(stateName).x}
                    y={getStateLabelPosition(stateName).y}
                    fontSize="10"
                    fill="hsl(var(--foreground))"
                    opacity="0.6"
                    textAnchor="middle"
                    pointerEvents="none"
                    className="font-medium"
                  >
                    {stateName.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Enhanced Tooltip */}
        {hoveredState && statePartyData[hoveredState] && (
          <div className="absolute top-6 right-6 glass-card p-4 animate-slide-up z-10 min-w-[220px] shadow-xl border-2 border-primary/20">
            <h4 className="font-bold text-base mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {hoveredState}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">Dominant Party:</span>
                <span className="font-semibold flex items-center gap-2">
                  <span 
                    className="inline-block w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: statePartyData[hoveredState].color }}
                  />
                  {getPartyShortName(statePartyData[hoveredState].party)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">Seats Won:</span>
                <span className="font-bold text-primary">
                  {statePartyData[hoveredState].seats}/{statePartyData[hoveredState].total}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium">
                  {((statePartyData[hoveredState].seats / statePartyData[hoveredState].total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Click to explore state details
            </p>
          </div>
        )}

        {/* Selected State Info */}
        {selectedState && statePartyData[selectedState] && (
          <div className="absolute bottom-6 left-6 glass-card p-3 z-10 border-2 border-primary">
            <p className="text-xs font-medium text-primary mb-1">Selected State</p>
            <p className="font-bold">{selectedState}</p>
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Party Distribution</p>
          <p className="text-xs text-muted-foreground">Top 10 parties by total seats</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(
            stateStats.reduce((acc, state) => {
              Object.entries(state.parties).forEach(([party, seats]) => {
                acc[party] = (acc[party] || 0) + seats;
              });
              return acc;
            }, {} as { [key: string]: number })
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([party, seats]) => (
              <div 
                key={party} 
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded shadow-sm flex-shrink-0"
                  style={{ backgroundColor: getPartyColor(party) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{getPartyShortName(party)}</p>
                  <p className="text-xs text-muted-foreground">{seats} seats</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// Helper function for state label positions
function getStateLabelPosition(stateName: string): { x: number; y: number } {
  const positions: { [key: string]: { x: number; y: number } } = {
    'Rajasthan': { x: 165, y: 240 },
    'Madhya Pradesh': { x: 275, y: 320 },
    'Maharashtra': { x: 255, y: 470 },
    'Uttar Pradesh': { x: 330, y: 220 },
    'Karnataka': { x: 260, y: 620 },
    'Tamil Nadu': { x: 280, y: 770 },
  };
  return positions[stateName] || { x: 0, y: 0 };
}
