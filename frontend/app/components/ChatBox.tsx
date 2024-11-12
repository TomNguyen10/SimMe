"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { generateResponse } from "../../services/api";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

const ChatBox: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const newMessage: Message = { id: Date.now(), type: "user", text: prompt };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const responseText = await generateResponse(prompt);
      console.log("Received response text:", responseText); // Debugging: log response text

      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      console.log("Updated messages array:", messages); // Debugging: check messages array
    } catch (err) {
      console.error("Failed to get a response:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto space-y-4 p-4 bg-white shadow-md">
      <CardHeader className="text-xl font-bold text-center">
        Chat with LLM
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
      </CardContent>

      <CardFooter className="flex items-center space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message"
          className="flex-grow"
        />
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
