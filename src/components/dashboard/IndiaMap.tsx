import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Key, AlertCircle } from 'lucide-react';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { StateStats } from '@/types/election';

// India GeoJSON - simplified state boundaries
const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

// State name mapping (GeoJSON names to our data names)
const STATE_NAME_MAP: { [key: string]: string } = {
  'Andaman and Nicobar': 'Andaman & Nicobar Islands',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Assam': 'Assam',
  'Bihar': 'Bihar',
  'Chandigarh': 'Chandigarh',
  'Chhattisgarh': 'Chhattisgarh',
  'Dadra and Nagar Haveli': 'Dadra & Nagar Haveli and Daman & Diu',
  'Daman and Diu': 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi': 'NCT Of Delhi',
  'Goa': 'Goa',
  'Gujarat': 'Gujarat',
  'Haryana': 'Haryana',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Jammu and Kashmir': 'Jammu & Kashmir',
  'Jharkhand': 'Jharkhand',
  'Karnataka': 'Karnataka',
  'Kerala': 'Kerala',
  'Lakshadweep': 'Lakshadweep',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Maharashtra': 'Maharashtra',
  'Manipur': 'Manipur',
  'Meghalaya': 'Meghalaya',
  'Mizoram': 'Mizoram',
  'Nagaland': 'Nagaland',
  'Odisha': 'Odisha',
  'Puducherry': 'Puducherry',
  'Punjab': 'Punjab',
  'Rajasthan': 'Rajasthan',
  'Sikkim': 'Sikkim',
  'Tamil Nadu': 'Tamil Nadu',
  'Telangana': 'Telangana',
  'Tripura': 'Tripura',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Uttarakhand': 'Uttaranchal',
  'West Bengal': 'West Bengal',
  'Andhra Pradesh': 'Andhra Pradesh',
  'Ladakh': 'Ladakh',
};

interface IndiaMapProps {
  stateStats: StateStats[];
  onStateClick?: (state: string) => void;
}

export function IndiaMap({ stateStats, onStateClick }: IndiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => localStorage.getItem('mapbox_token') || '');
  const [tokenInput, setTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Calculate dominant party per state
  const stateDominantParty = useMemo(() => {
    const result: { [state: string]: { party: string; seats: number; total: number } } = {};
    
    stateStats.forEach(state => {
      const parties = Object.entries(state.parties);
      if (parties.length > 0) {
        const dominant = parties.reduce((a, b) => a[1] > b[1] ? a : b);
        result[state.state] = {
          party: dominant[0],
          seats: dominant[1],
          total: state.totalSeats
        };
      }
    });
    
    return result;
  }, [stateStats]);

  // Load GeoJSON
  useEffect(() => {
    fetch(INDIA_GEOJSON_URL)
      .then(res => res.json())
      .then(data => {
        // Enrich with party data
        data.features = data.features.map((feature: any) => {
          const geoName = feature.properties.NAME_1;
          const dataName = STATE_NAME_MAP[geoName] || geoName;
          const partyData = stateDominantParty[dataName];
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              dataName,
              dominantParty: partyData?.party || 'Unknown',
              partySeats: partyData?.seats || 0,
              totalSeats: partyData?.total || 0,
              partyColor: partyData ? getPartyColor(partyData.party) : 'hsl(220, 10%, 50%)',
            }
          };
        });
        setGeoJsonData(data);
      })
      .catch(console.error);
  }, [stateDominantParty]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !geoJsonData) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [82, 22],
        zoom: 4,
        pitch: 0,
        minZoom: 3,
        maxZoom: 8,
      });

      popup.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'india-map-popup'
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current) return;

        // Add source
        map.current.addSource('india-states', {
          type: 'geojson',
          data: geoJsonData
        });

        // Add fill layer
        map.current.addLayer({
          id: 'states-fill',
          type: 'fill',
          source: 'india-states',
          paint: {
            'fill-color': ['get', 'partyColor'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.9,
              0.7
            ]
          }
        });

        // Add border layer
        map.current.addLayer({
          id: 'states-border',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': 'hsl(220, 20%, 20%)',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              0.5
            ]
          }
        });

        // Hover interaction
        let hoveredStateId: string | number | null = null;

        map.current.on('mousemove', 'states-fill', (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'india-states', id: hoveredStateId },
              { hover: false }
            );
          }

          hoveredStateId = e.features[0].id ?? null;
          
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'india-states', id: hoveredStateId },
              { hover: true }
            );
          }

          const props = e.features[0].properties;
          const stateName = props?.dataName || props?.NAME_1 || 'Unknown';
          const party = props?.dominantParty || 'Unknown';
          const seats = props?.partySeats || 0;
          const total = props?.totalSeats || 0;

          popup.current?.setLngLat(e.lngLat).setHTML(`
            <div class="p-2">
              <h4 class="font-bold text-sm">${stateName}</h4>
              <p class="text-xs mt-1">
                <span class="inline-block w-2 h-2 rounded-full mr-1" style="background: ${props?.partyColor}"></span>
                ${getPartyShortName(party)}: ${seats}/${total} seats
              </p>
            </div>
          `).addTo(map.current!);

          map.current!.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'states-fill', () => {
          if (!map.current) return;
          
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'india-states', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
          popup.current?.remove();
          map.current.getCanvas().style.cursor = '';
        });

        // Click interaction
        map.current.on('click', 'states-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          const stateName = e.features[0].properties?.dataName;
          if (stateName && onStateClick) {
            onStateClick(stateName);
          }
        });

        setIsMapReady(true);
      });

    } catch (error) {
      console.error('Map initialization failed:', error);
      localStorage.removeItem('mapbox_token');
      setMapboxToken('');
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, geoJsonData, onStateClick]);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  if (!mapboxToken) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          State-wise Election Map
        </h3>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Mapbox Token Required</h4>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            To display the interactive India map, please enter your Mapbox public token. 
            You can get one for free at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              placeholder="pk.eyJ1Ijoi..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveToken} disabled={!tokenInput.trim()}>
              Save & Load
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Your token is stored locally in your browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          State-wise Election Map
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { 
            localStorage.removeItem('mapbox_token'); 
            setMapboxToken(''); 
          }}
          className="text-muted-foreground text-xs"
        >
          Reset Token
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        States colored by dominant winning party. Hover for details, click to explore.
      </p>
      
      <div className="relative h-[500px] rounded-lg overflow-hidden border border-border">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="animate-pulse text-muted-foreground">Loading map...</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(
          stateStats.reduce((acc, state) => {
            Object.entries(state.parties).forEach(([party, seats]) => {
              acc[party] = (acc[party] || 0) + seats;
            });
            return acc;
          }, {} as { [key: string]: number })
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([party]) => (
            <div key={party} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getPartyColor(party) }}
              />
              <span className="text-muted-foreground">{getPartyShortName(party)}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
