import { useMemo, useRef, useState } from "react";
import { sendMessage as sendChatbotMessage } from "../api/chatbotApi";

export const DEFAULT_INITIAL_MESSAGE =
  "Hello! I'm your AI medical assistant. I can help explain medical terms and test-related questions. How can I assist you today?";

export function useChatbotConversation(initialBotMessage = DEFAULT_INITIAL_MESSAGE) {
  const [messages, setMessages] = useState([{ id: 1, role: "bot", text: initialBotMessage }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesContainerRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const scrollMessagesToBottom = () => {
    const node = messagesContainerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  };

  const sendMessage = async (rawMessage) => {
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = { id: Date.now(), role: "user", text: trimmedMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    window.requestAnimationFrame(scrollMessagesToBottom);

    try {
      const data = await sendChatbotMessage({ message: trimmedMessage });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: data.reply || data.response || "No response received." },
      ]);
      window.requestAnimationFrame(scrollMessagesToBottom);
    } catch (err) {
      setError(err.message || "Unable to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesContainerRef,
    sendMessage,
    handleSubmit,
    canSend,
  };
}
