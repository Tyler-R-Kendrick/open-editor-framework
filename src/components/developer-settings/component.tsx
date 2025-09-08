/* global HTMLPreElement, WebSocket, location */
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

export interface DeveloperSettingsProps {
  initialEnv?: Record<string, string>;
}

export default function DeveloperSettings({
  initialEnv
}: DeveloperSettingsProps) {
  const [envVars, setEnvVars] = useState<Record<string, string>>(() => {
    if (initialEnv) return initialEnv;
    const source = (process.env ?? {}) as Record<string, string>;
    const entries = Object.entries(source).filter(
      ([_, value]) => typeof value === 'string'
    ) as [string, string][];
    return Object.fromEntries(entries);
  });

  const handleEnvChange = (key: string, value: string) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }));
  };

  const outputRef = useRef<HTMLPreElement>(null);
  const [command, setCommand] = useState('');
  const wsUrl =
    (process.env.VITE_TERMINAL_WS_URL as string | undefined) ||
    `ws://${location.host}/api/terminal`;
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      if (outputRef.current) {
        outputRef.current.textContent += `\n${event.data}`;
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    };
    return () => ws.close();
  }, [wsUrl]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      wsRef.current?.send(command);
      setCommand('');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <section>
        <h2 className="text-lg font-bold mb-2">Environment Variables</h2>
        <form className="flex flex-col gap-2">
          {Object.entries(envVars).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <span className="w-32" aria-hidden="true">
                {key}
              </span>
              <input
                aria-label={key}
                className="flex-1 border p-1 rounded"
                value={value}
                onChange={(e) => handleEnvChange(key, e.target.value)}
              />
            </label>
          ))}
        </form>
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">Terminal</h2>
        <pre
          ref={outputRef}
          aria-label="terminal-output"
          className="h-48 overflow-auto bg-black text-green-300 p-2 rounded"
        />
        <input
          aria-label="terminal-input"
          className="w-full border p-1 mt-2 rounded"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </section>
    </div>
  );
}
