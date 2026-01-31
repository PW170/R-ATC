import { IWindow } from '../types';

export const speakText = (text: string) => {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech to prioritize the new alert
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Try to find a professional sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // ATC style: slightly faster, slightly higher pitch for radio effect
  utterance.rate = 1.1;
  utterance.pitch = 1.05;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};

export class SpeechRecognizer {
  private recognition: any;
  private isListening: boolean = false;
  private onResultCallback: (text: string, isFinal: boolean) => void;
  private onErrorCallback?: (error: string) => void;

  constructor(onResult: (text: string, isFinal: boolean) => void, onError?: (error: string) => void) {
    const Win = window as unknown as IWindow;
    const SpeechRecognition = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Keep listening
      this.recognition.interimResults = true; // Enabled for real-time feedback
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.length > 0) {
          console.log("Speech Final:", finalTranscript);
          this.onResultCallback(finalTranscript, true);
        } else if (interimTranscript.length > 0) {
          this.onResultCallback(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn("Speech recognition error details:", event);
        if (this.onErrorCallback) {
          this.onErrorCallback(`Speech Error: ${event.error}`);
        }
        if (event.error === 'not-allowed') {
          this.stop();
        }
      };

      this.recognition.onend = () => {
        console.log("Speech recognition ended. Restarting if active...");
        if (this.isListening) {
          // Restart if it stopped unexpectedly but we want to keep listening
          try {
            this.recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition", e);
          }
        }
      };
    } else {
      console.error("Speech Recognition API not supported in this browser.");
      if (this.onErrorCallback) this.onErrorCallback("Browser does not support Speech Recognition.");
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        console.log("Speech recognition started.");
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      console.log("Speech recognition stopped.");
    }
  }
}