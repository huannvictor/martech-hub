// TypeScript Domain Types for MarTech Hub Multi-Brand Operations
// File: src/types/martech.ts

export type ScopeType = 'GLOBAL_BRAND' | 'MULTI_UNIT' | 'SINGLE_UNIT';

export type OperationalRegime =
  | 'GESTAO_COMPLETA'      // Gestão ativa integral de marketing
  | 'PRE_INAUGURACAO'      // Em expansão / campanhas de lançamento
  | 'CESSAO_SEM_CONTEUDO'; // Cessão de marca/locação (sem metas automáticas de posts)

export type DemandNature = 'DIGITAL' | 'OFFLINE';

export type PlatformType =
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'LINKEDIN'
  | 'GOOGLE_BUSINESS'
  | 'WHATSAPP'
  | 'MIDIA_OFF';

export type ContentFormat =
  | 'REELS'
  | 'CAROUSEL'
  | 'STATIC'
  | 'STORY'
  | 'YOUTUBE_VIDEO'
  | 'ARTICLE'
  | 'OFFLINE_PRINT';

export type PipelineStage =
  | 'IDEA'                 // 1. Ideia / Triagem
  | 'SCRIPTING'            // 2. Roteiro & Copy
  | 'SCRIPT_APPROVAL'      // 3. Aprovação de Roteiro
  | 'RECORDING'            // 4. Captação / Gravação
  | 'PRODUCTION'           // 5. Edição de Vídeo / Criação Design
  | 'QA_REVIEW'            // 6. Revisão Interna
  | 'FINAL_APPROVAL'       // 7. Aprovação Final da Peça
  | 'ADJUSTMENT'           // 8. Correções / Ajustes
  | 'SCHEDULED_OR_PRINT'   // 9. Agendado (Digital) OU Enviado Gráfica/Fornecedor (Off)
  | 'PUBLISHED_OR_DELIVERED'; // 10. Publicado (Digital) OU Entregue/Instalado (Off)

export type TeamRole =
  | 'ACCOMPANIMENT_LEAD'    // Atendimento / Dono da Demanda
  | 'COPYWRITER_STRATEGIST' // Roteirista / Copywriter
  | 'VIDEOMAKER_PRODUCER'   // Videomaker / Captação
  | 'VIDEO_EDITOR'          // Editor de Vídeo
  | 'DESIGNER'              // Designer Gráfico
  | 'PUBLISHER_TRAFFIC'     // Publicador / Tráfego
  | 'APPROVER';             // Diretor / Gestor Aprovador

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SlaStatus =
  | 'ON_TIME'             // Em dia (dentro do prazo)
  | 'OVERDUE_OPEN'        // Atrasado (em aberto)
  | 'COMPLETED_ON_TIME'   // Concluído no Prazo
  | 'COMPLETED_LATE';     // Concluído com Atraso

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'APPROVED_WITH_RESERVATIONS'
  | 'CORRECTION_REQUESTED';

export interface Holding {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Brand {
  id: string;
  holdingId: string;
  name: string;
  slug: string;
  code: string;
  segment: string;
  colorPrimary: string;
  colorSecondary: string;
  logoUrl?: string;
  brandVoiceGuidelines?: string;
  pillars: string[];
  monthlyTargetPosts: number;
  isMultiUnit: boolean;
}

export interface Unit {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  razaoSocial?: string;
  cnpj?: string;
  city: string;
  uf: string;
  address?: string;
  localManagerName?: string;
  localManagerEmail?: string;
  regime: OperationalRegime;
}

export interface Channel {
  id: string;
  brandId: string;
  unitId?: string | null;
  platform: PlatformType;
  handle: string;
  name: string;
  url?: string;
  followerCount: number;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  roleDescription: string;
  avatarUrl?: string;
  maxActiveDemands: number;
  isActive: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  city?: string | null;
  uf?: string | null;
  isNational: boolean;
}

export interface DemandScene {
  id?: string;
  demandId?: string;
  sceneNumber: number;
  timeRange: string;
  stageHook: string; // Gancho, Problema, Solução, Desenvolvimento, CTA
  visualAction: string;
  voiceoverText: string;
  letteringText?: string;
}

export interface DemandSlide {
  id?: string;
  demandId?: string;
  slideNumber: number;
  title: string;
  bodyText: string;
  footerCta?: string;
  visualDirection?: string;
}

export interface DemandAdaptation {
  id?: string;
  demandId?: string;
  unitId: string;
  channelId?: string | null;
  localCta?: string;
  localAddress?: string;
  localContact?: string;
  isScheduled: boolean;
  isPublished: boolean;
  publishedAt?: string | null;
}

export interface PublicationChecklistItem {
  id: string;
  platform: PlatformType; // 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'FACEBOOK' | 'GOOGLE_BUSINESS' | 'LINKEDIN' | 'WHATSAPP';
  unitId?: string | null;
  unitName?: string | null;
  isPublished: boolean;
  publishedAt?: string | null; // e.g. "10/11/2026 18:00"
  postUrl?: string | null;     // link opcional do post
  notes?: string | null;
}

export interface DemandApproval {
  id?: string;
  demandId?: string;
  approverId?: string | null;
  approverName: string;
  approverRole: string;
  status: ApprovalStatus;
  sceneOrSlideRef?: string | null;
  comment?: string | null;
  createdAt: string;
}

export interface Demand {
  id: string;
  code: string;
  brandId: string;
  scope: ScopeType;
  targetUnitIds: string[];
  naturezaDemanda: DemandNature; // DIGITAL vs OFFLINE

