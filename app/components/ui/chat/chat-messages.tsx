import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";
import { BsExclamationTriangleFill } from "react-icons/bs";
import BadFeedbackModal from "../bad-request-model";
import { dosaveFeedBacks } from "./hooks/save-feedbacks";

export default function ChatMessages(
  props: Pick<
    ChatHandler,
    "messages" | "isLoading" | "reload" | "stop" | "append" | "error"
  >,
) {
  const [errorMessage, setErrorMessage] = useState<string | null>(props.error);
  const [hasErrorOccurred, setHasErrorOccurred] = useState<boolean>(!!props.error);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("");

  const questionsToStart = "I want to review my claims and status about it, can intergrate medical WCF APIs to my hospital ?, What is the purpose for the establishment of this fund?, How to join and contribute to the fund?";
  const questionsList = questionsToStart.split(", ") || [];
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && (isLastMessageFromAssistant || hasErrorOccurred);
  const showStop = props.stop && props.isLoading;

  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  useEffect(() => {
    if (props.error) {
      setErrorMessage(props.error);
      setHasErrorOccurred(true);
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props.error]);

  useEffect(() => {
    const feedbackInterval = setInterval(() => {
      setShowFeedback(true);
    }, 300000);

    return () => clearInterval(feedbackInterval);
  }, []);

  const handleNegativeFeedback = () => {
    setShowModal(true);
  };

  const handlePositiveFeedback = async () => {
    setShowFeedback(false);
    await dosaveFeedBacks({
      feedback: "good",
      feedback_type: "positive"
    });
  };

  const handleModalSubmit = async (feedback: string) => {
    setShowModal(false);
    setShowFeedback(false);
    await dosaveFeedBacks({
      feedback: feedback,
      feedback_type: "negative"
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowFeedback(false);
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto rounded-xl p-4 shadow-2xl pb-0 flex flex-col h-chat bg-white flex-grow">
      <h2 className="font-bold text-center text-black text-sm lg:text-lg shadow-lg py-2">
        AI - POWERED WCF CHAT SYSTEM
      </h2>

      {props.messages.length > 0 ? null : (
        <div className="text-neutral-600 py-4 overflow-scroll text-sm flex flex-col gap-main">
          <div>
            Welcome to WCF-CHAT. A 24/7 available system to assist you on every problem you have about WCF.
          </div>
          <span>This might be :</span>
          <div className="mb-3 lg:mb-1">
            <ul className="list-disc pl-10">
              <li>
                WCF Services, Products, Payments, Complaints, Suggestions,
                technical assistance, or upload any wcf doc to get more
                explanation, etc...
              </li>
            </ul>
          </div>
          <span>You can start with :</span>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {questionsList.map((question, i) => (
              <button
                key={i}
                onClick={() =>
                  props.append!({ role: "user", content: question })
                }
                className="lg:p-5 p-2 text-black border text-sm lg:items-center rounded-lg shadow-sm bg-green-200 hover:bg-green-100 transition-colors whitespace-normal lg:text-center"
              >
                {question}
              </button>
            ))}
          </div>

          <span>OR simply type your message to get started :</span>
        </div>
      )}

      <div
        className="flex-1 w-full p-4 relative overflow-scroll"
        ref={scrollableChatContainerRef}
      >
        <div className="flex flex-col gap-5">
          {props.messages.map((m, i) => {
            const isLoadingMessage = i === messageLength - 1 && props.isLoading;
            return (
              <ChatMessage
                key={m.id}
                chatMessage={m}
                isLoading={isLoadingMessage}
              />
            );
          })}
          {isPending && (
            <div className="flex justify-center items-center pt-10">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center p-3 lg:p-4 gap-1">
        <div className="flex gap-2">
          {props.messages.length > 0 && !errorMessage && showFeedback && (
            <div className="flex gap-1">
              <span className="text-sm items-center justify-center mt-1.5">
                Your feedback
              </span>

              <span
                className="rounded-lg hover:bg-black/30 p-[0.1rem] flex lg:h-[26px] lg:w-[26px] h-[22px] w-[22px] mt-1.5 items-center justify-center"
                onClick={handleNegativeFeedback}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-md-heavy">
                  <path fill="black" d="M11.408 21.496a.99.99 0 0 1-1.06.485c-1.91-.384-3.073-2.342-2.5-4.212L8.697 15H6.986c-2.627 0-4.534-2.507-3.843-5.052l1.358-5A3.986 3.986 0 0 1 8.344 2h5.689a1.996 1.996 0 0 1 1.988 2v11h-.338a1 1 0 0 0-.865.504zM18.012 15A2.994 2.994 0 0 0 21 12V5c0-1.657-1.338-3-2.988-3h-.533c.34.588.533 1.271.533 2z"></path>
                </svg>
              </span>
              
              <span
                className="rounded-lg hover:bg-blue-500/30 p-[0.1rem] flex lg:h-[26px] lg:w-[26px] h-[22px] w-[22px] items-center justify-center"
                onClick={handlePositiveFeedback}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-md-heavy">
                  <path fill="blue" d="M12.592 2.504a.99.99 0 0 1 1.06-.485c1.91.384 3.073 2.342 2.5 4.212L15.303 9h1.711c2.627 0 4.534 2.507 3.843 5.052l-1.358 5A3.986 3.986 0 0 1 15.656 22h-5.689a1.996 1.996 0 0 1-1.988-2v-11h.338a1 1 0 0 0 .865-.504zM5.988 9A2.994 2.994 0 0 1 3 12v7c0 1.657 1.338 3 2.988 3h.533c-.34-.588-.533-1.271-.533-2z"></path>
                </svg>
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 text-center">
          {errorMessage && (
            <div className="bg-red-500/40 lg:p-3 p-1 rounded-md flex items-center justify-center gap-x-2 text-sm text-red-500 lg:w-1/2 mx-auto">
              <BsExclamationTriangleFill className="w-4 h-4" />
              <p>An unexpected error occurred. Try again later</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <ChatActions
            reload={props.reload}
            stop={props.stop}
            showReload={showReload}
            showStop={showStop}
          />
        </div>
      </div>

      {showModal && (
        <BadFeedbackModal onSubmit={handleModalSubmit} onCancel={handleCancel}>
          <button onClick={() => handleModalSubmit(additionalFeedback)} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </BadFeedbackModal>
      )}
    </div>
  );
}
