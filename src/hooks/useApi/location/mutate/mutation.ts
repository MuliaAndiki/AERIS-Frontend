import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { ResolveLocationBody } from '@/types/schema/location.schema';
import { cacheKey } from '@/utils/cache';

export function useResolveLocation() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: ResolveLocationBody) => Api.Location.Resolve(payload),
    onMutate: async (newData) => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.location.detect() });
      const previousData = ns.queryClient.getQueryData(cacheKey.location.detect());
      ns.queryClient.setQueryData(cacheKey.location.resolve(), newData);
      return { previousData };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        ns.queryClient.setQueryData(cacheKey.location.detect(), context.previousData);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.location.resolve.rollback'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.location.detect() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.raw() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.airQuality() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.weather() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.heatRisk() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.noise() });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.snapshot.current() });
    },
  });
}
