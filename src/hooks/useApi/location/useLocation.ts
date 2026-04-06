import { useResolveLocation } from './mutate/mutation';
import { useDetectLocation } from './query/query';

export function useLocationApi() {
  return {
    mutation: {
      resolve: useResolveLocation,
    },
    query: {
      detect: useDetectLocation,
    },
  };
}
