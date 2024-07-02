"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "./ui/chat";
import { useClientConfig } from "./ui/chat/hooks/use-config";

export default function ChatSection() {
  const { chatAPI } = useClientConfig();
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    error,
    stop,
    append,
    setInput,
  } = useChat({
    api: chatAPI,
    headers: {
      "Content-Type": "application/json"
    },
    onResponse: (response: Response) => {
      if(!response.ok) {
        throw new Error("Failed to fetch messages");
      }
    },
  });

  return (
    <div className="space-y-4 w-full px-3 lg:px-[10rem]">
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
        append={append}
        error={error?.message || ""}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        messages={messages}
        append={append}
        setInput={setInput}
      />
    </div>
  );
}
