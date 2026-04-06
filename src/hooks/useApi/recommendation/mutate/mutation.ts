import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { cacheKey } from '@/utils/cache';

export function useRefreshRecommendationCache() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Recommendation.RefreshCache(),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.recommendation.daily() });
      const previousDaily = ns.queryClient.getQueryData(cacheKey.recommendation.daily());
      return { previousDaily };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousDaily) {
        ns.queryClient.setQueryData(cacheKey.recommendation.daily(), context.previousDaily);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.recommendation.refresh.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.recommendation.daily() });
      ns.queryClient.invalidateQueries({ queryKey: ['recommendation', 'list'] });
    },
  });
}
