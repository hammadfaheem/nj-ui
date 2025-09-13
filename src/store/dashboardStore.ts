import { create } from 'zustand';
import { format, subDays } from 'date-fns';
import type { DateRange } from '../types/api';

interface DashboardState {
  dateRange: DateRange;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  setDateRange: (range: DateRange) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dateRange: {
    start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
  },
  isLoading: false,
  error: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  setDateRange: (range) => set({ dateRange: range }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },
}));