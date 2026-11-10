// Demo Seed Data (TypeScript Reference) - Fictional Multi-Brand Holding
// File: src/data/seed-data.ts

import {
  Holding,
  Brand,
  Unit,
  Channel,
  TeamMember,
  Holiday,
  Demand
} from '../types/martech';

export const SEED_HOLDING: Holding = {
  id: 'hold_demo',
  name: 'Grupo Vértice (Demo)',
  slug: 'grupo-vertice-demo',
  description: 'Ambiente de Demonstração — Holding Multissetorial: Saúde, Educação, Tecnologia, Gastronomia e Franquias.'
};

export const SEED_BRANDS: Brand[] = [
  {
    id: 'brand_clinica_horizonte',
    holdingId: 'hold_demo',
    name: 'Clínica Horizonte',
    slug: 'clinica-horizonte',
    code: 'CHOR',
    segment: 'Saúde Integrada & Reabilitação',
    colorPrimary: '#0EA5E9',
    colorSecondary: '#0369A1',
    brandVoiceGuidelines: 'Acolhedor, técnico-científico acessível, empático e ético.',
    pillars: ['Prevenção & Saúde', 'Terapias na Prática', 'Depoimentos', 'Dia a Dia na Unidade'],
    monthlyTargetPosts: 24,
    isMultiUnit: true
  },
  {
    id: 'brand_horizonte_kids',
    holdingId: 'hold_demo',
    name: 'Horizonte Kids',
    slug: 'horizonte-kids',
    code: 'HKID',
    segment: 'Desenvolvimento Infantil & Pediatria',
    colorPrimary: '#8B5CF6',
    colorSecondary: '#6D28D9',
    pillars: ['Desenvolvimento Infantil', 'Orientação Familiar', 'Rotina Saudável'],
    monthlyTargetPosts: 16,
    isMultiUnit: true
  },
  {
    id: 'brand_vertice_franquias',
    holdingId: 'hold_demo',
    name: 'Vértice Franquias',
    slug: 'vertice-franquias',
    code: 'VFRQ',
    segment: 'Expansão & Gestão de Redes',
    colorPrimary: '#EC4899',
    colorSecondary: '#BE185D',
    pillars: ['Expansão & Governança', 'Cases de Sucesso', 'Inovação'],
    monthlyTargetPosts: 12,
    isMultiUnit: true
  },
  {
    id: 'brand_colegio_atlas',
    holdingId: 'hold_demo',
    name: 'Colégio Atlas Bilíngue',
    slug: 'colegio-atlas',
    code: 'CATL',
    segment: 'Educação Internacional & Cultura Maker',
    colorPrimary: '#059669',
    colorSecondary: '#064E3B',
    pillars: ['Metodologia Bilíngue', 'Cultura Maker', 'Desenvolvimento Socioemocional'],
    monthlyTargetPosts: 20,
    isMultiUnit: false
  },
  {
    id: 'brand_vertice_erp',
    holdingId: 'hold_demo',
    name: 'Vértice Cloud ERP',
    slug: 'vertice-erp',
    code: 'VERP',
    segment: 'Software de Gestão Financeira & DRE',
    colorPrimary: '#EA580C',
    colorSecondary: '#9A3412',
    pillars: ['DRE & Fluxo de Caixa', 'Gestão de Redes', 'Automação Fiscal'],
    monthlyTargetPosts: 16,
    isMultiUnit: false
  }
];