  title: string;
  description?: string;
  format: ContentFormat;
  stage: PipelineStage;
  priority: PriorityLevel;
  campaignName?: string;

  // 6 Responsáveis Fixos
  ownerId?: string | null;       // Atendimento / Acompanhamento
  copywriterId?: string | null;  // Roteirista / Copy
  producerId?: string | null;    // Captação / Produção
  editorId?: string | null;      // Edição / Design
  publisherId?: string | null;   // Publicação / Tráfego
  approverId?: string | null;    // Aprovador
  currentAssigneeId?: string | null; // De quem é a vez

  // Controle Rigoroso de SLA
  dataMetaEntrega?: string | null;   // Data final combinada (NUNCA SOBRESCREVER)
  dataRealConclusao?: string | null; // Data real de conclusão / publicação
  slaStatus: SlaStatus;
  delayDaysCount: number;
  delayReason?: string | null;
  stageWhereDelayed?: PipelineStage | null;

  daysInStage: number;
  stageEnteredAt: string;
  reworkCount: number;

  // Blocker (Travamento)
  isBlocked: boolean;
  blockedReason?: string | null;
  blockedTarget?: string | null;
  blockedAt?: string | null;

  // Digital & Multichannel
  targetPlatforms?: PlatformType[]; // e.g. ['INSTAGRAM', 'TIKTOK', 'YOUTUBE'] - Instagram default
  publications?: PublicationChecklistItem[]; // Checklist por rede / unidade
  caption?: string;
  hashtags?: string;
  driveRawUrl?: string;
  driveEditedUrl?: string;

  // Vídeo
  videoDurationSec?: number;
  videoToneOfVoice?: string;
  videoAudioTrack?: string;
  videoLightingTips?: string;
  videoSpeakers?: string;
  recordingDate?: string | null;
  recordingLocation?: string | null;
  recordingTime?: string | null;

  // Mídia Off / Material Físico
  offlinePieceType?: string | null; // Fachada, Tapume, Outdoor, Banner, Camiseta, Crachá, Apostila, Impresso
  offlineDimensions?: string | null; // 3x2m, A4, CMYK sangria
  offlineColorSpecs?: string | null;
  offlineSupplier?: string | null;
  dataEnvioFornecedor?: string | null;
  offlineNotes?: string | null;

  createdAt: string;
  updatedAt: string;

  scenes?: DemandScene[];
  slides?: DemandSlide[];
  adaptations?: DemandAdaptation[];
  approvals?: DemandApproval[];
}

// SLA Executive Metrics
export interface SlaExecutiveMetrics {
  totalPlanned: number;
  completedOnTimeCount: number;
  completedOnTimeRate: number; // %
  completedLateCount: number;
  completedLateRate: number; // %
  overdueOpenCount: number;
  onTimeOpenCount: number;
  delayStagesBreakdown: { [stage: string]: number };
}

export interface BrandProductionBreakdown {
  brandId: string;
  brandName: string;
  brandCode: string;
  activeUnitsCount: number;
  totalPlanned: number;
  todoCount: number; // IDEA stage
  inProductionCount: number; // SCRIPTING, SCRIPT_APPROVAL, RECORDING, PRODUCTION, QA_REVIEW, FINAL_APPROVAL, ADJUSTMENT
  inProductionSubStages: {
    scripting: number;
    scriptApproval: number;
    recording: number;
    production: number;
    qaReview: number;
    finalApproval: number;
    adjustment: number;
  };
  blockedOrOverdueCount: number;
  completedOnTimeCount: number;
  completedLateCount: number;
  totalCompletedCount: number;
  completionRate: number; // %
  units: {
    unitId: string;
    unitName: string;
    city: string;
    uf: string;
    regime: OperationalRegime;
    plannedCount: number;
    completedCount: number;
    inProductionCount: number;
    blockedCount: number;
  }[];
}
