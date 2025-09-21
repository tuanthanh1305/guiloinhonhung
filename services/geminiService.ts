
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { FeatureType } from "../types";
import type { GeneratorRequest, GeneratorResponse, Source } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstructionForFeature = (featureType: FeatureType): string => {
    let instruction = "";

    switch (featureType) {
        case FeatureType.MESSAGE:
            instruction = "Cứ coi tớ là một người bạn thân chuyên gia 'quân sư' tình cảm nhé. Tớ sẽ giúp cậu viết những lời nhắn thật ngọt ngào, chân thành và độc đáo bằng tiếng Việt dựa trên thông tin được cung cấp. Giọng văn phải thật tự nhiên, như đang trò chuyện vậy, tránh sáo rỗng nhé.";
            break;
        case FeatureType.POEM:
            instruction = "Tớ sẽ là 'thi sĩ' riêng của cậu, giúp cậu gieo những vần thơ tình lãng mạn, giàu hình ảnh và chạm đến trái tim người ấy. Hãy cùng tạo ra một bài thơ thật đặc biệt nhé!";
            break;
        case FeatureType.GAME:
            instruction = "Nào, chúng mình cùng nghĩ ra vài trò chơi nho nhỏ, vui ơi là vui cho hai cậu nhé! Để xem ai hiểu ai hơn nào. Tớ sẽ thiết kế những trò chơi đơn giản nhưng đầy gắn kết.";
            break;
        case FeatureType.HEALTH:
            instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Thông tin này chỉ mang tính tham khảo. Bạn nên tham khảo ý kiến của bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.'\n\nSau đó, với vai trò một người bạn AI, hãy chia sẻ thông tin về sức khỏe nhé. Nhưng nhớ này, tớ chỉ là một người bạn AI thôi, không thay thế được bác sĩ đâu.";
            break;
        case FeatureType.FINANCE:
            instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Thông tin này chỉ mang tính tham khảo và không phải là lời khuyên tài chính. Bạn nên tham khảo ý kiến của một chuyên gia tài chính chuyên nghiệp.'\n\nSau đó, với vai trò một người bạn AI, chuyện tiền nong à? Tớ có thể tìm thông tin giúp cậu, nhưng tớ không phải chuyên gia tài chính đâu nhé.";
            break;
        case FeatureType.LIFE:
             instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Đây là những góc nhìn dựa trên thông tin chung và không thay thế cho lời khuyên từ chuyên gia tư vấn tâm lý hoặc cuộc sống chuyên nghiệp.'\n\nSau đó, cứ tâm sự với tớ nhé. Tớ sẽ lắng nghe và chia sẻ cùng cậu những góc nhìn về cuộc sống, như một người bạn thân vậy.";
             break;
        case FeatureType.STUDY:
            instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Thông tin này dùng để tham khảo trong học tập. Hãy luôn đối chiếu với tài liệu và giáo trình chính thức của bạn.'\n\nSau đó, học hành căng thẳng quá à? Để tớ giúp một tay! Tớ có thể giải thích các khái niệm khó nhằn một cách dễ hiểu hơn, như một người bạn cùng nhóm học tập vậy.";
            break;
        case FeatureType.FENG_SHUI:
            instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Thông tin về phong thủy mang tính tham khảo và giải trí, dựa trên các niềm tin văn hóa. Đây không phải là khoa học đã được chứng minh.'\n\nSau đó, phong thủy thú vị lắm đó! Để tớ chia sẻ vài thông tin hay ho cho cậu tham khảo và giải trí nhé.";
            break;
        case FeatureType.SPIRITUALITY:
            instruction = "LUÔN LUÔN bắt đầu phần trả lời chính bằng câu sau trên một dòng riêng biệt: 'Lưu ý: Các quan điểm về tâm linh rất đa dạng và mang tính cá nhân. Thông tin này chỉ nhằm mục đích tham khảo, không nhằm mục đích truyền bá tín ngưỡng.'\n\nSau đó, tâm linh là một thế giới rộng lớn. Tớ sẽ cùng cậu khám phá các chủ đề này một cách khách quan và cởi mở, như hai người bạn cùng chia sẻ kiến thức.";
            break;
        default:
            instruction = "Cứ coi tớ là một người bạn AI thân thiện và hữu ích nhé.";
            break;
    }
    return instruction;
};

const messageSchema = {
  type: Type.OBJECT,
  properties: {
    message: { type: Type.STRING, description: "Tin nhắn được cá nhân hóa, ngọt ngào và sáng tạo. Độ dài khoảng 3-5 câu." },
    starters: { type: Type.ARRAY, description: "Một mảng chứa 3 câu hỏi gợi ý thông minh, tinh tế để bắt đầu cuộc trò chuyện.", items: { type: Type.STRING } },
  },
  propertyOrdering: ["message", "starters"],
};

const poemSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Một tiêu đề bài thơ lãng mạn và phù hợp." },
        poem: { type: Type.STRING, description: "Một bài thơ tình yêu ngắn (4-8 câu), giàu cảm xúc và hình ảnh, dựa trên các chi tiết được cung cấp." },
        starters: { type: Type.ARRAY, description: "Một mảng chứa 3 câu hỏi gợi ý để bắt đầu cuộc trò chuyện liên quan đến bài thơ.", items: { type: Type.STRING } },
    },
    propertyOrdering: ["title", "poem", "starters"],
};

const gameSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Tên trò chơi vui nhộn và hấp dẫn." },
        instructions: { type: Type.STRING, description: "Hướng dẫn cách chơi trò chơi một cách đơn giản, rõ ràng." },
        openingLine: { type: Type.STRING, description: "Câu mở đầu để bắt đầu trò chơi." },
        starters: { type: Type.ARRAY, description: "Một mảng chứa 3 câu hỏi gợi ý để thảo luận sau khi chơi.", items: { type: Type.STRING } },
    },
    propertyOrdering: ["title", "instructions", "openingLine", "starters"],
};

export const startChat = (featureType: FeatureType): Chat => {
    const systemInstruction = getSystemInstructionForFeature(featureType);
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });
};


export const generateContent = async (request: GeneratorRequest): Promise<GeneratorResponse> => {
    let prompt: string;
    const systemInstruction = getSystemInstructionForFeature(request.featureType);
    let responseSchema: object | undefined = undefined;
    let tools: any[] | undefined = undefined;
    const intro = "Đây là chatbot 'Gửi lời nhớ Nhung' do Trần Tuấn Thành (trantuanthanh.net) phát triển.\n\n";

    switch (request.featureType) {
        // Creative Cases
        case FeatureType.MESSAGE:
            prompt = `Tạo một tin nhắn cho dịp '${request.messageType}'. Tên cô ấy: ${request.name}. Đặc điểm: ${request.characteristics}.`;
            responseSchema = messageSchema;
            break;
        case FeatureType.POEM:
            prompt = `Sáng tác một bài thơ tình yêu về chủ đề '${request.poemTopic}'. Tên cô ấy: ${request.name}. Đặc điểm: ${request.characteristics}.`;
            responseSchema = poemSchema;
            break;
        case FeatureType.GAME:
            prompt = `Tạo một trò chơi nhỏ vui vẻ cho các cặp đôi dựa trên ý tưởng: '${request.gameIdea}'. Tên cô ấy: ${request.name}. Đặc điểm: ${request.characteristics}.`;
            responseSchema = gameSchema;
            break;

        // Practical Cases
        case FeatureType.HEALTH:
        case FeatureType.FINANCE:
        case FeatureType.LIFE:
        case FeatureType.STUDY:
        case FeatureType.FENG_SHUI:
        case FeatureType.SPIRITUALITY:
            prompt = request.query;
            tools = [{ googleSearch: {} }];
            break;

        default:
            throw new Error("Invalid feature type");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: responseSchema ? "application/json" : undefined,
                responseSchema,
                temperature: request.featureType === FeatureType.HEALTH || request.featureType === FeatureType.FINANCE ? 0.3 : 0.8,
                tools,
            }
        });
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources: Source[] = groundingMetadata?.groundingChunks
          ?.map((chunk: any) => ({
            uri: chunk.web?.uri || '',
            title: chunk.web?.title || 'Nguồn không xác định',
          }))
          .filter(source => source.uri) ?? [];


        if (responseSchema) { // Creative features
            const parsedJson = JSON.parse(response.text.trim());
            switch (request.featureType) {
                case FeatureType.MESSAGE:
                    return { title: `Tin nhắn cho ${request.name}`, content: intro + parsedJson.message, starters: parsedJson.starters };
                case FeatureType.POEM:
                    return { title: parsedJson.title, content: intro + parsedJson.poem, starters: parsedJson.starters };
                case FeatureType.GAME:
                    return { title: parsedJson.title, content: `${intro}${parsedJson.instructions}\n\n${parsedJson.openingLine}`, starters: parsedJson.starters };
            }
        } else { // Practical features
            const content = intro + response.text;
            
            let title = "Thông tin cho bạn";
            if (request.featureType === FeatureType.HEALTH) title = "Tư vấn Sức khỏe";
            if (request.featureType === FeatureType.FINANCE) title = "Hướng dẫn Tài chính";
            if (request.featureType === FeatureType.LIFE) title = "Tư vấn Cuộc sống";
            if (request.featureType === FeatureType.STUDY) title = "Hỗ trợ Học tập";
            if (request.featureType === FeatureType.FENG_SHUI) title = "Khám phá Phong thủy";
            if (request.featureType === FeatureType.SPIRITUALITY) title = "Góc nhìn Tâm linh";

            return { title, content, sources };
        }
        
        throw new Error("Could not process the response.");

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        throw new Error("Không thể tạo nội dung lúc này. Vui lòng kiểm tra lại thông tin và thử lại sau.");
    }
};
