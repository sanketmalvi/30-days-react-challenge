import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css';
import '@fontsource/poppins';

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [streamText, setStreamText] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, streamText]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStreamText('');
    setLoading(true);

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = await model.startChat({ history: [] });
      const result = await chat.sendMessageStream(input);

      let fullText = '';
      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        setStreamText(fullText);
      }

      setMessages((prev) => [...prev, { type: 'bot', text: fullText }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { type: 'bot', text: 'Error getting response from Gemini.' }]);
    } finally {
      setLoading(false);
      setStreamText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white font-[Poppins] flex flex-col">
      <header className="text-center py-4 text-2xl font-bold bg-gray-900 shadow animate-fade-in">
        AI ChatBot - Gemini
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {loading && <ChatMessage message={{ type: 'bot', text: streamText || 'Typing...' }} loading />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-gray-900 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white transition-all duration-200 focus:scale-[1.02]"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
