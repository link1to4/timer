import { TimerState, TimerStatus } from './types';

export const BROADCAST_CHANNEL_NAME = 'sync-smart-timer-v1';
export const STORAGE_KEY = 'sync-smart-timer-state';

export const DEFAULT_TIMER_STATE: TimerState = {
  status: TimerStatus.IDLE,
  currentStartTime: null,
  logs: [],
  label: 'Work Session',
  lastUpdated: Date.now(),
};