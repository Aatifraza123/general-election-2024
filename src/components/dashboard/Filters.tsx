import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FiltersProps {
  states: string[];
  parties: string[];
  selectedState: string;
  selectedParty: string;
  onStateChange: (state: string) => void;
  onPartyChange: (party: string) => void;
  onClear: () => void;
}

export function Filters({
  states,
  parties,
  selectedState,
  selectedParty,
  onStateChange,
  onPartyChange,
  onClear,
}: FiltersProps) {
  const hasFilters = selectedState !== 'all' || selectedParty !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 glass-card">
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      
      <Select value={selectedState} onValueChange={onStateChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {states.map(state => (
            <SelectItem key={state} value={state}>{state}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedParty} onValueChange={onPartyChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Party" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Parties</SelectItem>
          {parties.slice(0, 20).map(party => (
            <SelectItem key={party} value={party}>{party}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
