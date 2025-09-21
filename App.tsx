
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputDisplay from './components/MessageDisplay';
import Footer from './components/Footer';
import ChatInterface from './components/ChatInterface';
import { generateContent, startChat } from './services/geminiService';
import type { GeneratorRequest, GeneratorResponse, AssistantType, ChatMessage } from './types';
import { ASSISTANT_TYPES } from './constants';
import type { Chat } from '@google/genai';


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [generatorResponse, setGeneratorResponse] = useState<GeneratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assistantType, setAssistantType] = useState<AssistantType>('Creative');
  
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);


  const resetState = () => {
    setGeneratorResponse(null);
    setError(null);
    setChatSession(null);
    setChatHistory([]);
  }

  const handleGenerateContent = useCallback(async (request: GeneratorRequest) => {
    setIsLoading(true);
    resetState();
    try {
      const response = await generateContent(request);
      setGeneratorResponse(response);

      const chat = startChat(request.featureType);
      setChatSession(chat);
      setChatHistory([{ role: 'model', content: response.content, sources: response.sources, disclaimer: response.disclaimer }]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendChatMessage = useCallback(async (message: string) => {
    if (!chatSession) return;

    setIsChatLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await chatSession.sendMessage({ message });
      const intro = "Đây là chatbot 'Gửi lời nhớ Nhung' do Trần Tuấn Thành (trantuanthanh.net) phát triển.\n\n";
      setChatHistory(prev => [...prev, { role: 'model', content: intro + response.text }]);
    } catch (err) {
        console.error("Lỗi khi gửi tin nhắn chat:", err);
        const errorMessage = err instanceof Error ? err.message : 'Không thể nhận phản hồi từ AI lúc này.';
        setChatHistory(prev => [...prev, { role: 'model', content: `Lỗi: ${errorMessage}` }]);
    } finally {
        setIsChatLoading(false);
    }
  }, [chatSession]);


  const assistantThemes = {
    Creative: 'bg-pink-50 selection:bg-pink-300 selection:text-pink-800',
    Practical: 'bg-cyan-50 selection:bg-cyan-300 selection:text-cyan-800',
  };

  return (
    <div className={`min-h-screen text-gray-800 flex flex-col items-center p-2 sm:p-4 transition-colors duration-500 ${assistantThemes[assistantType]}`}>
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-4 md:mt-8">
          <section className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-lg border border-gray-200/50 mb-6 md:mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {ASSISTANT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setAssistantType(type);
                    resetState();
                  }}
                  className={`w-1/2 py-2.5 text-sm md:text-base font-bold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${assistantType === type 
                    ? (type === 'Creative' ? 'bg-pink-500 text-white shadow' : 'bg-cyan-500 text-white shadow')
                    : 'text-gray-600 hover:bg-gray-200/70'
                  }`}
                >
                  {type === 'Creative' ? '✍️ Tác giả Sáng tạo' : '🧠 Cố vấn Thực tế'}
                </button>
              ))}
            </div>
          </section>

          <InputSection 
            assistantType={assistantType}
            onGenerate={handleGenerateContent} 
            isLoading={isLoading} 
          />
          <OutputDisplay 
            isLoading={isLoading} 
            response={generatorResponse} 
            error={error} 
            assistantType={assistantType}
          />
          {chatSession && generatorResponse && (
            <ChatInterface
              history={chatHistory}
              onSendMessage={handleSendChatMessage}
              isLoading={isChatLoading}
              assistantType={assistantType}
            />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;