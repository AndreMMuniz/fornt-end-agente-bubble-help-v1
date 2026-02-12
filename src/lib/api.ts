export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  latency?: number;
  context?: string[];
};

// Calls our own Next.js API route which proxies to the backend
// This avoids CORS issues and provides better error handling
export async function sendMessage(
  message: string,
  threadId: string,
  userId: string
): Promise<Message> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      thread_id: threadId,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Falha ao enviar mensagem ao Agente');
  }

  const data = await response.json();

  return {
    id: Math.random().toString(36).substring(7),
    role: 'assistant',
    content: data.response,
    timestamp: Date.now(),
    latency: data.latency,
    context: data.context,
  };
}
