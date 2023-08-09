// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { ChartList, DashboardList, DashboardStatus } from './interface';

export const DashboardApi = createApi({
  reducerPath: 'DashboardApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getDashboards: builder.query<DashboardList, void>({
      query: () => 'superset/list',
    }),
    enableDashboard: builder.mutation<DashboardStatus, string>({
      query: (uid) => ({
        url: `/superset/dashboard/enable-embed`,
        method: 'POST',
        body: { uid },
      }),
    }),
    generateGuestToken: builder.mutation<{ token: string }, string>({
      query: (id) => ({
        url: `/superset/guest/token`,
        method: 'POST',
        body: { id },
      }),
    }),
  }),
});

export const ChartApi = createApi({
  reducerPath: 'ChartApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCharts: builder.query<ChartList, void>({
      query: () => 'superset/list/charts',
    }),
  }),
});

export const {
  useGetDashboardsQuery,
  useEnableDashboardMutation,
  useGenerateGuestTokenMutation,
} = DashboardApi;

export const { useGetChartsQuery } = ChartApi;