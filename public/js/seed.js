// Demo Seed Data (Fictional Multi-Brand Holding for Public Showcase)
// File: public/js/seed.js
// Real operational workspaces can be loaded locally via "Importar Dados (.json)"

const SEED_HOLDING = {
  id: 'hold_demo',
  name: 'Grupo Vértice (Demo)',
  slug: 'grupo-vertice-demo',
  description: 'Ambiente de Demonstração — Holding Multissetorial: Saúde, Educação, Tecnologia, Gastronomia e Franquias.'
};

const SEED_BRANDS = [
  { id: 'brand_clinica_horizonte', name: 'Clínica Horizonte', code: 'CHOR', segment: 'Saúde Integrada & Reabilitação', colorPrimary: '#0EA5E9', monthlyTargetPosts: 24, isMultiUnit: true },
  { id: 'brand_horizonte_kids', name: 'Horizonte Kids', code: 'HKID', segment: 'Desenvolvimento Infantil & Pediatria', colorPrimary: '#8B5CF6', monthlyTargetPosts: 16, isMultiUnit: true },
  { id: 'brand_vertice_franquias', name: 'Vértice Franquias', code: 'VFRQ', segment: 'Expansão & Gestão de Redes', colorPrimary: '#EC4899', monthlyTargetPosts: 12, isMultiUnit: true },
  { id: 'brand_bistro_verde', name: 'Bistrô Verde', code: 'BVRD', segment: 'Alimentação Saudável & Funcional', colorPrimary: '#F59E0B', monthlyTargetPosts: 16, isMultiUnit: false },
  { id: 'brand_colegio_atlas', name: 'Colégio Atlas Bilíngue', code: 'CATL', segment: 'Educação Internacional & Cultura Maker', colorPrimary: '#059669', monthlyTargetPosts: 20, isMultiUnit: false },
  { id: 'brand_vertice_erp', name: 'Vértice Cloud ERP', code: 'VERP', segment: 'Software de Gestão Financeira & DRE', colorPrimary: '#EA580C', monthlyTargetPosts: 16, isMultiUnit: false },
  { id: 'brand_vertice_pay', name: 'Vértice Pay', code: 'VPAY', segment: 'Fintech & Split de Pagamentos', colorPrimary: '#2563EB', monthlyTargetPosts: 10, isMultiUnit: false },
  { id: 'brand_aurora_resort', name: 'Aurora Eco Resort', code: 'AURS', segment: 'Hotelaria & Ecoturismo', colorPrimary: '#0D9488', monthlyTargetPosts: 14, isMultiUnit: false }
];

const SEED_UNITS = [
  // 1. Clínica Horizonte (Multi-unidade em Gestão Completa)
  { id: 'unit_chor_sp', brandId: 'brand_clinica_horizonte', name: 'Horizonte Jardins', city: 'São Paulo', uf: 'SP', regime: 'GESTAO_COMPLETA' },
  { id: 'unit_chor_pr', brandId: 'brand_clinica_horizonte', name: 'Horizonte Batel', city: 'Curitiba', uf: 'PR', regime: 'GESTAO_COMPLETA' },
  { id: 'unit_chor_pe', brandId: 'brand_clinica_horizonte', name: 'Horizonte Boa Viagem', city: 'Recife', uf: 'PE', regime: 'GESTAO_COMPLETA' },
  { id: 'unit_chor_mg', brandId: 'brand_clinica_horizonte', name: 'Horizonte Savassi', city: 'Belo Horizonte', uf: 'MG', regime: 'GESTAO_COMPLETA' },

  // 2. Horizonte Kids (1 ativa, 1 pré-inauguração)
  { id: 'unit_hkid_sp', brandId: 'brand_horizonte_kids', name: 'Horizonte Kids Jardins', city: 'São Paulo', uf: 'SP', regime: 'GESTAO_COMPLETA' },
  { id: 'unit_hkid_fln', brandId: 'brand_horizonte_kids', name: 'Horizonte Kids Florianópolis', city: 'Florianópolis', uf: 'SC', regime: 'PRE_INAUGURACAO' },

  // 3. Vértice Franquias (inclui exemplo de Cessão de Marca sem meta de conteúdo)
  { id: 'unit_vfrq_br', brandId: 'brand_vertice_franquias', name: 'Vértice Brasil (Institucional)', city: 'Nacional', uf: 'BR', regime: 'GESTAO_COMPLETA' },
  { id: 'unit_vfrq_cessao', brandId: 'brand_vertice_franquias', name: 'Vértice Campinas (Cessão de Espaço)', city: 'Campinas', uf: 'SP', regime: 'CESSAO_SEM_CONTEUDO' }
];

