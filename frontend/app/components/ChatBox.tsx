"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { generateResponse } from "../../services/api";
import AudioRecorder from "./AudioRecorder";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

interface ChatBoxProps {
  isLoggedIn: boolean;
  username: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isLoggedIn, username }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      sendInitialMessage();
    }
  }, [isLoggedIn]);

  const sendInitialMessage = async () => {
    const initialMessage = `Hello, it's ${username}`;
    try {
      setLoading(true);
      const responseText = await generateResponse(
        initialMessage,
        isLoggedIn,
        username
      );

      setMessages([
        { id: Date.now(), type: "user", text: initialMessage },
        { id: Date.now() + 1, type: "bot", text: responseText },
      ]);
    } catch (err) {
      console.error("Failed to send initial message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const newMessage: Message = { id: Date.now(), type: "user", text: prompt };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const responseText = await generateResponse(prompt, isLoggedIn, username);
      console.log("Received response text:", responseText);

      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      console.log("Updated messages array:", messages);
    } catch (err) {
      console.error("Failed to get a response:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    setPrompt(transcript);
  };

  return (
    <Card className="max-w-lg mx-auto space-y-4 p-4 bg-white shadow-md">
      <CardHeader className="text-xl font-bold text-center">
        Chat with Tom
      </CardHeader>

      <CardContent className="overflow-y-auto max-h-80 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.type === "user" ? "text-right" : "text-left"
            }`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}>
              {message.text}
            </div>
          </div>
        ))}
        {prompt && (
          <div className="text-right">
            <div className="inline-block p-2 rounded-lg bg-blue-200 text-black">
              {prompt}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message"
          className="flex-grow"
        />
        <AudioRecorder onTranscript={handleTranscript} />
        <Button
          onClick={handleSendMessage}
          disabled={loading}
          className="bg-blue-600 text-white">
          {loading ? "Sending..." : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
