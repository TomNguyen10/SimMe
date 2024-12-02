import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { transcribeAudio } from "../../services/api";

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setRealtimeTranscript(transcript);
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await sendAudioForTranscription(audioBlob);
      };

      mediaRecorderRef.current.start();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);
  };

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    try {
      console.log("Sending audio blob for transcription...");
      const transcription = await transcribeAudio(audioBlob);
      console.log("Transcription received:", transcription);
      onTranscription(transcription);
    } catch (error) {
      console.error("Error during backend transcription:", error);

      if (realtimeTranscript.trim()) {
        console.log("Using real-time transcript as fallback.");
        onTranscription(realtimeTranscript.trim());
      } else {
        console.log("No transcription available.");
      }
    }
  };

  return (
    <div>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className={`${isRecording ? "bg-red-600" : "bg-blue-600"} text-white`}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isRecording && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p>Real-time transcript:</p>
          <p>{realtimeTranscript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
