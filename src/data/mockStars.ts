import { Star } from '../types';

export const mockStars: Star[] = [
  {
    id: 'star-1',
    catalogName: 'HD 284921',
    theme: 'dream',
    title: 'AI 연구자가 되고 싶다',
    initialText: '세계 최고의 AI 연구자가 되어 세상을 바꿀 모델을 만들고 싶다.',
    status: 'active',
    brightnessStage: 'mainSequence',
    position: [0, 0, 0], // Center
    logs: [
      { id: 'log-1', text: '오늘은 강화학습 논문을 읽었다.', createdAt: new Date(Date.now() - 86400000) },
      { id: 'log-2', text: '간단한 장난감 모델을 학습시켰다.', createdAt: new Date() },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: 'star-2',
    catalogName: 'HIP 48391',
    theme: 'goal',
    title: '마라톤 풀코스 완주',
    initialText: '올해 가을 열리는 마라톤에서 풀코스를 휴식 없이 완주한다.',
    status: 'dying',
    brightnessStage: 'young',
    position: [5, 2, -3],
    logs: [
      { id: 'log-3', text: '5km를 뛰었다. 아직은 괜찮다.', createdAt: new Date(Date.now() - 86400000 * 10) },
    ],
    createdAt: new Date(Date.now() - 86400000 * 12),
  },
  {
    id: 'star-3',
    catalogName: 'GJ 2048',
    theme: 'wish',
    title: '가족과 유럽 여행',
    initialText: '부모님을 모시고 스위스 융프라우에 가보고 싶다.',
    status: 'archived',
    brightnessStage: 'protostar',
    position: [-4, -1, 4],
    logs: [],
    createdAt: new Date(Date.now() - 86400000 * 30),
    archivedAt: new Date(Date.now() - 86400000 * 5),
  },
];
