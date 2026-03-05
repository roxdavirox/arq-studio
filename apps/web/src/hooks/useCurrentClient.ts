import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/api/client'

export const useCurrentClient = () => {
  const query = useQuery({ queryKey: ['me'], queryFn: fetchMe })
  return { client: query.data, isLoading: query.isLoading }
}
