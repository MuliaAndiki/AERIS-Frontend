import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { ScorePreviewBody } from '@/types/res/scoring.res';
import { cacheKey } from '@/utils/cache';

export function usePreviewScore() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: ScorePreviewBody) => Api.Scoring.Preview(payload),
    onMutate: async (newData) => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.scoring.preview() });
      const previousData = ns.queryClient.getQueryData(cacheKey.scoring.preview());
      ns.queryClient.setQueryData(cacheKey.scoring.preview(), newData);
      return { previousData };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        ns.queryClient.setQueryData(cacheKey.scoring.preview(), context.previousData);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.scoring.preview.rollback'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.scoring.preview() });
    },
  });
}

export function useRefreshScoreCache() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Scoring.RefreshCache(),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: ['scoring'] });
      const previousSummary = ns.queryClient.getQueryData(cacheKey.scoring.summary());
      const previousDetail = ns.queryClient.getQueryData(cacheKey.scoring.detail());
      return { previousSummary, previousDetail };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSummary) {
        ns.queryClient.setQueryData(cacheKey.scoring.summary(), context.previousSummary);
      }
      if (context?.previousDetail) {
        ns.queryClient.setQueryData(cacheKey.scoring.detail(), context.previousDetail);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.scoring.refresh.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['scoring'] });
    },
  });
}
