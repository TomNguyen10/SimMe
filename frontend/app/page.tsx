"use client";

import React, { useState, useRef } from "react";
import ChatBox from "./components/ChatBox";
import LoginForm from "./components/LoginForm";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const chatBoxRef = useRef<{ clearChat: () => void } | null>(null);

  const backdoor_name = process.env.NEXT_PUBLIC_BACKDOOR_NAME;
  const backdoor_password = process.env.NEXT_PUBLIC_BACKDOOR_PASSWORD;

  const handleLogin = (enteredUsername: string, enteredPassword: string) => {
    if (
      enteredUsername === backdoor_name &&
      enteredPassword === backdoor_password
    ) {
      setIsLoggedIn(true);
      setUsername(enteredUsername);
      setIsLoginVisible(false);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    if (chatBoxRef.current) {
      chatBoxRef.current.clearChat();
    }
  };

  const toggleLoginForm = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {!isLoggedIn && (
        <LoginForm
          onLogin={handleLogin}
          isVisible={isLoginVisible}
          onToggle={toggleLoginForm}
        />
      )}
      {isLoggedIn && (
        <div className="mb-4">
          Hello John!{" "}
          <Button onClick={handleLogout} className="ml-2 bg-red-600 text-white">
            Logout
          </Button>
        </div>
      )}
      <ChatBox ref={chatBoxRef} isLoggedIn={isLoggedIn} username={username} />
    </main>
  );
}
