import { Check, Copy } from "lucide-react";
import { Message } from "ai";
import { Fragment } from "react";
import { Button } from "../../button";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import {
  MessageAnnotation
} from "../index";
import ChatAvatar from "./chat-avatar";
import Markdown from "./markdown";

type ContentDisplayConfig = {
  order: number;
  component: JSX.Element | null;
};

function ChatMessageContent({
  message
}: {
  message: Message;
  isLoading: boolean;
}) {
  const annotations = message.annotations as MessageAnnotation[] | undefined;
  if (!annotations?.length) return <Markdown content={message.content} />;
  const contents: ContentDisplayConfig[] = [
    {
      order: 0,
      component: <Markdown content={message.content} />,
    },
  ];

  return (
    <div className="flex-1 gap-4 flex flex-col">
      {contents
        .sort((a, b) => a.order - b.order)
        .map((content, index) => (
          <Fragment key={index}>{content.component}</Fragment>
        ))}
    </div>
  );
}

export default function ChatMessage({
  chatMessage,
  isLoading,
}: {
  chatMessage: Message;
  isLoading: boolean;
}) {

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  return (
    
    <div className="flex items-start gap-4 pt-5">
      <ChatAvatar role={chatMessage.role} />
      
      <div className="group flex flex-1 justify-between gap-2">
      {chatMessage.role === "user" ? (
      <div className="bg-green-500/10 py-2 px-2 rounded-lg text-sm">
        <ChatMessageContent message={chatMessage} isLoading={isLoading} />
      </div>
    ) : (
      
      <div className="text-sm">
        <ChatMessageContent message={chatMessage} isLoading={isLoading} />
      </div>
      
       )}
        <Button
          onClick={() => copyToClipboard(chatMessage.content)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}


