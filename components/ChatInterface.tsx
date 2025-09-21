
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AssistantType } from '../types';
import { Disclaimer, Sources } from './MessageDisplay';

interface ChatInterfaceProps {
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    assistantType: AssistantType;
}

const TypingIndicator: React.FC<{ assistantType: AssistantType }> = ({ assistantType }) => (
    <div className="flex items-center space-x-1 p-2">
        <span className="text-gray-500 text-sm">AI đang gõ</span>
        <div className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] ${assistantType === 'Creative' ? 'bg-pink-400' : 'bg-cyan-400'}`}></div>
        <div className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] ${assistantType === 'Creative' ? 'bg-pink-400' : 'bg-cyan-400'}`}></div>
        <div className={`h-2 w-2 rounded-full animate-bounce ${assistantType === 'Creative' ? 'bg-pink-400' : 'bg-cyan-400'}`}></div>
    </div>
);


const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, onSendMessage, isLoading, assistantType }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isCreative = assistantType === 'Creative';
    const colors = {
        userBubble: 'bg-indigo-500 text-white',
        modelBubble: isCreative ? 'bg-pink-100 text-pink-900' : 'bg-cyan-100 text-cyan-900',
        inputBorder: isCreative ? 'border-pink-300 focus:border-pink-500 focus:ring-pink-500' : 'border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500',
        sendButton: isCreative ? 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-300' : 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-300',
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [history]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <section className="mt-6 md:mt-8 w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="p-2 sm:p-4 h-80 md:h-96 overflow-y-auto flex flex-col space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? colors.userBubble : colors.modelBubble}`}>
                            {msg.disclaimer && <Disclaimer text={msg.disclaimer} />}
                            <p className="whitespace-pre-wrap text-sm sm:text-base break-words">{msg.content}</p>
                            {msg.sources && msg.sources.length > 0 && <Sources sources={msg.sources} />}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                       <TypingIndicator assistantType={assistantType} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 sm:p-4 border-t border-gray-200/80">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nhập tin nhắn của bạn..."
                        className={`w-full px-4 py-2 text-sm sm:text-base border rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${colors.inputBorder}`}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={`p-2 rounded-full text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed ${colors.sendButton}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ChatInterface;