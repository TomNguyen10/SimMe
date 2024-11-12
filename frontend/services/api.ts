export async function generateResponse(prompt: string): Promise<string> {
  try {
    const res = await fetch("http://127.0.0.1:8000/custom_generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "llama3.1", prompt, stream: false }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch response from the server.");
    }

    const data = await res.json();
    console.log("Backend response data:", data); // Debugging: log entire response data
    return data.result; // Extract 'result' instead of 'response'
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "Error: Unable to fetch response.";
  }
}
