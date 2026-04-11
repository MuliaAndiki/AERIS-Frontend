import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { updateEnvironmentalScore, updateMetric, addAlert } from '@/stores/mapSlice/mapSlice';
import ScoringApi from '@/services/scoring/scoring.service';

interface WebSocketMessage {
  type: 'SCORE_UPDATED' | 'METRIC_UPDATED' | 'ALERT' | 'PING';
  payload?: any;
}

/**
 * Hook for real-time environmental score updates
 * Currently uses polling as fallback. Can be upgraded to actual WebSocket when backend supports it.
 * 
 * Usage:
 * ```tsx
 * useMapWebSocket({
 *   enabled: true,
 *   pollInterval: 30000, // Poll every 30 seconds
 *   onScoreUpdate: (score) => console.log('Score updated:', score)
 * });
 * ```
 */
export function useMapWebSocket({
  enabled = true,
  pollInterval = 30000, // Default: 30 seconds
  onScoreUpdate,
}: {
  enabled?: boolean;
  pollInterval?: number;
  onScoreUpdate?: (score: number) => void;
} = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScoreRef = useRef<number | null>(null);

  // Handle incoming WebSocket message
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'SCORE_UPDATED':
          if (message.payload?.score !== undefined) {
            dispatch(updateEnvironmentalScore(message.payload.score));
            onScoreUpdate?.(message.payload.score);
          }
          break;

        case 'METRIC_UPDATED':
          if (message.payload?.label) {
            dispatch(
              updateMetric({
                label: message.payload.label,
                value: message.payload.value,
                level: message.payload.level,
              })
            );
          }
          break;

        case 'ALERT':
          if (message.payload?.id) {
            dispatch(
              addAlert({
                id: message.payload.id,
                type: message.payload.type || 'info',
                title: message.payload.title,
                description: message.payload.description,
              })
            );
          }
          break;

        case 'PING':
          // Keep-alive message, no action needed
          break;

        default:
          console.warn('Unknown WebSocket message type:', message.type);
      }
    },
    [dispatch, onScoreUpdate]
  );

  // Polling fallback: fetch latest score periodically
  const pollScore = useCallback(async () => {
    try {
      const response = await ScoringApi.Score();
      const currentScore = response.data?.environmentalScore;

      // Only dispatch if score changed
      if (currentScore !== undefined && currentScore !== lastScoreRef.current) {
        lastScoreRef.current = currentScore;
        handleMessage({
          type: 'SCORE_UPDATED',
          payload: { score: currentScore },
        });
      }
    } catch (error) {
      console.error('Failed to poll environmental score:', error);
    }
  }, [handleMessage]);

  // Setup polling
  useEffect(() => {
    if (!enabled) return;

    // Poll immediately on mount
    pollScore();

    // Set up interval
    pollIntervalRef.current = setInterval(pollScore, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [enabled, pollInterval, pollScore]);

  // Return utility functions
  return {
    /**
     * Send a message through WebSocket (when implemented)
     * For now, this is a placeholder
     */
    send: (message: WebSocketMessage) => {
      console.log('[WebSocket] Would send:', message);
      // TODO: Implement actual WebSocket send when backend supports it
    },

    /**
     * Force immediate score poll/refresh
     */
    refresh: pollScore,

    /**
     * Manually handle an incoming message (for testing)
     */
    handleMessage,
  };
}

export type { WebSocketMessage };
