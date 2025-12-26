import { ThemeProvider } from '@/contexts/ThemeContext';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
};

export default Index;
