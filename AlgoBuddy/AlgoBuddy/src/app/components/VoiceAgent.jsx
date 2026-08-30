"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";

export default function VoiceAgent() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleCommand(command);
    };

    recognition.start();
  };

  const handleCommand = (command) => {
    if (command.includes("stack")) {
      router.push("/visualizer/stack");
    } else if (command.includes("queue")) {
      router.push("/visualizer/queue");
    } else if (command.includes("home")) {
      router.push("/");
    } else if (command.includes("sort")) {
      router.push("/visualizer/sorting");
    } else {
      alert(`Command not recognized: "${command}"`);
    }
  };

  return (
    <button
      onClick={startListening}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
      aria-label="Voice Assistant"
    >
      {isListening ? <Mic className="animate-pulse" size={24} /> : <MicOff size={24} />}
    </button>
  );
}