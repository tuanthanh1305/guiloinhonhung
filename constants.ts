import { MessageType, FeatureType, AssistantType } from './types';

export const ASSISTANT_TYPES: AssistantType[] = ['Creative', 'Practical'];

export const CREATIVE_FEATURES: FeatureType[] = [
  FeatureType.MESSAGE,
  FeatureType.POEM,
  FeatureType.GAME,
];

export const PRACTICAL_FEATURES: FeatureType[] = [
  FeatureType.HEALTH,
  FeatureType.FINANCE,
  FeatureType.LIFE,
  FeatureType.STUDY,
  FeatureType.FENG_SHUI,
  FeatureType.SPIRITUALITY,
];

export const MESSAGE_TYPES: MessageType[] = [
  MessageType.GOOD_MORNING,
  MessageType.GOOD_NIGHT,
  MessageType.THINKING_OF_YOU,
  MessageType.APOLOGY,
  MessageType.ENCOURAGEMENT,
  MessageType.CONGRATULATIONS,
  MessageType.PLAYFUL_TEASING,
];