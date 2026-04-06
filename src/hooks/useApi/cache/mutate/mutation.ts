import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';

export function useRefreshAllCache() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: async () => {
      const [snapshot, scoring, recommendation, insight] = await Promise.all([
        Api.Snapshot.RefreshCache(),
        Api.Scoring.RefreshCache(),
        Api.Recommendation.RefreshCache(),
        Api.Insight.RefreshCache(),
      ]);

      return { snapshot, scoring, recommendation, insight };
    },
    onMutate: async () => {
      await Promise.all([
        ns.queryClient.cancelQueries({ queryKey: ['snapshot'] }),
        ns.queryClient.cancelQueries({ queryKey: ['scoring'] }),
        ns.queryClient.cancelQueries({ queryKey: ['recommendation'] }),
        ns.queryClient.cancelQueries({ queryKey: ['insight'] }),
      ]);
    },
    onError: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.cache.refresh.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['snapshot'] });
      ns.queryClient.invalidateQueries({ queryKey: ['scoring'] });
      ns.queryClient.invalidateQueries({ queryKey: ['recommendation'] });
      ns.queryClient.invalidateQueries({ queryKey: ['insight'] });
      ns.queryClient.invalidateQueries({ queryKey: ['environment'] });
    },
  });
}