export const SEED_UNITS: Unit[] = [
  {
    id: 'unit_chor_sp',
    brandId: 'brand_clinica_horizonte',
    name: 'Horizonte Jardins',
    slug: 'horizonte-jardins',
    razaoSocial: 'Clínica Horizonte Jardins Demo Ltda',
    cnpj: '00.000.000/0001-01',
    city: 'São Paulo',
    uf: 'SP',
    address: 'Av. Paulista, 1000 - Jardins',
    localManagerName: 'Dra. Carla Mendes (Demo)',
    localManagerEmail: 'carla.demo@exemplo.com',
    regime: 'GESTAO_COMPLETA'
  },
  {
    id: 'unit_chor_pr',
    brandId: 'brand_clinica_horizonte',
    name: 'Horizonte Batel',
    slug: 'horizonte-batel',
    razaoSocial: 'Clínica Horizonte Sul Demo Ltda',
    cnpj: '00.000.000/0002-02',
    city: 'Curitiba',
    uf: 'PR',
    address: 'Av. do Batel, 500 - Batel',
    localManagerName: 'Dr. Marcos Silva (Demo)',
    regime: 'GESTAO_COMPLETA'
  },
  {
    id: 'unit_hkid_fln',
    brandId: 'brand_horizonte_kids',
    name: 'Horizonte Kids Florianópolis',
    slug: 'horizonte-kids-florianopolis',
    city: 'Florianópolis',
    uf: 'SC',
    regime: 'PRE_INAUGURACAO'
  },
  {
    id: 'unit_vfrq_cessao',
    brandId: 'brand_vertice_franquias',
    name: 'Vértice Campinas (Cessão de Espaço)',
    slug: 'vertice-campinas-cessao',
    city: 'Campinas',
    uf: 'SP',
    regime: 'CESSAO_SEM_CONTEUDO'
  }
];

export const SEED_CHANNELS: Channel[] = [
  { id: 'ch_chor_global', brandId: 'brand_clinica_horizonte', platform: 'INSTAGRAM', handle: '@clinicahorizonte.demo', name: 'Clínica Horizonte Oficial', followerCount: 48000, isActive: true },
  { id: 'ch_verp_ig', brandId: 'brand_vertice_erp', platform: 'INSTAGRAM', handle: '@verticeerp.demo', name: 'Vértice Cloud ERP', followerCount: 23100, isActive: true }
];

export const SEED_TEAM: TeamMember[] = [
  { id: 'user_ana', name: 'Ana Costa', email: 'ana@exemplo.demo', role: 'ACCOMPANIMENT_LEAD', roleDescription: 'Atendimento & Dono da Demanda', maxActiveDemands: 25, isActive: true },
  { id: 'user_lucas', name: 'Lucas Mendes', email: 'lucas@exemplo.demo', role: 'COPYWRITER_STRATEGIST', roleDescription: 'Roteirista & Copywriter', maxActiveDemands: 15, isActive: true },
  { id: 'user_marina', name: 'Marina Souza', email: 'marina@exemplo.demo', role: 'DESIGNER', roleDescription: 'Designer Gráfico & Mídia Off', maxActiveDemands: 15, isActive: true },
  { id: 'user_rafael', name: 'Rafael Lima', email: 'rafael@exemplo.demo', role: 'VIDEOMAKER_PRODUCER', roleDescription: 'Videomaker & Captação', maxActiveDemands: 10, isActive: true },
  { id: 'user_tiago', name: 'Tiago Rocha', email: 'tiago@exemplo.demo', role: 'VIDEO_EDITOR', roleDescription: 'Editor de Vídeo & Motion', maxActiveDemands: 12, isActive: true },
  { id: 'user_camila', name: 'Camila Alves', email: 'camila@exemplo.demo', role: 'PUBLISHER_TRAFFIC', roleDescription: 'Tráfego & Publicação', maxActiveDemands: 30, isActive: true },
  { id: 'user_roberto', name: 'Roberto Almeida', email: 'roberto@exemplo.demo', role: 'APPROVER', roleDescription: 'Diretor de Operações', maxActiveDemands: 99, isActive: true },
  { id: 'user_helena', name: 'Helena Prado', email: 'helena@exemplo.demo', role: 'APPROVER', roleDescription: 'CEO Holding', maxActiveDemands: 99, isActive: true }
];

export const SEED_HOLIDAYS: Holiday[] = [
  { id: 'hol_1', name: 'Proclamação da República', date: '2026-11-15', isNational: true },
  { id: 'hol_2', name: 'Dia Nacional da Consciência Negra', date: '2026-11-20', isNational: true }
];

export const SEED_DEMANDS: Demand[] = [];
