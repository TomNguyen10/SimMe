import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch("http://127.0.0.1:8000/custom_generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1",
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ response: data.response });
}
