import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { cacheKey } from '@/utils/cache';

export function useRefreshInsightCache() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Insight.RefreshCache(),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.insight.daily() });
      const previousDaily = ns.queryClient.getQueryData(cacheKey.insight.daily());
      return { previousDaily };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousDaily) {
        ns.queryClient.setQueryData(cacheKey.insight.daily(), context.previousDaily);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.insight.refresh.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.insight.daily() });
      ns.queryClient.invalidateQueries({ queryKey: ['insight', 'list'] });
    },
  });
}
