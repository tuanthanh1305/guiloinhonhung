
import React, { useState, useEffect } from 'react';
import { CREATIVE_FEATURES, PRACTICAL_FEATURES, MESSAGE_TYPES } from '../constants';
import type { GeneratorRequest, AssistantType } from '../types';
import { FeatureType, MessageType } from '../types';

interface InputSectionProps {
  onGenerate: (request: GeneratorRequest) => void;
  isLoading: boolean;
  assistantType: AssistantType;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading, assistantType }) => {
  const isCreativeMode = assistantType === 'Creative';
  const featureSet = isCreativeMode ? CREATIVE_FEATURES : PRACTICAL_FEATURES;
  
  const [featureType, setFeatureType] = useState<FeatureType>(featureSet[0]);
  
  // Creative state
  const [name, setName] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.GOOD_MORNING);
  const [poemTopic, setPoemTopic] = useState('');
  const [gameIdea, setGameIdea] = useState('');

  // Practical state
  const [query, setQuery] = useState('');

  useEffect(() => {
    setFeatureType(featureSet[0]);
    setQuery('');
  }, [assistantType, featureSet]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let request: GeneratorRequest;

    if (isCreativeMode) {
      if (!name.trim()) {
        alert("Vui lòng nhập tên của nàng.");
        return;
      }
      switch (featureType) {
          case FeatureType.POEM:
              if (!poemTopic.trim()) { alert("Vui lòng nhập chủ đề cho bài thơ."); return; }
              request = { featureType, name, characteristics, poemTopic };
              break;
          case FeatureType.GAME:
              if (!gameIdea.trim()) { alert("Vui lòng nhập ý tưởng cho trò chơi."); return; }
              request = { featureType, name, characteristics, gameIdea };
              break;
          case FeatureType.MESSAGE:
          default:
              request = { featureType: FeatureType.MESSAGE, name, characteristics, messageType };
              break;
      }
    } else { // Practical Mode
        if (!query.trim()) { alert("Vui lòng nhập câu hỏi hoặc yêu cầu của bạn."); return; }
        switch(featureType) {
            case FeatureType.HEALTH:
            case FeatureType.FINANCE:
            case FeatureType.LIFE:
            case FeatureType.STUDY:
            case FeatureType.FENG_SHUI:
            case FeatureType.SPIRITUALITY:
                request = { featureType, query };
                break;
            default:
                throw new Error("Invalid feature type for practical mode");
        }
    }

    onGenerate(request);
  };
  
  const buttonText: {[key in FeatureType]?: string} = {
      [FeatureType.MESSAGE]: '✨ Tạo tin nhắn diệu kỳ ✨',
      [FeatureType.POEM]: '✒️ Sáng tác thơ tình ✒️',
      [FeatureType.GAME]: '🎲 Tạo game vui 🎲',
      [FeatureType.HEALTH]: '🩺 Nhận tư vấn sức khỏe 🩺',
      [FeatureType.FINANCE]: '💰 Tra cứu thông tin tài chính 💰',
      [FeatureType.LIFE]: '🌱 Nhận lời khuyên cuộc sống 🌱',
      [FeatureType.STUDY]: '📚 Hỗ trợ học tập 📚',
      [FeatureType.FENG_SHUI]: '☯️ Khám phá phong thủy ☯️',
      [FeatureType.SPIRITUALITY]: '🧘 Khám phá tâm linh 🧘',
  }

  const placeholderText: {[key in FeatureType]?: string} = {
      [FeatureType.HEALTH]: "Ví dụ: Làm thế nào để giảm stress hiệu quả?",
      [FeatureType.FINANCE]: "Ví dụ: Lãi suất tiết kiệm của các ngân hàng hiện nay?",
      [FeatureType.LIFE]: "Ví dụ: Cách để cân bằng giữa công việc và cuộc sống?",
      [FeatureType.STUDY]: "Ví dụ: Giải thích về thuyết tương đối của Einstein.",
      [FeatureType.FENG_SHUI]: "Ví dụ: Làm sao để bố trí phòng ngủ hợp phong thủy?",
      [FeatureType.SPIRITUALITY]: "Ví dụ: Thiền định là gì và lợi ích của nó?",
  }
  
  const accentColors = {
      Creative: {
          text: 'text-pink-600',
          border: 'border-pink-500',
          ring: 'focus:ring-pink-400',
          borderFocus: 'focus:border-pink-400',
          bg: 'bg-pink-500',
          hoverBg: 'hover:bg-pink-600',
          disabledBg: 'disabled:bg-pink-300',
          ringFocus: 'focus:ring-pink-300',
      },
      Practical: {
          text: 'text-cyan-600',
          border: 'border-cyan-500',
          ring: 'focus:ring-cyan-400',
          borderFocus: 'focus:border-cyan-400',
          bg: 'bg-cyan-500',
          hoverBg: 'hover:bg-cyan-600',
          disabledBg: 'disabled:bg-cyan-300',
          ringFocus: 'focus:ring-cyan-300',
      }
  }
  const colors = accentColors[assistantType];

  return (
    <section className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200/80">
      <div className={`mb-6 flex items-center border-b ${isCreativeMode ? 'border-pink-200' : 'border-cyan-200'} overflow-x-auto pb-1`}>
        {featureSet.map(type => (
            <button key={type} onClick={() => setFeatureType(type)} className={`py-3 px-3 sm:px-4 text-sm md:text-base font-semibold transition-colors duration-200 -mb-px border-b-2 whitespace-nowrap ${featureType === type ? `${colors.text} ${colors.border}` : 'text-gray-500 border-transparent hover:text-gray-800'}`}>
                {type}
            </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isCreativeMode ? (
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Tên của nàng</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Người nhớ Nhung " className={`w-full text-sm sm:text-base px-4 py-2 border border-pink-200 rounded-lg ${colors.ring} ${colors.borderFocus} transition duration-200 bg-white`} required />
                </div>
                <div>
                  <label htmlFor="characteristics" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Đặc điểm / Kỷ niệm</label>
                  <input id="characteristics" value={characteristics} onChange={(e) => setCharacteristics(e.target.value)} placeholder="Ví dụ: Nàng thích mèo, hay cười..." className={`w-full text-sm sm:text-base px-4 py-2 border border-pink-200 rounded-lg ${colors.ring} ${colors.borderFocus} transition duration-200 bg-white`} />
                </div>
            </div>
        ) : (
            <div>
                <label htmlFor="query" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Câu hỏi của bạn</label>
                <textarea id="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholderText[featureType]} className={`w-full text-sm sm:text-base px-4 py-2 border border-cyan-200 rounded-lg ${colors.ring} ${colors.borderFocus} transition duration-200 bg-white min-h-[100px]`} required />
            </div>
        )}

        {featureType === FeatureType.MESSAGE && (
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">Chọn loại tin nhắn</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {MESSAGE_TYPES.map((type) => (
                  <label key={type} className={`cursor-pointer p-2 md:p-3 rounded-lg text-center text-sm transition duration-200 border-2 ${messageType === type ? 'bg-pink-500 text-white border-pink-500 font-bold' : 'bg-pink-100 text-pink-800 border-pink-100 hover:border-pink-300'}`}>
                    <input type="radio" name="messageType" value={type} checked={messageType === type} onChange={() => setMessageType(type)} className="sr-only" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
        )}
        {featureType === FeatureType.POEM && (
            <div>
                <label htmlFor="poem-topic" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Chủ đề bài thơ</label>
                <input id="poem-topic" type="text" value={poemTopic} onChange={(e) => setPoemTopic(e.target.value)} placeholder="Ví dụ: Về nụ cười của nàng" className={`w-full text-sm sm:text-base px-4 py-2 border border-pink-200 rounded-lg ${colors.ring} ${colors.borderFocus} transition duration-200 bg-white`} required />
            </div>
        )}
        {featureType === FeatureType.GAME && (
            <div>
                <label htmlFor="game-idea" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Ý tưởng trò chơi</label>
                <input id="game-idea" type="text" value={gameIdea} onChange={(e) => setGameIdea(e.target.value)} placeholder="Ví dụ: Trò chơi đố vui về kỷ niệm của chúng mình" className={`w-full text-sm sm:text-base px-4 py-2 border border-pink-200 rounded-lg ${colors.ring} ${colors.borderFocus} transition duration-200 bg-white`} required />
            </div>
        )}

        <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 ${colors.bg} ${colors.hoverBg} ${colors.ringFocus} ${colors.disabledBg} disabled:cursor-not-allowed`}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            buttonText[featureType]
          )}
        </button>
      </form>
    </section>
  );
};

export default InputSection;