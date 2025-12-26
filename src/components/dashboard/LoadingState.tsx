import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">Loading Election Data</h3>
        <p className="text-muted-foreground text-sm">Analyzing 543 constituencies...</p>
      </div>
    </div>
  );
}
