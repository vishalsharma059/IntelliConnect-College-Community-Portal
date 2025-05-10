import { useState } from 'react';
import Topbar from "../../components/topbar/Topbar"; 
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import "./chatBot.css";

const API_KEY = "AIzaSyBJLcgAx09GOjuL6_AIOP5BAyIu7hni-AI"; 

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm IntelliConnect! Ask me anything!",
      sender: "Gemini"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user"
    };

    setMessages([...messages, newMessage]);
    setIsTyping(true);
    await processMessageToGemini(message);
  };

  async function processMessageToGemini(message) {
    const apiRequestBody = {
      contents: [{ parts: [{ text: message }] }]
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiRequestBody)
        }
      );

      const data = await response.json();

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

      setMessages(prevMessages => [...prevMessages, {
        message: botResponse,
        sender: "Gemini"
      }]);

      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  }

  return (
    <>
      <Topbar />
      <div className="chatbot-container">
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="IntelliConnect is typing..." /> : null}
            >
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    message: msg.message,
                    direction: msg.sender === "user" ? "outgoing" : "incoming"
                  }}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type a message..." onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}
