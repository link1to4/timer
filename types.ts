export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED', // Used as a temporary state if needed, but primarily IDLE/RUNNING for stopwatch
}

export interface TimeLog {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface TimerState {
  status: TimerStatus;
  currentStartTime: number | null; // When the current running session started
  logs: TimeLog[]; // History of completed intervals
  label: string; // Label for the current/next session
  lastUpdated: number; // Timestamp for sync conflict resolution
}

export interface TimerAction {
  type: 'START' | 'STOP' | 'RESET' | 'SET_LABEL' | 'SYNC';
  payload?: Partial<TimerState>;
}

export interface AISuggestion {
  label: string;
}