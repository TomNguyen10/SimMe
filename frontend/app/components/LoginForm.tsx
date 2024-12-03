import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isVisible,
  onToggle,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <Button onClick={onToggle} className="w-full mb-2">
        {isVisible ? "Hide Login" : "Show Login"}
      </Button>
      {isVisible && (
        <Card>
          <CardHeader className="text-xl font-bold text-center">
            Login
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-blue-600 text-white">
                Log In
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default LoginForm;
