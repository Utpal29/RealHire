import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function getGroqCompletion(messages: ChatMessage[]) {
  return groq.chat.completions.create({
    messages,
    model: "llama-3.1-8b-instant",
    temperature: 0.5,
    max_tokens: 4096,
    top_p: 1,
    stream: false,
  });
}
