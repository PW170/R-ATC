export interface LogMessage {
  id: string;
  timestamp: Date;
  sender: 'ATC' | 'PILOT' | 'SYSTEM';
  text: string;
}

export interface FlightStatus {
  isStreaming: boolean;
  isThinking: boolean;
  lastUpdate: Date | null;
}

// Web Speech API Types
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}