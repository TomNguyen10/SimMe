import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  onTranscript: (transcript: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    initializeSpeechRecognition();
  }, []);

  const initializeSpeechRecognition = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        onTranscript(transcript);
      };

      setRecognition(recognitionInstance);
    } else {
      console.log("Speech recognition not supported");
    }
  };

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      className={`${isRecording ? "bg-red-600" : "bg-green-600"} text-white`}>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
};

export default AudioRecorder;
