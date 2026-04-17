import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import ScoringApi from '@/services/scoring/scoring.service';
import { addAlert, updateEnvironmentalScore, updateMetric } from '@/stores/mapSlice/mapSlice';
import { AppDispatch } from '@/stores/store';
const POLL_ERROR_LOG_WINDOW_MS = 120000;
function resolveHttpStatus(error: unknown): number | null {
  const status = (error as any)?.response?.status;
  return typeof status === 'number' ? status : null;
}

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
  pollInterval = 60000,
  onScoreUpdate,
}: {
  enabled?: boolean;
  pollInterval?: number;
  onScoreUpdate?: (score: number) => void;
} = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScoreRef = useRef<number | null>(null);
  const lastErrorStatusRef = useRef<number | null>(null);
  const lastErrorLoggedAtRef = useRef<number>(0);

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

      // Reset error log guards after a successful response.
      lastErrorStatusRef.current = null;
      lastErrorLoggedAtRef.current = 0;

      // Only dispatch if score changed
      if (currentScore !== undefined && currentScore !== lastScoreRef.current) {
        lastScoreRef.current = currentScore;
        handleMessage({
          type: 'SCORE_UPDATED',
          payload: { score: currentScore },
        });
      }
    } catch (error) {
      const status = resolveHttpStatus(error);
      const now = Date.now();
      const shouldLog =
        status !== lastErrorStatusRef.current ||
        now - lastErrorLoggedAtRef.current > POLL_ERROR_LOG_WINDOW_MS;

      if (!shouldLog) {
        return;
      }

      lastErrorStatusRef.current = status;
      lastErrorLoggedAtRef.current = now;

      if (status === 500) {
        console.warn(
          '[Map] Score endpoint returned 500. Polling will retry automatically when backend is ready.'
        );
        return;
      }

      if (status === 401 || status === 403) {
        console.warn('[Map] Score polling skipped due to unauthorized session state.');
        return;
      }

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
