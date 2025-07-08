import { useEffect, useRef, useState } from "react";

export type VoiceCommand = {
  phrase: string;
  action: () => void;
};

export function useVoiceNavigation(commands: VoiceCommand[], enabled: boolean) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [lastTranscript, setLastTranscript] = useState("");

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setLastTranscript(transcript);
      for (const cmd of commands) {
        if (transcript.includes(cmd.phrase.toLowerCase())) {
          cmd.action();
          break;
        }
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, commands]);

  function start() {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  }
  function stop() {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  return { listening, start, stop, lastTranscript };
}
