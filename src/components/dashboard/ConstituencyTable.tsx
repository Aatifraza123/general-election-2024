import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PartyBadge } from './PartyBadge';
import { formatNumber } from '@/lib/analytics';
import type { ConstituencyResult } from '@/types/election';

interface ConstituencyTableProps {
  data: ConstituencyResult[];
  title: string;
}

type SortKey = 'constituency' | 'leadingParty' | 'margin';
type SortOrder = 'asc' | 'desc';

export function ConstituencyTable({ data, title }: ConstituencyTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('margin');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    let filtered = data.filter(item => 
      item.constituency.toLowerCase().includes(search.toLowerCase()) ||
      item.leadingParty.toLowerCase().includes(search.toLowerCase()) ||
      item.leadingCandidate.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'constituency') {
        comparison = a.constituency.localeCompare(b.constituency);
      } else if (sortKey === 'leadingParty') {
        comparison = a.leadingParty.localeCompare(b.leadingParty);
      } else {
        comparison = a.margin - b.margin;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data, search, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const handleExport = () => {
    const csv = [
      ['Constituency', 'Winner', 'Party', 'Runner-up', 'Runner-up Party', 'Margin'],
      ...filteredData.map(row => [
        row.constituency,
        row.leadingCandidate,
        row.leadingParty,
        row.trailingCandidate,
        row.trailingParty,
        row.margin.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constituency_results.csv';
    a.click();
  };

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search constituencies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('constituency')}
              >
                Constituency <SortIcon columnKey="constituency" />
              </th>
              <th>Winner</th>
              <th 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('leadingParty')}
              >
                Party <SortIcon columnKey="leadingParty" />
              </th>
              <th>Runner-up</th>
              <th 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('margin')}
              >
                Margin <SortIcon columnKey="margin" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                <td className="font-medium">{row.constituency}</td>
                <td className="max-w-[150px] truncate" title={row.leadingCandidate}>
                  {row.leadingCandidate}
                </td>
                <td>
                  <PartyBadge party={row.leadingParty} />
                </td>
                <td className="max-w-[150px] truncate text-muted-foreground" title={row.trailingCandidate}>
                  {row.trailingCandidate}
                </td>
                <td className="font-mono font-medium text-right">
                  {formatNumber(row.margin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
