import { ScrollArea } from "@/components/ui/scroll-area";

export interface LogEntry {
  id: number;
  time: string;
  count: number;
}

interface LogsSidebarProps {
  logs: LogEntry[];
}

const LogsSidebar = ({ logs }: LogsSidebarProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold font-mono tracking-wider uppercase text-muted-foreground">
          Detection Logs
        </h2>
      </div>
      <ScrollArea className="flex-1 px-4 py-2">
        {logs.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono py-4 text-center">
            No detections yet…
          </p>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-1.5 px-2 rounded text-xs font-mono bg-muted/50"
              >
                <span className="text-muted-foreground">{log.time}</span>
                <span className="text-primary font-semibold">
                  {log.count} {log.count === 1 ? "person" : "people"}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LogsSidebar;
