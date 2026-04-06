import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { GenerateSnapshotBody } from '@/types/res/snapshot.res';
import { cacheKey } from '@/utils/cache';

export function useGenerateSnapshot() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload?: GenerateSnapshotBody) => Api.Snapshot.Generate(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: ['snapshot'] });
      const previousCurrent = ns.queryClient.getQueryData(cacheKey.snapshot.current());
      const previousHistory = ns.queryClient.getQueryData(cacheKey.snapshot.history());
      return { previousCurrent, previousHistory };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousCurrent) {
        ns.queryClient.setQueryData(cacheKey.snapshot.current(), context.previousCurrent);
      }
      if (context?.previousHistory) {
        ns.queryClient.setQueryData(cacheKey.snapshot.history(), context.previousHistory);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.snapshot.generate.rollback'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['snapshot'] });
      ns.queryClient.invalidateQueries({ queryKey: ['scoring'] });
      ns.queryClient.invalidateQueries({ queryKey: ['insight'] });
      ns.queryClient.invalidateQueries({ queryKey: ['recommendation'] });
    },
  });
}

export function useRefreshSnapshotCache() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Snapshot.RefreshCache(),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: ['snapshot'] });
      const previousCurrent = ns.queryClient.getQueryData(cacheKey.snapshot.current());
      return { previousCurrent };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousCurrent) {
        ns.queryClient.setQueryData(cacheKey.snapshot.current(), context.previousCurrent);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.snapshot.refresh.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['snapshot'] });
    },
  });
}
