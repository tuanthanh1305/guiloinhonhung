export type AssistantType = 'Creative' | 'Practical';

export enum FeatureType {
  MESSAGE = 'Tin nhắn Yêu thương',
  POEM = 'Nhà thơ Tình yêu',
  GAME = 'Người tạo Game Vui',
  HEALTH = 'Tư vấn Sức khỏe',
  FINANCE = 'Hướng dẫn Tài chính',
  LIFE = 'Tư vấn Cuộc sống',
  STUDY = 'Hỗ trợ Học tập',
  FENG_SHUI = 'Khám phá Phong thủy',
  SPIRITUALITY = 'Góc nhìn Tâm linh',
}

export enum MessageType {
  GOOD_MORNING = 'Chúc buổi sáng',
  GOOD_NIGHT = 'Chúc ngủ ngon',
  THINKING_OF_YOU = 'Đang nhớ em',
  APOLOGY = 'Xin lỗi',
  ENCOURAGEMENT = 'Động viên, an ủi',
  CONGRATULATIONS = 'Chúc mừng',
  PLAYFUL_TEASING = 'Trêu ghẹo tinh nghịch',
}

// --- Creative Assistant Types ---

interface CreativeBaseRequest {
    name: string;
    characteristics: string;
}

export interface MessageGeneratorRequest extends CreativeBaseRequest {
    featureType: FeatureType.MESSAGE;
    messageType: MessageType;
}

export interface PoemGeneratorRequest extends CreativeBaseRequest {
    featureType: FeatureType.POEM;
    poemTopic: string;
}

export interface GameGeneratorRequest extends CreativeBaseRequest {
    featureType: FeatureType.GAME;
    gameIdea: string;
}

// --- Practical Assistant Types ---

interface PracticalBaseRequest {
    query: string;
}

export interface HealthRequest extends PracticalBaseRequest {
    featureType: FeatureType.HEALTH;
}

export interface FinanceRequest extends PracticalBaseRequest {
    featureType: FeatureType.FINANCE;
}

export interface LifeRequest extends PracticalBaseRequest {
    featureType: FeatureType.LIFE;
}

export interface StudyRequest extends PracticalBaseRequest {
    featureType: FeatureType.STUDY;
}

export interface FengShuiRequest extends PracticalBaseRequest {
    featureType: FeatureType.FENG_SHUI;
}

export interface SpiritualityRequest extends PracticalBaseRequest {
    featureType: FeatureType.SPIRITUALITY;
}


export type GeneratorRequest = 
    | MessageGeneratorRequest 
    | PoemGeneratorRequest 
    | GameGeneratorRequest
    | HealthRequest
    | FinanceRequest
    | LifeRequest
    | StudyRequest
    | FengShuiRequest
    | SpiritualityRequest;

export interface Source {
    uri: string;
    title: string;
}
export interface GeneratorResponse {
  title: string;
  content: string;
  starters?: string[];
  disclaimer?: string;
  sources?: Source[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: Source[];
  disclaimer?: string;
}