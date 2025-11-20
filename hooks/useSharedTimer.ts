import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, TimerStatus, TimeLog } from '../types';
import { BROADCAST_CHANNEL_NAME, STORAGE_KEY, DEFAULT_TIMER_STATE } from '../constants';

// Helper to get initial state from storage
const getInitialState = (): TimerState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse timer state', e);
    }
  }
  return DEFAULT_TIMER_STATE;
};

export const useSharedTimer = () => {
  const [state, setState] = useState<TimerState>(getInitialState);
  const [elapsed, setElapsed] = useState(0); // Visual ticker
  const channelRef = useRef<BroadcastChannel | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Broadcast changes
  const broadcast = useCallback((newState: TimerState) => {
    if (channelRef.current) {
      channelRef.current.postMessage(newState);
    }
  }, []);

  const updateState = useCallback((newState: TimerState) => {
    setState(newState);
    broadcast(newState);
  }, [broadcast]);

  // Initialize Broadcast Channel
  useEffect(() => {
    channelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channelRef.current.onmessage = (event) => {
      const incomingState = event.data as TimerState;
      setState((prev) => {
        if (incomingState.lastUpdated >= prev.lastUpdated) {
          return incomingState;
        }
        return prev;
      });
    };
    return () => {
      channelRef.current?.close();
    };
  }, []);

  // Calculate total accumulated time
  const calculateTotal = useCallback(() => {
    const historicalTotal = state.logs.reduce((acc, log) => acc + log.duration, 0);
    
    if (state.status === TimerStatus.RUNNING && state.currentStartTime) {
      return historicalTotal + (Date.now() - state.currentStartTime);
    }
    return historicalTotal;
  }, [state]);

  // Ticker Effect
  useEffect(() => {
    // Update elapsed time immediately upon state change
    setElapsed(calculateTotal());

    if (state.status === TimerStatus.RUNNING) {
      intervalRef.current = window.setInterval(() => {
        setElapsed(calculateTotal());
      }, 50); // High refresh rate for smooth UI
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status, state.currentStartTime, state.logs, calculateTotal]);

  // Actions
  const start = useCallback(() => {
    if (state.status === TimerStatus.RUNNING) return;
    const now = Date.now();
    
    updateState({
      ...state,
      status: TimerStatus.RUNNING,
      currentStartTime: now,
      lastUpdated: now,
    });
  }, [state, updateState]);

  const stop = useCallback(() => {
    if (state.status !== TimerStatus.RUNNING || !state.currentStartTime) return;
    const now = Date.now();
    
    const newLog: TimeLog = {
      id: crypto.randomUUID(),
      startTime: state.currentStartTime,
      endTime: now,
      duration: now - state.currentStartTime,
    };

    updateState({
      ...state,
      status: TimerStatus.IDLE,
      currentStartTime: null,
      logs: [newLog, ...state.logs],
      lastUpdated: now,
    });
  }, [state, updateState]);

  const reset = useCallback(() => {
    const now = Date.now();
    updateState({
      ...DEFAULT_TIMER_STATE,
      lastUpdated: now,
    });
  }, [updateState]);

  const setLabel = useCallback((label: string) => {
    updateState({
      ...state,
      label,
      lastUpdated: Date.now(),
    });
  }, [state, updateState]);

  return {
    state,
    elapsed, // Exposed for UI display
    start,
    stop,
    reset,
    setLabel,
  };
};