const SEED_CHANNELS = [
  { id: 'ch_chor_global', brandId: 'brand_clinica_horizonte', platform: 'INSTAGRAM', handle: '@clinicahorizonte.demo', name: 'Clínica Horizonte Oficial', followerCount: 48000, isActive: true },
  { id: 'ch_chor_sp', brandId: 'brand_clinica_horizonte', unitId: 'unit_chor_sp', platform: 'INSTAGRAM', handle: '@horizontejardins.demo', name: 'Horizonte Jardins', followerCount: 19400, isActive: true },
  { id: 'ch_hkid_ig', brandId: 'brand_horizonte_kids', platform: 'INSTAGRAM', handle: '@horizontekids.demo', name: 'Horizonte Kids Oficial', followerCount: 14200, isActive: true },
  { id: 'ch_verp_ig', brandId: 'brand_vertice_erp', platform: 'INSTAGRAM', handle: '@verticeerp.demo', name: 'Vértice Cloud ERP', followerCount: 23100, isActive: true },
  { id: 'ch_catl_ig', brandId: 'brand_colegio_atlas', platform: 'INSTAGRAM', handle: '@colegioatlas.demo', name: 'Colégio Atlas Bilíngue', followerCount: 31200, isActive: true }
];

const SEED_TEAM = [
  { id: 'user_ana', name: 'Ana Costa', email: 'ana@exemplo.demo', role: 'ACCOMPANIMENT_LEAD', roleDescription: 'Atendimento & Dono da Demanda', maxActiveDemands: 25, isActive: true },
  { id: 'user_lucas', name: 'Lucas Mendes', email: 'lucas@exemplo.demo', role: 'COPYWRITER_STRATEGIST', roleDescription: 'Roteirista & Copywriter', maxActiveDemands: 15, isActive: true },
  { id: 'user_marina', name: 'Marina Souza', email: 'marina@exemplo.demo', role: 'DESIGNER', roleDescription: 'Designer Gráfico & Mídia Off', maxActiveDemands: 15, isActive: true },
  { id: 'user_rafael', name: 'Rafael Lima', email: 'rafael@exemplo.demo', role: 'VIDEOMAKER_PRODUCER', roleDescription: 'Videomaker & Captação', maxActiveDemands: 10, isActive: true },
  { id: 'user_tiago', name: 'Tiago Rocha', email: 'tiago@exemplo.demo', role: 'VIDEO_EDITOR', roleDescription: 'Editor de Vídeo & Motion', maxActiveDemands: 12, isActive: true },
  { id: 'user_camila', name: 'Camila Alves', email: 'camila@exemplo.demo', role: 'PUBLISHER_TRAFFIC', roleDescription: 'Tráfego & Publicação', maxActiveDemands: 30, isActive: true },
  { id: 'user_roberto', name: 'Roberto Almeida', email: 'roberto@exemplo.demo', role: 'APPROVER', roleDescription: 'Diretor de Operações', maxActiveDemands: 99, isActive: true },
  { id: 'user_helena', name: 'Helena Prado', email: 'helena@exemplo.demo', role: 'APPROVER', roleDescription: 'CEO Holding', maxActiveDemands: 99, isActive: true }
];

const SEED_HOLIDAYS = [
  { id: 'hol_1', name: 'Proclamação da República', date: '2026-11-15', isNational: true },
  { id: 'hol_2', name: 'Dia da Consciência Negra', date: '2026-11-20', isNational: true }
];

