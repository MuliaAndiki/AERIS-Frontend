import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import {
  EnvironmentCreateReviewPayload,
  EnvironmentUpdateReviewPayload,
} from '@/types/res/environment.res';
import { cacheKey } from '@/utils/cache';

export function useCreateGreenSpaceReview() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: EnvironmentCreateReviewPayload) =>
      Api.Environment.CreateGreenSpaceReview(payload),
    onMutate: async (newData) => {
      await ns.queryClient.cancelQueries({
        queryKey: cacheKey.environment.greenSpaceReviews(newData.greenAreaId),
      });
      const previousData = ns.queryClient.getQueryData(
        cacheKey.environment.greenSpaceReviews(newData.greenAreaId)
      );
      return { previousData, greenAreaId: newData.greenAreaId };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData && context.greenAreaId) {
        ns.queryClient.setQueryData(
          cacheKey.environment.greenSpaceReviews(context.greenAreaId),
          context.previousData
        );
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.environment.greenSpace.review.create.failed'),
        icon: 'error',
      });
    },
    onSettled: (_data, _error, variables) => {
      ns.queryClient.invalidateQueries({
        queryKey: cacheKey.environment.greenSpaceReviews(variables.greenAreaId),
      });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.greenSpace() });
    },
  });
}

export function useUpdateGreenSpaceReview() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: EnvironmentUpdateReviewPayload;
    }) => Api.Environment.UpdateGreenSpaceReview(reviewId, payload),
    onError: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.environment.greenSpace.review.update.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['environment', 'green-space', 'reviews'] });
    },
  });
}

export function useDeleteGreenSpaceReview() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (reviewId: string) => Api.Environment.DeleteGreenSpaceReview(reviewId),
    onError: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.environment.greenSpace.review.delete.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: ['environment', 'green-space', 'reviews'] });
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.environment.greenSpace() });
    },
  });
}
