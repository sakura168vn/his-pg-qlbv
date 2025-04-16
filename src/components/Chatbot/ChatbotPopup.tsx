'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatbotPopup() {
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '🤖 Xin chào! Hãy nhập triệu chứng của bạn để tôi hỗ trợ.' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = { sender: 'user', text: inputText.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Trả lời giả lập – sau này có thể thay bằng API GPT
    setTimeout(() => {
      const botReply: Message = {
        sender: 'bot',
        text: '🤖 Tôi đã ghi nhận triệu chứng: "' + newMessage.text + '". Vui lòng chờ bác sĩ tư vấn.',
      };
      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {openChat && (
        <div className="fixed bottom-24 right-6 w-80 max-w-full h-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-t-xl">
            <div className="bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              +
            </div>
            <h2 className="text-sm font-semibold">Yêu Cầu Của Bạn</h2>
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 px-4 py-3 overflow-auto text-sm text-gray-800 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[90%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end ml-auto text-right'
                    : 'bg-gray-100 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <input
              type="text"
              placeholder="Nhập triệu chứng..."
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {/* Nút mở chat */}
      <button
        onClick={() => setOpenChat(!openChat)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 shadow-lg flex items-center justify-center text-white z-50"
        aria-label="Chatbot"
      >
        <Plus size={24} />
      </button>
    </>
  );
}
