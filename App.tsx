import React, { useMemo } from 'react';
import { useSharedTimer } from './hooks/useSharedTimer';
import TimeDisplay from './components/TimeDisplay';
import TimerCircle from './components/TimerCircle';
import SmartInput from './components/SmartInput';
import { TimerStatus } from './types';

function App() {
  const { state, elapsed, start, stop, reset, setLabel } = useSharedTimer();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatLogTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Group logs by date
  const groupedLogs = useMemo(() => {
    if (state.logs.length === 0) return [];

    const groups: Record<string, { dateTs: number; total: number; logs: typeof state.logs }> = {};

    state.logs.forEach((log) => {
      const date = new Date(log.startTime);
      const key = date.toDateString(); // Key by date string (e.g., "Mon Oct 27 2025")

      if (!groups[key]) {
        groups[key] = {
          dateTs: date.getTime(),
          total: 0,
          logs: [],
        };
      }
      groups[key].logs.push(log);
      groups[key].total += log.duration;
    });

    // Sort groups by date (newest first)
    return Object.values(groups).sort((a, b) => b.dateTs - a.dateTs);
  }, [state.logs]);

  const getGroupLabel = (ts: number) => {
    const date = new Date(ts);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${state.status === TimerStatus.RUNNING ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <h1 className="text-xl font-bold font-sans tracking-tight">SyncSmart Stopwatch</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-surface px-3 py-1 rounded-full border border-white/5">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            <span>Synced</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-stretch justify-center overflow-hidden">
        
        {/* Left: Main Timer */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative border-b md:border-b-0 md:border-r border-white/5">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            
            <div className="mb-8 text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Total Accumulated Time</span>
            </div>

            <div className="relative mb-12">
                <TimerCircle milliseconds={elapsed} status={state.status} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <TimeDisplay milliseconds={elapsed} />
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                {state.status === TimerStatus.RUNNING ? (
                    <button
                        onClick={stop}
                        className="px-8 py-4 bg-surface border border-white/10 rounded-xl hover:border-red-500/50 hover:text-red-400 transition-all active:scale-95 flex items-center gap-2 font-bold text-lg"
                    >
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={start}
                        className="px-8 py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                        Start
                    </button>
                )}
                
                <button
                    onClick={reset}
                    className="p-4 rounded-xl bg-surface border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    title="Reset All"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>

            <SmartInput currentLabel={state.label} onLabelChange={setLabel} disabled={false} />
        </div>

        {/* Right: History/Logs */}
        <div className="w-full md:w-96 bg-black/20 flex flex-col h-[400px] md:h-auto">
            <div className="p-6 border-b border-white/5">
                <h2 className="font-mono font-bold text-gray-400 uppercase text-sm tracking-wider">Session Logs</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {groupedLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-sm">No intervals recorded yet.</p>
                    </div>
                ) : (
                    groupedLogs.map((group) => (
                        <div key={group.dateTs} className="animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="flex justify-between items-center mb-3 px-3 sticky top-0 bg-background/90 backdrop-blur-md py-2 -mx-2 rounded z-10 border-b border-white/5">
                                <h3 className="text-sm font-bold text-gray-300">{getGroupLabel(group.dateTs)}</h3>
                                <span className="text-xs font-mono text-primary font-bold">
                                    Total: {formatTime(group.total)}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {group.logs.map((log) => (
                                    <div key={log.id} className="bg-surface border border-white/5 rounded-lg p-3 flex items-center justify-between hover:border-white/10 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-mono">{formatLogTime(log.startTime)} - {formatLogTime(log.endTime)}</span>
                                        </div>
                                        <div className="font-mono font-bold text-white/80 text-sm">
                                            + {formatTime(log.duration)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-white/5 bg-surface/50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Total Sessions</span>
                    <span className="font-bold">{state.logs.length}</span>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;