const SEED_DEMANDS = [
  {
    id: 'dem_chor_001',
    code: 'CHOR-2026-001',
    brandId: 'brand_clinica_horizonte',
    scope: 'GLOBAL_BRAND',
    targetUnitIds: ['unit_chor_sp', 'unit_chor_pr', 'unit_chor_pe', 'unit_chor_mg'],
    naturezaDemanda: 'DIGITAL',
    title: 'Guia de Prevenção eQualidade de Vida: 3 hábitos essenciais para a saúde integrativa',
    format: 'REELS',
    stage: 'SCHEDULED_OR_PRINT',
    priority: 'HIGH',
    campaignName: 'Saúde Preventiva 2026',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_tiago',
    publisherId: 'user_camila',
    approverId: 'user_roberto',
    currentAssigneeId: 'user_camila',
    dataMetaEntrega: '2026-11-10',
    dataRealConclusao: null,
    slaStatus: 'ON_TIME',
    delayDaysCount: 0,
    daysInStage: 1,
    reworkCount: 0,
    isBlocked: false,
    caption: 'Pequenos ajustes na rotina geram grandes transformações clínicas. Confira os 3 pilares recomendados pelos nossos especialistas.',
    hashtags: '#saudeintegrativa #prevencao #clinicahorizonte',
    targetPlatforms: ['INSTAGRAM', 'TIKTOK', 'YOUTUBE'],
    publications: [
      { id: 'pub_chor_ig', platform: 'INSTAGRAM', isPublished: true, publishedAt: '10/11 às 18:00', postUrl: 'https://instagram.com/reel/demo1' },
      { id: 'pub_chor_tt', platform: 'TIKTOK', isPublished: true, publishedAt: '10/11 às 18:05', postUrl: 'https://tiktok.com/@demo/video/1' },
      { id: 'pub_chor_yt', platform: 'YOUTUBE', isPublished: false, publishedAt: null, postUrl: null }
    ],
    scenes: [
      { sceneNumber: 1, timeRange: '00:00 - 00:06', stageHook: 'Gancho (Hook)', visualAction: 'Especialista em plano médio olhando para a câmera no consultório.', voiceoverText: 'Você sabia que 70% das queixas de fadiga crônica começam em três hábitos simples do dia a dia?', letteringText: 'FADIGA CONSTANTE NÃO É NORMAL ⚠️' },
      { sceneNumber: 2, timeRange: '00:06 - 00:20', stageHook: 'Desenvolvimento', visualAction: 'Corte dinâmico mostrando check-up funcional.', voiceoverText: 'Qualidade do sono, hidratação celular e acompanhamento preventivo mudam completamente a sua longevidade.', letteringText: 'OS 3 PILARES DA LONGEVIDADE' },
      { sceneNumber: 3, timeRange: '00:20 - 00:35', stageHook: 'CTA', visualAction: 'Especialista sorrindo com indicação para o link da bio.', voiceoverText: 'Agende sua avaliação preventiva na unidade mais próxima clicando no link da bio.', letteringText: 'AGENDE SUA AVALIAÇÃO 📲 Link na Bio' }
    ],
    adaptations: [
      { unitId: 'unit_chor_sp', localCta: 'Agende na unidade Jardins (SP)!', localAddress: 'Av. Paulista, 1000 - São Paulo/SP', isScheduled: true },
      { unitId: 'unit_chor_pr', localCta: 'Agende na unidade Batel (Curitiba)!', localAddress: 'Av. do Batel, 500 - Curitiba/PR', isScheduled: true },
      { unitId: 'unit_chor_pe', localCta: 'Agende na unidade Boa Viagem (Recife)!', localAddress: 'Av. Boa Viagem, 1200 - Recife/PE', isScheduled: false },
      { unitId: 'unit_chor_mg', localCta: 'Agende na unidade Savassi (BH)!', localAddress: 'Rua Pernambuco, 300 - Belo Horizonte/MG', isScheduled: false }
    ],
    approvals: [
      { approverName: 'Roberto Almeida', approverRole: 'Diretor de Operações', status: 'APPROVED', comment: 'Roteiro aprovado, ótimo gancho inicial.' }
    ]
  },
  {
    id: 'dem_hkid_001',
    code: 'HKID-2026-001',
    brandId: 'brand_horizonte_kids',
    scope: 'SINGLE_UNIT',
    targetUnitIds: ['unit_hkid_fln'],
    naturezaDemanda: 'DIGITAL',
    title: 'Campanha de Aquecimento: Nova unidade Horizonte Kids chegando a Florianópolis',
    format: 'CAROUSEL',
    stage: 'SCRIPT_APPROVAL',
    priority: 'HIGH',
    campaignName: 'Expansão Sul',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_marina',
    publisherId: 'user_camila',
    approverId: 'user_roberto',
    currentAssigneeId: 'user_roberto',
    dataMetaEntrega: '2026-11-12',
    dataRealConclusao: null,
    slaStatus: 'ON_TIME',
    delayDaysCount: 0,
    daysInStage: 1,
    reworkCount: 0,
    isBlocked: false,
    caption: 'Florianópolis está prestes a receber um novo conceito em desenvolvimento infantil.',
    targetPlatforms: ['INSTAGRAM', 'FACEBOOK'],
    slides: [
      { slideNumber: 1, title: 'Um novo espaço para o futuro em Florianópolis.', bodyText: 'Arquitetura lúdica e equipe multidisciplinar integrada.' },
      { slideNumber: 2, title: 'Inauguração em Breve!', bodyText: 'Cadastre-se na lista de espera prioritária pelo link da bio.' }
    ]
  },
  {
    id: 'dem_chor_002',
    code: 'CHOR-2026-002',
    brandId: 'brand_clinica_horizonte',
    scope: 'SINGLE_UNIT',
    targetUnitIds: ['unit_chor_pe'],
    naturezaDemanda: 'DIGITAL',
    title: 'Tour pelo Novo Espaço de Reabilitação Funcional da Unidade Recife',
    format: 'REELS',
    stage: 'RECORDING',
    priority: 'URGENT',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_tiago',
    publisherId: 'user_camila',
    approverId: 'user_roberto',
    currentAssigneeId: 'user_rafael',
    dataMetaEntrega: '2026-11-08',
    dataRealConclusao: null,
    slaStatus: 'OVERDUE_OPEN',
    delayDaysCount: 1,
    delayReason: 'Atraso na gravação por indisponibilidade de agenda do especialista',
    stageWhereDelayed: 'RECORDING',
    daysInStage: 5,
    reworkCount: 1,
    isBlocked: true,
    blockedReason: 'Agenda da coordenação local em congresso externo até quinta-feira.',
    blockedTarget: 'Coordenação Local (Unidade Recife)',
    targetPlatforms: ['INSTAGRAM', 'TIKTOK']
  },
  {
    id: 'dem_catl_001',
    code: 'CATL-2026-001',
    brandId: 'brand_colegio_atlas',
    scope: 'GLOBAL_BRAND',
    targetUnitIds: [],
    naturezaDemanda: 'DIGITAL',
    title: 'Imersão Bilíngue e Raciocínio Lógico na Educação Infantil',
    format: 'CAROUSEL',
    stage: 'PUBLISHED_OR_DELIVERED',
    priority: 'HIGH',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_marina',
    publisherId: 'user_camila',
    approverId: 'user_roberto',
    currentAssigneeId: 'user_camila',
    dataMetaEntrega: '2026-11-04',
    dataRealConclusao: '2026-11-06T16:00:00Z',
    slaStatus: 'COMPLETED_LATE',
    delayDaysCount: 2,
    delayReason: 'Atraso na revisão pedagógica interna (QA Review)',
    stageWhereDelayed: 'QA_REVIEW',
    daysInStage: 0,
    reworkCount: 1,
    isBlocked: false,
    targetPlatforms: ['INSTAGRAM', 'LINKEDIN']
  },
  {
    id: 'dem_verp_001',
    code: 'VERP-2026-001',
    brandId: 'brand_vertice_erp',
    scope: 'GLOBAL_BRAND',
    targetUnitIds: [],
    naturezaDemanda: 'DIGITAL',
    title: 'DRE Automatizado para Redes de Franquias: Como eliminar furos de caixa',
    format: 'REELS',
    stage: 'PRODUCTION',
    priority: 'HIGH',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_tiago',
    publisherId: 'user_camila',
    approverId: 'user_helena',
    currentAssigneeId: 'user_tiago',
    dataMetaEntrega: '2026-11-16',
    dataRealConclusao: null,
    slaStatus: 'ON_TIME',
    delayDaysCount: 0,
    daysInStage: 2,
    reworkCount: 0,
    isBlocked: false,
    targetPlatforms: ['INSTAGRAM', 'YOUTUBE', 'LINKEDIN']
  },
  {
    id: 'dem_chor_off_001',
    code: 'CHOR-OFF-001',
    brandId: 'brand_clinica_horizonte',
    scope: 'SINGLE_UNIT',
    targetUnitIds: ['unit_chor_mg'],
    naturezaDemanda: 'OFFLINE',
    title: 'Fachada em ACM e Sinalização Externa da Unidade Savassi',
    format: 'OFFLINE_PRINT',
    stage: 'SCHEDULED_OR_PRINT',
    priority: 'HIGH',
    campaignName: 'Padronização Visual',
    ownerId: 'user_ana',
    copywriterId: 'user_lucas',
    producerId: 'user_rafael',
    editorId: 'user_marina',
    publisherId: 'user_camila',
    approverId: 'user_roberto',
    currentAssigneeId: 'user_marina',
    dataMetaEntrega: '2026-11-18',
    dataRealConclusao: null,
    slaStatus: 'ON_TIME',
    delayDaysCount: 0,
    daysInStage: 3,
    reworkCount: 0,
    isBlocked: false,
    targetPlatforms: ['MIDIA_OFF'],
    offlinePieceType: 'Fachada ACM + Totem de Entrada',
    offlineDimensions: '10m x 2.5m (Fachada) e 1.2m x 3.0m (Totem)',
    offlineColorSpecs: 'CMYK + Pantone 299C com proteção UV',
    offlineSupplier: 'Gráfica & Sinalização Demo Ltda',
    dataEnvioFornecedor: '2026-11-08',
    offlineNotes: 'Arquivos vetorizados em PDF/X-1a com sangria de 50mm.'
  }
];
