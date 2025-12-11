import { Service } from './types';

export const WHATSAPP_NUMBER = '5591988741478';

export const SERVICES: Service[] = [
  { id: '1', name: 'Corte de Cabelo', price: 80, category: 'cabelo', description: 'Renove seu visual com um corte moderno.' },
  { id: '2', name: 'Mechas', price: 350, category: 'cabelo', description: 'Ilumine seu rosto com mechas personalizadas.' },
  { id: '3', name: 'Alisamento Orgânico', price: 250, category: 'cabelo', description: 'Liso natural, sem formol e saudável.' },
  { id: '4', name: 'Hidratação Profunda', price: 120, category: 'cabelo', description: 'Devolva a vida e maciez aos seus fios.' },
  { id: '5', name: 'Banho de Brilho', price: 100, category: 'cabelo', description: 'Revitalize a cor e o brilho do seu cabelo.' },
  { id: '6', name: 'Coloração', price: 150, category: 'cabelo', description: 'Cobertura perfeita e cores vibrantes.' },
  { id: '7', name: 'Teste de Mechas', price: 50, category: 'cabelo', description: 'Segurança e saúde antes da química.' },
  { id: '8', name: 'Designer de Sobrancelhas', price: 40, category: 'sobrancelha' },
  { id: '9', name: 'Designer com Henna', price: 55, category: 'sobrancelha' },
  { id: '10', name: 'Micropigmentação', price: 450, category: 'sobrancelha', description: 'Sobrancelhas perfeitas e duradouras.' },
  { id: '11', name: 'Cílios (Extensão)', price: 180, category: 'olhos' },
];

export const WELCOME_MESSAGES = [
  "Olá, maravilhosa! Pronta para realçar sua beleza?",
  "Bem-vinda ao seu momento de cuidado e transformação.",
  "Você merece se sentir incrível todos os dias.",
  "Vamos renovar esse visual e elevar sua autoestima?",
];