// Business Logic & MarTech Engine - Multi-Brand Operations
// File: src/services/martech-engine.ts

import {
  Demand,
  Unit,
  Brand,
  TeamMember,
  PipelineStage,
  SlaStatus,
  SlaExecutiveMetrics
} from '../types/martech';

export const PIPELINE_STAGES: { id: PipelineStage; labelDigital: string; labelOffline: string; slaDays: number }[] = [
  { id: 'IDEA', labelDigital: '1. Ideia / Triagem', labelOffline: '1. Pedido / Briefing', slaDays: 2 },
  { id: 'SCRIPTING', labelDigital: '2. Roteiro & Copy', labelOffline: '2. Especificação Técnica', slaDays: 3 },
  { id: 'SCRIPT_APPROVAL', labelDigital: '3. Aprovação Roteiro', labelOffline: '3. Aprovação Conceito', slaDays: 2 },
  { id: 'RECORDING', labelDigital: '4. Captação / Gravação', labelOffline: '4. Coleta de Fotos / Medidas', slaDays: 4 },
  { id: 'PRODUCTION', labelDigital: '5. Edição Vídeo / Design', labelOffline: '5. Criação / Fechamento Arte', slaDays: 4 },
  { id: 'QA_REVIEW', labelDigital: '6. Revisão Interna (QA)', labelOffline: '6. Prova de Cor / Sangria', slaDays: 1 },
  { id: 'FINAL_APPROVAL', labelDigital: '7. Aprovação Final Peça', labelOffline: '7. Aprovação Final Impressão', slaDays: 2 },
  { id: 'ADJUSTMENT', labelDigital: '8. Ajustes / Correções', labelOffline: '8. Ajustes / Refação', slaDays: 2 },
  { id: 'SCHEDULED_OR_PRINT', labelDigital: '9. Agendado', labelOffline: '9. Enviado Gráfica/Fornecedor', slaDays: 2 },
  { id: 'PUBLISHED_OR_DELIVERED', labelDigital: '10. Publicado', labelOffline: '10. Entregue / Instalado', slaDays: 0 }
];

/**
 * 1. Calcula o Status Rigoroso de SLA para cada demanda
 * NUNCA sobrescreve a data planejada original!
 */
export function evaluateDemandSla(demand: Demand, currentDateStr: string = '2026-11-09'): {
  slaStatus: SlaStatus;
  delayDaysCount: number;
  label: string;
  badgeClass: string;
} {
  if (!demand.dataMetaEntrega) {
    return {
      slaStatus: 'ON_TIME',
      delayDaysCount: 0,
      label: 'Sem data meta',
      badgeClass: 'bg-slate-800 text-slate-400'
    };
  }

  const metaDate = new Date(demand.dataMetaEntrega);
  const isFinished = demand.stage === 'PUBLISHED_OR_DELIVERED';

  if (isFinished) {
    if (!demand.dataRealConclusao) {
      return {
        slaStatus: 'COMPLETED_ON_TIME',
        delayDaysCount: 0,
        label: 'Concluído no Prazo',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      };
    }

    const realDate = new Date(demand.dataRealConclusao);
    // Compara dia a dia
    const diffTime = realDate.getTime() - metaDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        slaStatus: 'COMPLETED_ON_TIME',
        delayDaysCount: 0,
        label: '✓ Concluído no Prazo',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      };
    } else {
      return {
        slaStatus: 'COMPLETED_LATE',
        delayDaysCount: diffDays,
        label: `Concluído com Atraso (+${diffDays}d)`,
        badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      };
    }
  } else {
    // Demanda em aberto
    const currentDate = new Date(currentDateStr);
    const diffTime = currentDate.getTime() - metaDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        slaStatus: 'OVERDUE_OPEN',
        delayDaysCount: diffDays,
        label: `Atrasado (-${diffDays}d)`,
        badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold pulsing-red'
      };
    } else {
      return {
        slaStatus: 'ON_TIME',
        delayDaysCount: 0,
        label: 'Em Dia',
        badgeClass: 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
      };
    }
  }
}

/**
 * 2. Calcula Métricas Executivas de SLA para o Dashboard
 */
export function calculateExecutiveSlaMetrics(demands: Demand[]): SlaExecutiveMetrics {
  const total = demands.length;
  let completedOnTime = 0;
  let completedLate = 0;
  let overdueOpen = 0;
  let onTimeOpen = 0;
  const delayStagesBreakdown: { [stage: string]: number } = {};

  demands.forEach(d => {
    const { slaStatus } = evaluateDemandSla(d);
    if (slaStatus === 'COMPLETED_ON_TIME') completedOnTime++;
    if (slaStatus === 'COMPLETED_LATE') {
      completedLate++;
      const stage = d.stageWhereDelayed || d.stage;
      delayStagesBreakdown[stage] = (delayStagesBreakdown[stage] || 0) + 1;
    }
    if (slaStatus === 'OVERDUE_OPEN') {
      overdueOpen++;
      const stage = d.stageWhereDelayed || d.stage;
      delayStagesBreakdown[stage] = (delayStagesBreakdown[stage] || 0) + 1;
    }
    if (slaStatus === 'ON_TIME') onTimeOpen++;
  });

  return {
    totalPlanned: total,
    completedOnTimeCount: completedOnTime,
    completedOnTimeRate: total > 0 ? Math.round((completedOnTime / total) * 100) : 0,
    completedLateCount: completedLate,
    completedLateRate: total > 0 ? Math.round((completedLate / total) * 100) : 0,
    overdueOpenCount: overdueOpen,
    onTimeOpenCount: onTimeOpen,
    delayStagesBreakdown
  };
}

/**
 * 3. Calcula Planejado vs. Executado respeitando o Regime Operacional
 * Unidades com 'cessao_sem_conteudo' NÃO geram metas de postagem!
 */
export function calculateBrandProgress(brand: Brand, units: Unit[], demands: Demand[]) {
  // Filtra unidades ativas com gestão completa
  const activeUnits = units.filter(u => u.brandId === brand.id && u.regime === 'GESTAO_COMPLETA');
  const brandDemands = demands.filter(d => d.brandId === brand.id);
  const publishedDemands = brandDemands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED');

  const meta = brand.monthlyTargetPosts;
  const planned = brandDemands.length;
  const published = publishedDemands.length;

  const plannedPercent = Math.min(100, Math.round((planned / meta) * 100));
  const publishedPercent = Math.round((published / meta) * 100);

  return {
    brandId: brand.id,
    brandName: brand.name,
    code: brand.code,
    activeUnitsCount: activeUnits.length,
    monthlyTarget: meta,
    planned,
    published,
    plannedPercent,
    publishedPercent,
    hasBlocker: brandDemands.some(d => d.isBlocked)
  };
}
