import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';

interface LogTerminalProps {
  logs: LogMessage[];
  onSendRequest?: (text: string) => void;
}

const LogTerminal: React.FC<LogTerminalProps> = ({ logs, onSendRequest }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const [inputText, setInputText] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputText.trim()) {
      onSendRequest?.(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-aviation-900 border border-aviation-700 rounded-lg overflow-hidden font-sans text-sm shadow-inner">
      <div className="bg-aviation-800 px-4 py-2 border-b border-aviation-700 flex justify-between items-center">
        <span className="text-aviation-500 font-bold tracking-wider">COMMS LOG</span>
        <span className="text-xs text-aviation-700">FREQ 118.500</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logs.length === 0 && (
          <div className="text-gray-600 italic text-center mt-10">Waiting for transmission...</div>
        )}

        {logs.map((log) => (
          <div key={log.id} className={`flex flex-col ${log.sender === 'ATC' ? 'items-start' : log.sender === 'PILOT' ? 'items-end' : 'items-center'}`}>
            <div className={`max-w-[85%] rounded px-3 py-2 ${log.sender === 'ATC'
              ? 'bg-aviation-700/50 text-aviation-accent border-l-2 border-aviation-accent'
              : log.sender === 'PILOT'
                ? 'bg-aviation-700/30 text-emerald-400 border-r-2 border-emerald-500'
                : 'text-gray-500 text-xs italic'
              }`}>
              {log.sender !== 'SYSTEM' && (
                <div className="text-[10px] opacity-50 mb-1 uppercase tracking-wider flex justify-between gap-4">
                  <span>{log.sender}</span>
                  <span>{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              )}
              <p className="leading-relaxed whitespace-pre-wrap">{log.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-aviation-700 bg-aviation-800/50">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type transmission..."
          className="w-full bg-black/50 border border-aviation-700 rounded px-3 py-2 text-white focus:border-aviation-500 focus:outline-none placeholder-gray-600 font-mono text-xs"
        />
      </div>
    </div>
  );
};

export default LogTerminal;