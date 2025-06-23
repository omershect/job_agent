import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '../Api';

export const useJobs = (search, status) =>
  useQuery({
    queryKey: ['jobs', search, status],
    queryFn: () => fetchJobs(search, status),
    staleTime: 60_000,
  });
