import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDashboardOverview } from '../api/useDashboardOverview';
import { OverviewCards } from './OverviewCards';

vi.mock('../api/useDashboardOverview', () => ({
  useDashboardOverview: vi.fn(),
}));

const mockedUseDashboardOverview = vi.mocked(useDashboardOverview);

describe('OverviewCards', () => {
  it('renders skeleton placeholders while loading', () => {
    mockedUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useDashboardOverview>);

    const { container } = render(<OverviewCards />);

    expect(container.querySelectorAll('.animate-skeleton')).toHaveLength(4);
  });

  it('renders an error message when the query fails', () => {
    mockedUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useDashboardOverview>);

    render(<OverviewCards />);

    expect(screen.getByText('Could not load overview data.')).toBeInTheDocument();
  });

  it('renders the overview stats once data has loaded', () => {
    mockedUseDashboardOverview.mockReturnValue({
      data: {
        deliveriesToday: 12,
        activeDrivers: 3,
        totalDistanceKm: 45.6,
        lateDeliveries: 2,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useDashboardOverview>);

    render(<OverviewCards />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('45.6 km')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
