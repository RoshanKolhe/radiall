// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetToolDepartments() {
  const URL = endpoints.toolDepartment.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshToolDepartments = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    ToolDepartments: data || [],
    ToolDepartmentsLoading: isLoading,
    ToolDepartmentsError: error,
    ToolDepartmentsValidating: isValidating,
    ToolDepartmentsEmpty: !isLoading && !data?.length,
    refreshToolDepartments, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetToolDepartment(departmentId) {
  const URL = departmentId ? [endpoints.toolDepartment.details(departmentId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      toolDepartment: data,
      toolDepartmentLoading: isLoading,
      toolDepartmentError: error,
      toolDepartmentValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetToolDepartmentsWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.toolDepartment.filterList(filter);
  } else {
    URL = endpoints.toolDepartment.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterToolDepartments = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredToolDepartments: data || [],
    filteredToolDepartmentsLoading: isLoading,
    filteredToolDepartmentsError: error,
    filteredToolDepartmentsValidating: isValidating,
    filteredToolDepartmentsEmpty: !isLoading && !data?.length,
    refreshFilterToolDepartments, // Include the refresh function separately
  };
}

export function useGetDashboardCounts() {
  const URL = endpoints.toolDepartment.getDashboradCounts;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshDashboardCounts = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    dashboardCounts: data || [],
    isLoading,
    error,
    isValidating,
    refreshDashboardCounts,
  };
}
