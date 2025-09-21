
import React from 'react';
import type { GeneratorResponse, AssistantType, Source } from '../types';

interface OutputDisplayProps {
  isLoading: boolean;
  response: GeneratorResponse | null;
  error: string | null;
  assistantType: AssistantType;
}

const LoadingSkeleton: React.FC<{ assistantType: AssistantType }> = ({ assistantType }) => {
    const isCreative = assistantType === 'Creative';
    const bgColor = isCreative ? 'bg-pink-200' : 'bg-cyan-200';
    const titleColor = isCreative ? 'bg-pink-300' : 'bg-cyan-300';
    return (
        <div className="animate-pulse space-y-6 w-full">
            <div className={`h-6 ${titleColor} rounded-full w-48 mb-6`}></div>
            <div className="space-y-3">
                <div className={`h-4 ${bgColor} rounded w-3/4`}></div>
                <div className={`h-4 ${bgColor} rounded w-full`}></div>
                <div className={`h-4 ${bgColor} rounded w-5/6`}></div>
            </div>
            {isCreative && (
                <>
                    <div className={`h-6 ${titleColor} rounded-full w-48 mt-8`}></div>
                    <div className="space-y-3 pt-4">
                        <div className={`h-4 ${bgColor} rounded w-1/2`}></div>
                        <div className={`h-4 ${bgColor} rounded w-2/3`}></div>
                    </div>
                </>
            )}
        </div>
    );
};

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

export const Disclaimer: React.FC<{ text: string }> = ({ text }) => (
    <div className="p-3 sm:p-4 mb-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
        <p className="text-sm">{text}</p>
    </div>
);

export const Sources: React.FC<{ sources: Source[] }> = ({ sources }) => (
    <div className="mt-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-3">Nguồn tham khảo từ Web 🌐</h3>
        <ul className="space-y-2 list-none">
            {sources.map((source, index) => (
                <li key={index} className="flex items-start">
                   <span className="text-cyan-500 mr-2 mt-1 flex-shrink-0">🔗</span> 
                   <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-cyan-700 hover:underline hover:text-cyan-800 transition-colors break-all">
                        {source.title || source.uri}
                   </a>
                </li>
            ))}
        </ul>
    </div>
);


const OutputDisplay: React.FC<OutputDisplayProps> = ({ isLoading, response, error, assistantType }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isCreative = assistantType === 'Creative';
    const colors = {
        title: isCreative ? 'text-pink-600' : 'text-cyan-700',
        bg: isCreative ? 'bg-pink-100/50' : 'bg-cyan-100/50',
        border: isCreative ? 'border-pink-200' : 'border-cyan-200',
        accentText: isCreative ? 'text-pink-400' : 'text-cyan-500',
        copyButtonText: isCreative ? 'text-pink-500' : 'text-cyan-600',
        copyButtonHover: isCreative ? 'hover:bg-pink-100' : 'hover:bg-cyan-100',
        copyButtonRing: isCreative ? 'focus:ring-pink-400' : 'focus:ring-cyan-400',
    };

    const renderContent = () => {
        if (isLoading) return <LoadingSkeleton assistantType={assistantType} />;
        if (error) return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
        if (!response) {
            return (
                <div className="text-center text-gray-500">
                    <p className="text-4xl sm:text-5xl mb-4">{isCreative ? '🎨' : '💡'}</p>
                    <p className="text-sm sm:text-base">{isCreative ? 'Kết quả sáng tạo của bạn sẽ xuất hiện ở đây...' : 'Câu trả lời của cố vấn sẽ xuất hiện ở đây...'}</p>
                    <p className="text-xs sm:text-sm mt-1 opacity-80">{isCreative ? 'Chọn một tính năng và để AI tạo nên điều kỳ diệu!' : 'Đặt câu hỏi và nhận thông tin hữu ích!'}</p>
                </div>
            );
        }

        return (
            <div className="w-full">
                <h2 className={`text-xl sm:text-2xl font-bold ${colors.title} mb-4 ${isCreative ? 'font-pacifico' : ''}`}>{response.title}</h2>
                <div className="relative group">
                    {/* The initial response is now part of the chat, so we don't render it here to avoid duplication. 
                        We only show the title and starters from the initial response. 
                        The main content will appear as the first message in ChatInterface.
                    */}
                </div>
                
                {response.starters && response.starters.length > 0 && (
                    <div className="mt-4">
                        <h3 className={`text-lg sm:text-xl font-bold ${colors.title} mb-3`}>Gợi ý bắt chuyện 💬</h3>
                        <ul className="space-y-2 list-none">
                            {response.starters.map((starter, index) => (
                                <li key={index} className="flex items-start">
                                   <span className={`${colors.accentText} mr-2 mt-1`}>💖</span> 
                                   <span className="text-gray-700 text-sm sm:text-base">{starter}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

  return (
    <section className="mt-6 md:mt-8 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200/80 min-h-[150px] flex items-center justify-center">
        {renderContent()}
    </section>
  );
};

export default OutputDisplay;