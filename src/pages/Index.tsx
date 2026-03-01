import { useState, useCallback, useRef, useEffect } from "react";
import { Users, RotateCcw, Sun, Moon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebcamDetector from "@/components/WebcamDetector";
import LogsSidebar, { type LogEntry } from "@/components/LogsSidebar";

const Index = () => {
  const [count, setCount] = useState(0);
  const [peak, setPeak] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const lastCountRef = useRef(0);
  const logIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Initialize dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleCountChange = useCallback(
    (newCount: number) => {
      setCount(newCount);

      if (newCount > peak) {
        setPeak(newCount);
      }

      if (newCount !== lastCountRef.current) {
        lastCountRef.current = newCount;
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        logIdRef.current += 1;
        setLogs((prev) => [
          { id: logIdRef.current, time, count: newCount },
          ...prev.slice(0, 99),
        ]);
      }
    },
    [peak]
  );

  const resetPeak = () => {
    setPeak(0);
    setLogs([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold font-mono tracking-tight">
            HeadCount
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content */}
        <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-auto">
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Count */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-live" />
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Live
              </span>
              <span className="text-2xl font-bold font-mono text-foreground tabular-nums">
                {count}
              </span>
            </div>

            {/* Session Peak */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Peak
              </span>
              <span className="text-2xl font-bold font-mono text-primary tabular-nums">
                {peak}
              </span>
            </div>

            {/* Reset */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetPeak}
              className="font-mono text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          {/* Video feed */}
          <div className="flex-1 min-h-0">
            <WebcamDetector onCountChange={handleCountChange} />
          </div>
        </main>

        {/* Sidebar - Logs */}
        <aside
          className={`
            border-l border-border bg-card transition-all duration-300
            ${sidebarOpen ? "w-72" : "w-0 overflow-hidden"}
            hidden md:block
          `}
        >
          <LogsSidebar logs={logs} />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="flex-1 bg-background/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="w-72 bg-card border-l border-border">
              <LogsSidebar logs={logs} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
