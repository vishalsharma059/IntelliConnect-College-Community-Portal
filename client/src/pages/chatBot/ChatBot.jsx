import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "./chatBot.css";

const API_KEY = "AIzaSyBJLcgAx09GOjuL6_AIOP5BAyIu7hni-AI";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm IntelliConnect! Ask me anything!",
      sender: "Gemini",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messageListRef = useRef(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    await processMessageToGemini(message);
  };

  async function processMessageToGemini(message) {
    const apiRequestBody = {
      contents: [{ parts: [{ text: message }] }],
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const data = await response.json();

      let botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't process that.";

      // Remove markdown artifacts like **bold** and `code`
      botResponse = botResponse
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/`(.*?)`/g, "$1");

      setMessages((prev) => [
        ...prev,
        {
          message: botResponse,
          sender: "Gemini",
        },
      ]);

      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          message: "Oops! Something went wrong.",
          sender: "Gemini",
        },
      ]);
      setIsTyping(false);
    }
  }

  return (
    <>
      <Topbar />
      <div className="chatbot-container">
        <Sidebar />
        <MainContainer>
          <ChatContainer>
            <MessageList
              ref={messageListRef}
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="IntelliConnect is typing..." />
                ) : null
              }
            >
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    message: msg.message,
                    direction: msg.sender === "user" ? "outgoing" : "incoming",
                    sender: msg.sender,
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type a message..."
              onSend={handleSend}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}
