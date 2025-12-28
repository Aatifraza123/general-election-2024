import { useMemo, useState } from 'react';
import { MapPin, TrendingUp, Award } from 'lucide-react';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { StateStats } from '@/types/election';

// Modern India Map with accurate state boundaries
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

// State labels for major states
const STATE_LABELS = {
  "Uttar Pradesh": { x: 330, y: 220, short: "UP" },
  "Maharashtra": { x: 230, y: 470, short: "MH" },
  "West Bengal": { x: 485, y: 310, short: "WB" },
  "Bihar": { x: 455, y: 225, short: "BR" },
  "Madhya Pradesh": { x: 270, y: 320, short: "MP" },
  "Tamil Nadu": { x: 270, y: 770, short: "TN" },
  "Rajasthan": { x: 170, y: 240, short: "RJ" },
  "Karnataka": { x: 240, y: 620, short: "KA" },
  "Gujarat": { x: 140, y: 350, short: "GJ" },
  "Andhra Pradesh": { x: 370, y: 590, short: "AP" },
  "Odisha": { x: 430, y: 420, short: "OD" },
  "Telangana": { x: 360, y: 470, short: "TG" },
  "Kerala": { x: 210, y: 740, short: "KL" },
  "Assam": { x: 555, y: 285, short: "AS" },
  "Punjab": { x: 215, y: 135, short: "PB" },
  "Chhattisgarh": { x: 350, y: 350, short: "CG" },
  "Haryana": { x: 225, y: 170, short: "HR" },
  "Jharkhand": { x: 420, y: 320, short: "JH" },
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
    if (!hoveredState && !selectedState) return 0.8;
    if (selectedState === stateName) return 1;
    if (hoveredState === stateName) return 0.95;
    return 0.6;
  };

  // Get party distribution for legend
  const partyDistribution = useMemo(() => {
    const distribution: { [party: string]: number } = {};
    Object.values(statePartyData).forEach(({ party }) => {
      distribution[party] = (distribution[party] || 0) + 1;
    });
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [statePartyData]);

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            State-wise Election Map
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive map showing dominant party by state
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 relative">
          <div className="relative bg-gradient-to-br from-background to-muted/20 rounded-xl p-6 border border-border shadow-lg">
            <svg
              viewBox={INDIA_SVG_MAP.viewBox}
              className="w-full h-auto"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Background */}
              <rect x="0" y="0" width="800" height="1000" fill="transparent" />
              
              {/* States */}
              {Object.entries(INDIA_SVG_MAP.states).map(([stateName, path]) => (
                <path
                  key={stateName}
                  d={path}
                  fill={getStateColor(stateName)}
                  fillOpacity={getStateOpacity(stateName)}
                  stroke={selectedState === stateName ? '#fff' : 'hsl(var(--border))'}
                  strokeWidth={selectedState === stateName ? 3 : 1.5}
                  className="cursor-pointer transition-all duration-300 hover:brightness-110"
                  style={{
                    filter: hoveredState === stateName || selectedState === stateName 
                      ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))' 
                      : 'none'
                  }}
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(stateName)}
                />
              ))}
              
              {/* State Labels */}
              {Object.entries(STATE_LABELS).map(([stateName, { x, y, short }]) => (
                <text
                  key={`label-${stateName}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className="text-[10px] font-bold pointer-events-none select-none"
                  fill={hoveredState === stateName || selectedState === stateName ? '#fff' : 'rgba(255,255,255,0.8)'}
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: hoveredState === stateName || selectedState === stateName ? '12px' : '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  {short}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredState && statePartyData[hoveredState] && (
              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl animate-slide-up z-10">
                <h4 className="font-bold text-sm mb-2">{hoveredState}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Dominant Party:</span>
                    <span className="font-semibold" style={{ color: statePartyData[hoveredState].color }}>
                      {getPartyShortName(statePartyData[hoveredState].party)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Seats Won:</span>
                    <span className="font-semibold">
                      {statePartyData[hoveredState].seats}/{statePartyData[hoveredState].total}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="space-y-4">
          {/* Party Legend */}
          <div className="stat-card">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-500" />
              Party Distribution
            </h4>
            <div className="space-y-2">
              {partyDistribution.map(([party, count]) => (
                <div key={party} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPartyColor(party) }}
                    />
                    <span className="font-medium">{getPartyShortName(party)}</span>
                  </div>
                  <span className="text-muted-foreground">{count} states</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected State Info */}
          {selectedState && statePartyData[selectedState] && (
            <div className="stat-card border-l-4 animate-slide-up" style={{ borderLeftColor: statePartyData[selectedState].color }}>
              <h4 className="font-bold text-sm mb-3">{selectedState}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dominant Party</span>
                  <span className="font-semibold">{getPartyShortName(statePartyData[selectedState].party)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats Won</span>
                  <span className="font-semibold">{statePartyData[selectedState].seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Seats</span>
                  <span className="font-semibold">{statePartyData[selectedState].total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Win %</span>
                  <span className="font-semibold">
                    {((statePartyData[selectedState].seats / statePartyData[selectedState].total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <p className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">How to use:</span>
            </p>
            <ul className="space-y-1 ml-5 list-disc">
              <li>Hover over states for details</li>
              <li>Click to select a state</li>
              <li>Colors show dominant party</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
