// MarTech Hub - Multi-Brand Operations OS Frontend Core Engine
// Architecture: Public Demo by Default + Local BYOD JSON Workspace (Zero-Cloud-Leakage)
// File: public/js/app.js

const STORAGE_KEY = 'martech_hub_workspace_v1';

const PIPELINE_STAGES = [
  { id: 'IDEA', labelDigital: '1. Ideia / Triagem', labelOffline: '1. Pedido / Briefing', slaDays: 2, color: 'text-slate-400' },
  { id: 'SCRIPTING', labelDigital: '2. Roteiro & Copy', labelOffline: '2. Especificação Técnica', slaDays: 3, color: 'text-sky-400' },
  { id: 'SCRIPT_APPROVAL', labelDigital: '3. Aprov. Roteiro', labelOffline: '3. Aprovação Conceito', slaDays: 2, color: 'text-amber-400' },
  { id: 'RECORDING', labelDigital: '4. Captação / Gravação', labelOffline: '4. Fotos / Medidas', slaDays: 4, color: 'text-indigo-400' },
  { id: 'PRODUCTION', labelDigital: '5. Edição / Design', labelOffline: '5. Criação / Fechamento', slaDays: 4, color: 'text-purple-400' },
  { id: 'QA_REVIEW', labelDigital: '6. Revisão (QA)', labelOffline: '6. Prova de Cor / Sangria', slaDays: 1, color: 'text-teal-400' },
  { id: 'FINAL_APPROVAL', labelDigital: '7. Aprov. Final Peça', labelOffline: '7. Aprovação Final', slaDays: 2, color: 'text-amber-300' },
  { id: 'ADJUSTMENT', labelDigital: '8. Ajustes / Correções', labelOffline: '8. Ajustes / Refação', slaDays: 2, color: 'text-rose-400' },
  { id: 'SCHEDULED_OR_PRINT', labelDigital: '9. Agendado', labelOffline: '9. Enviado Gráfica/Fornecedor', slaDays: 2, color: 'text-blue-400' },
  { id: 'PUBLISHED_OR_DELIVERED', labelDigital: '10. Publicado', labelOffline: '10. Entregue / Instalado', slaDays: 0, color: 'text-emerald-400' }
];

const NETWORK_PLATFORMS = [
  { id: 'ALL', label: 'Todas as Redes', icon: '🌐' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: '📸' },
  { id: 'TIKTOK', label: 'TikTok', icon: '🎵' },
  { id: 'YOUTUBE', label: 'YouTube', icon: '🎬' },
  { id: 'FACEBOOK', label: 'Facebook', icon: '👥' },
  { id: 'GOOGLE', label: 'Google Negócio', icon: '📍' },
  { id: 'LINKEDIN', label: 'LinkedIn', icon: '💼' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: '💬' }
];

// STATE MANAGEMENT
let state = {
  holding: { id: 'hold_demo', name: 'Grupo Vértice (Demo)', description: 'Modo Demonstração' },
  isCustomWorkspace: false,
  brands: [],
  units: [],
  channels: [],
  team: [],
  holidays: [],
  demands: [],
  filterBrand: 'ALL',
  filterUnit: 'ALL',
  filterNature: 'ALL',
  filterNetwork: 'ALL',
  filterScope: 'ALL',
  filterBlockedOnly: false,
  brandXrayMonth: 'ALL',
  expandAllBrandUnits: false,
  activeDrawerDemandId: null,
  currentDrawerSubTab: 'editor',
  inboxSearch: '',
  inboxSlaFilter: 'ALL'
};

// INITIALIZATION
function initState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.holding = parsed.holding || (typeof SEED_HOLDING !== 'undefined' ? JSON.parse(JSON.stringify(SEED_HOLDING)) : { id: 'hold_custom', name: 'Workspace Ativo' });
      state.isCustomWorkspace = Boolean(parsed.isCustomWorkspace);
      state.brands = parsed.brands || [];
      state.units = parsed.units || [];
      state.channels = parsed.channels || [];
      state.team = parsed.team || [];
      state.holidays = parsed.holidays || (typeof SEED_HOLIDAYS !== 'undefined' ? JSON.parse(JSON.stringify(SEED_HOLIDAYS)) : []);
      state.demands = parsed.demands || [];
    } catch (e) {
      loadDefaults();
    }
  } else {
    loadDefaults();
  }

  populateFilterSelectors();
  renderAll();
}

function loadDefaults() {
  state.holding = typeof SEED_HOLDING !== 'undefined'
    ? JSON.parse(JSON.stringify(SEED_HOLDING))
    : { id: 'hold_demo', name: 'Grupo Vértice (Demo)', description: 'Ambiente de Demonstração' };
  state.isCustomWorkspace = false;
  state.brands = JSON.parse(JSON.stringify(SEED_BRANDS));
  state.units = JSON.parse(JSON.stringify(SEED_UNITS));
  state.channels = JSON.parse(JSON.stringify(SEED_CHANNELS));
  state.team = JSON.parse(JSON.stringify(SEED_TEAM));
  state.holidays = JSON.parse(JSON.stringify(SEED_HOLIDAYS));
  state.demands = JSON.parse(JSON.stringify(SEED_DEMANDS));
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    holding: state.holding,
    isCustomWorkspace: state.isCustomWorkspace,
    brands: state.brands,
    units: state.units,
    channels: state.channels,
    team: state.team,
    holidays: state.holidays,
    demands: state.demands
  }));
}

function resetData() {
  const msg = state.isCustomWorkspace
    ? 'Deseja remover os dados privados deste navegador e voltar para os dados fictícios de demonstração? (Lembre-se de clicar em "Salvar Backup" antes se fez alterações novas!)'
    : 'Restaurar os dados originais do modo demonstração?';
  if (confirm(msg)) {
    localStorage.removeItem(STORAGE_KEY);
    state.filterBrand = 'ALL';
    state.filterUnit = 'ALL';
    state.filterNature = 'ALL';
    state.filterNetwork = 'ALL';
    loadDefaults();
    populateFilterSelectors();
    renderAll();
  }
}

// BYOD WORKSPACE IMPORT / EXPORT (.JSON LOCAL)
function handleWorkspaceFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported.brands) || !Array.isArray(imported.demands)) {
        alert('Arquivo JSON inválido: o arquivo precisa conter as listas "brands" e "demands".');
        return;
      }

      state.holding = imported.holding || {
        id: 'hold_imported',
        name: file.name.replace(/\.json$/i, ''),
        description: 'Workspace Local Importado'
      };
      state.isCustomWorkspace = true;
      state.brands = imported.brands || [];
      state.units = imported.units || [];
      state.channels = imported.channels || [];
      state.team = imported.team || [];
      state.holidays = imported.holidays || [];
      state.demands = imported.demands || [];
      state.filterBrand = 'ALL';
      state.filterUnit = 'ALL';
      state.filterNature = 'ALL';
      state.filterNetwork = 'ALL';

      saveState();
      populateFilterSelectors();
      renderAll();

      alert(`✓ Dados carregados localmente com sucesso!\n\nOrganização: ${state.holding.name}\nMarcas: ${state.brands.length}\nUnidades: ${state.units.length}\nDemandas: ${state.demands.length}\n\nSeus dados estão salvos exclusivamente neste navegador.`);
    } catch (err) {
      alert('Erro ao ler o arquivo JSON. Verifique se o arquivo está íntegro.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function exportWorkspaceJson() {
  const payload = {
    meta: {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'martech-hub'
    },
    holding: state.holding,
    isCustomWorkspace: state.isCustomWorkspace,
    brands: state.brands,
    units: state.units,
    channels: state.channels,
    team: state.team,
    holidays: state.holidays,
    demands: state.demands
  };

  const slug = (state.holding?.name || 'martech-workspace')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${slug}-backup-${dateStr}.json`;

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// POPULATE TOP SELECTORS & DYNAMIC HEADER LABELS
function populateFilterSelectors() {
  const holdingName = state.holding?.name || 'Grupo Vértice (Demo)';
  const brandCount = state.brands.length;
  const initials = holdingName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'M';

  // Header & Dynamic Titles
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setElText('pageTitle', `${holdingName} | MarTech Hub — Gestão Integrada de Marketing`);
  setElText('headerHoldingInitials', initials);
  setElText('headerHoldingName', holdingName);
  setElText('headerBrandCountBadge', `${brandCount} Marcas`);
  setElText('kpiBrandCountBadge', `${brandCount} Marcas`);
  setElText('xrayBrandCountSub', `• Todas as ${brandCount} Marcas (Em Produção vs. Entregues)`);
  setElText('tabHealthLabel', `Semáforo (${brandCount} Marcas)`);
  setElText('healthMatrixTitle', `Matriz Executiva das ${brandCount} Marcas (${holdingName})`);
  setElText('hierarchyViewTitle', `Hierarquia Corporativa: ${holdingName}`);
  setElText('hierarchyBrandCountBadge', `${brandCount} Marcas Ativas`);
  setElText('teamSectionTitle', `Produtividade e Carga da Equipe (${holdingName})`);
  setElText('teamCountBadge', `${state.team.length} Profissionais Monitorados`);

  const teamNamesSummary = state.team.map(t => `${t.name.split(' ')[0]} (${t.roleDescription.split('&')[0].trim()})`).join(' • ');
  setElText('teamSummarySubtitle', teamNamesSummary || 'Distribuição de demandas ativas por função operacional');

  const modeBadge = document.getElementById('workspaceModeBadge');
  if (modeBadge) {
    if (state.isCustomWorkspace) {
      modeBadge.innerText = '🔒 Workspace Privado Ativo (Local)';
      modeBadge.className = 'text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded';
    } else {
      modeBadge.innerText = 'Modo Demonstração (Dados Fictícios)';
      modeBadge.className = 'text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded';
    }
  }

  // Filter Selectors
  const brandSelect = document.getElementById('filterBrand');
  const unitSelect = document.getElementById('filterUnit');
  const newDemandBrand = document.getElementById('newDemandBrand');
  const newDemandSingleUnit = document.getElementById('newDemandSingleUnit');
  const newDemandOwner = document.getElementById('newDemandOwner');
  const approverSelector = document.getElementById('approverSelector');
  const routineMemberSelector = document.getElementById('routineMemberSelector');

  if (brandSelect) {
    brandSelect.innerHTML = `<option value="ALL">Todas as ${brandCount} Marcas</option>` +
      state.brands.map(b => `<option value="${b.id}">${b.name} (${b.code})</option>`).join('');
    brandSelect.value = state.filterBrand;
  }

  if (newDemandBrand) {
    newDemandBrand.innerHTML = state.brands.map(b => `<option value="${b.id}">${b.name} (${b.code})</option>`).join('');
  }

  if (unitSelect) {
    unitSelect.innerHTML = '<option value="ALL">Todas as Unidades (Visão Grupo)</option>' +
      state.units.map(u => {
        let regimeTag = u.regime === 'CESSAO_SEM_CONTEUDO' ? ' [Cessão]' : (u.regime === 'PRE_INAUGURACAO' ? ' [Pré-Inauguração]' : '');
        return `<option value="${u.id}">${u.name}${regimeTag}</option>`;
      }).join('');
    unitSelect.value = state.filterUnit;
  }

  if (newDemandSingleUnit) {
    newDemandSingleUnit.innerHTML = state.units.map(u => `<option value="${u.id}">${u.name} (${u.city}/${u.uf})</option>`).join('');
  }

  if (newDemandOwner) {
    newDemandOwner.innerHTML = state.team.map(m => `<option value="${m.id}">${m.name} (${m.roleDescription})</option>`).join('');
  }

  if (approverSelector) {
    const approvers = state.team.filter(m => m.role === 'APPROVER' || m.role === 'HEAD_OPERATIONS');
    const list = approvers.length > 0 ? approvers : state.team;
    approverSelector.innerHTML = list.map(m => `<option value="${m.id}">${m.name} (${m.roleDescription})</option>`).join('');
    setElText('approvalDirectorsSubtitle', `• ${list.map(m => m.name).join(' & ')}`);
  }

  if (routineMemberSelector) {
    const currentVal = routineMemberSelector.value;
    routineMemberSelector.innerHTML = state.team.map(m => `<option value="${m.id}">${m.name} (${m.roleDescription})</option>`).join('');
    if (currentVal && state.team.some(m => m.id === currentVal)) {
      routineMemberSelector.value = currentVal;
    }
  }

  // Holidays Ribbon
  if (state.holidays && state.holidays.length > 0) {
    const hText = state.holidays.map(h => {
      const parts = h.date.split('-');
      return `${parts[2]}/${parts[1]} (${h.name})`;
    }).join(' • ');
    setElText('calendarHolidaysRibbonText', hText);
  }
}

// FILTER HANDLERS
function handleFilterChange() {
  state.filterBrand = document.getElementById('filterBrand').value;
  state.filterUnit = document.getElementById('filterUnit').value;
  state.filterNature = document.getElementById('filterNature').value;
  renderAll();
}

function setNetworkFilter(networkId) {
  state.filterNetwork = networkId;
  renderAll();
}

function renderNetworkFilterPills() {
  const dashContainer = document.getElementById('dashboardNetworkPills');
  const calContainer = document.getElementById('calendarNetworkPills');

  const html = NETWORK_PLATFORMS.map(net => {
    const isActive = state.filterNetwork === net.id;
    return `
      <button onclick="setNetworkFilter('${net.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
        isActive
          ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30 font-semibold'
          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
      }">
        <span>${net.icon}</span>
        <span>${net.label}</span>
      </button>
    `;
  }).join('');

  if (dashContainer) dashContainer.innerHTML = html;
  if (calContainer) calContainer.innerHTML = html;
}

function toggleFilterBlockedOnly() {
  state.filterBlockedOnly = !state.filterBlockedOnly;
  const btn = document.getElementById('btnFilterBlockedOnly');
  if (state.filterBlockedOnly) {
    btn.classList.add('bg-rose-600', 'text-white', 'border-rose-500');
    btn.innerText = '✓ Mostrando Travados';
  } else {
    btn.classList.remove('bg-rose-600', 'text-white', 'border-rose-500');
    btn.innerText = 'Mostrar Apenas Travados';
  }
  renderKanban();
}

function filterOnlyBlocked() {
  state.filterBlockedOnly = true;
  const btn = document.getElementById('btnFilterBlockedOnly');
  if (btn) {
    btn.classList.add('bg-rose-600', 'text-white', 'border-rose-500');
    btn.innerText = '✓ Mostrando Travados';
  }
  renderKanban();
}

function getDemandNetworks(demand) {
  if (Array.isArray(demand.targetNetworks) && demand.targetNetworks.length > 0) {
    return demand.targetNetworks;
  }
  if (demand.naturezaDemanda === 'OFFLINE') return [];
  return ['INSTAGRAM'];
}

function getFilteredDemands() {
  return state.demands.filter(d => {
    if (state.filterBrand !== 'ALL' && d.brandId !== state.filterBrand) return false;
    if (state.filterNature !== 'ALL' && d.naturezaDemanda !== state.filterNature) return false;
    if (state.filterNetwork !== 'ALL') {
      const nets = getDemandNetworks(d);
      if (!nets.includes(state.filterNetwork)) return false;
    }
    if (state.filterUnit !== 'ALL') {
      if (d.scope === 'GLOBAL_BRAND') {
        const brandUnits = state.units.filter(u => u.brandId === d.brandId).map(u => u.id);
        if (!brandUnits.includes(state.filterUnit)) return false;
      } else {
        if (!d.targetUnitIds || !d.targetUnitIds.includes(state.filterUnit)) return false;
      }
    }
    if (state.filterBlockedOnly && !d.isBlocked) return false;

    return true;
  });
}

// TAB SWITCHER
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-slate-800', 'text-white', 'border-slate-700/50');
    btn.classList.add('text-slate-400', 'border-transparent');
  });
  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-slate-800', 'text-white', 'border-slate-700/50');
    activeBtn.classList.remove('text-slate-400', 'border-transparent');
  }

  const views = ['inbox', 'dashboard', 'calendar', 'kanban', 'approval', 'health', 'myroutine', 'management'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === tabId) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });

  if (tabId === 'inbox') renderInbox();
  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'calendar') renderCalendar();
  if (tabId === 'kanban') renderKanban();
  if (tabId === 'approval') renderApprovalView();
  if (tabId === 'health') renderBrandHealthTable();
  if (tabId === 'myroutine') renderMyRoutineView();
  if (tabId === 'management') renderHierarchyTree();
}

function renderAll() {
  renderNetworkFilterPills();
  renderInbox();
  renderDashboard();
  renderCalendar();
  renderKanban();
  renderApprovalView();
  renderBrandHealthTable();
  renderMyRoutineView();
  renderHierarchyTree();
}

// SLA EVALUATION HELPER
function getSlaInfo(demand) {
  if (!demand.dataMetaEntrega) {
    return { status: 'NO_DATE', label: 'Sem data', badgeClass: 'bg-slate-800 text-slate-400' };
  }

  const isFinished = demand.stage === 'PUBLISHED_OR_DELIVERED';
  const meta = new Date(demand.dataMetaEntrega);
  const now = new Date('2026-11-09');

  if (isFinished) {
    if (!demand.dataRealConclusao) {
      return { status: 'COMPLETED_ON_TIME', label: '✓ No Prazo', badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    }
    const real = new Date(demand.dataRealConclusao);
    const diff = Math.ceil((real.getTime() - meta.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) {
      return { status: 'COMPLETED_ON_TIME', label: '✓ No Prazo', badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    } else {
      return { status: 'COMPLETED_LATE', label: `Concluído (+${diff}d)`, badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    }
  } else {
    const diff = Math.ceil((now.getTime() - meta.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) {
      return { status: 'OVERDUE_OPEN', label: `Atrasado (-${diff}d)`, badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold pulsing-red' };
    } else {
      return { status: 'ON_TIME', label: '✓ Em Dia', badgeClass: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' };
    }
  }
}

// --- 1. RENDER INBOX (CENTRAL DE PEDIDOS) ---
function renderInbox() {
  const demands = getFilteredDemands();
  const search = (document.getElementById('inboxSearchInput')?.value || '').toLowerCase();
  const slaFilter = document.getElementById('inboxSlaFilter')?.value || 'ALL';

  document.getElementById('badgeInboxCount').innerText = demands.length;
  document.getElementById('inboxStatTotal').innerText = demands.length;

  const finished = demands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED');
  const onTimeFinished = finished.filter(d => getSlaInfo(d).status === 'COMPLETED_ON_TIME').length;
  const onTimeRate = finished.length > 0 ? Math.round((onTimeFinished / finished.length) * 100) : 100;
  document.getElementById('inboxStatOnTime').innerText = `${onTimeRate}%`;

  const delayedOrBlocked = demands.filter(d => d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN').length;
  document.getElementById('inboxStatDelayed').innerText = delayedOrBlocked;

  const tableDemands = demands.filter(d => {
    if (search) {
      const matchText = (d.title + ' ' + d.code + ' ' + (d.campaignName || '')).toLowerCase();
      if (!matchText.includes(search)) return false;
    }
    if (slaFilter !== 'ALL') {
      const sla = getSlaInfo(d).status;
      if (sla !== slaFilter) return false;
    }
    return true;
  });

  const tbody = document.getElementById('inboxTableBody');
  tbody.innerHTML = tableDemands.map(d => {
    const brand = state.brands.find(b => b.id === d.brandId);
    const owner = state.team.find(t => t.id === d.ownerId);
    const assignee = state.team.find(t => t.id === d.currentAssigneeId);
    const sla = getSlaInfo(d);
    const stageObj = PIPELINE_STAGES.find(s => s.id === d.stage);
    const stageLabel = d.naturezaDemanda === 'OFFLINE' ? (stageObj ? stageObj.labelOffline : d.stage) : (stageObj ? stageObj.labelDigital : d.stage);

    return `
      <tr class="hover:bg-slate-800/40 transition cursor-pointer" onclick="openDemandDrawer('${d.id}')">
        <td class="py-3 px-3 font-mono">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sky-400">${d.code}</span>
            ${d.naturezaDemanda === 'OFFLINE'
              ? '<span class="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-bold">OFF</span>'
              : '<span class="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1 rounded font-bold">DIGITAL</span>'}
          </div>
        </td>
        <td class="py-3 px-3">
          <span class="font-semibold text-white block">${brand ? brand.name : 'Marca'}</span>
          <span class="text-[10px] text-slate-400">${d.scope === 'GLOBAL_BRAND' ? 'Global' : 'Individual'}</span>
        </td>
        <td class="py-3 px-3">
          <div class="font-semibold text-white line-clamp-1">${d.title}</div>
          ${d.isBlocked ? `<span class="text-[10px] text-rose-400 font-bold block">TRAVADO: ${d.blockedReason}</span>` : ''}
        </td>
        <td class="py-3 px-3 font-medium text-slate-300">
          ${d.format === 'OFFLINE_PRINT' ? 'Mídia Física' : d.format}
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-200">
            ${stageLabel}
          </span>
        </td>
        <td class="py-3 px-3">
          <span class="text-white font-medium block">${owner ? owner.name : 'Atendimento'} (Dono)</span>
          <span class="text-[10px] text-sky-400">Vez: ${assignee ? assignee.name : 'Equipe'}</span>
        </td>
        <td class="py-3 px-3 font-mono text-slate-300">
          ${d.dataMetaEntrega || '<span class="text-slate-500">Sem data</span>'}
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${sla.badgeClass}">
            ${sla.label}
          </span>
        </td>
        <td class="py-3 px-3 text-right">
          <button onclick="event.stopPropagation(); openDemandDrawer('${d.id}')" class="text-xs text-sky-400 hover:text-sky-300 font-medium">
            Abrir &rarr;
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Backlog cards
  const backlogContainer = document.getElementById('backlogListContainer');
  const backlogDemands = state.demands.filter(d => !d.dataMetaEntrega);
  if (backlogDemands.length === 0) {
    backlogContainer.innerHTML = '<div class="text-slate-500 text-xs italic col-span-3 py-2">Nenhuma ideia no backlog sem data. Todas as demandas estão agendadas no cronograma!</div>';
  } else {
    backlogContainer.innerHTML = backlogDemands.map(d => `
      <div onclick="openDemandDrawer('${d.id}')" class="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3 rounded-lg cursor-pointer transition space-y-1">
        <div class="flex items-center justify-between text-[10px]">
          <span class="font-mono text-sky-400 font-bold">${d.code}</span>
          <span class="text-amber-400 font-semibold">+ Definir Prazo</span>
        </div>
        <div class="text-xs font-semibold text-white truncate">${d.title}</div>
      </div>
    `).join('');
  }
}

function renderInboxTable() {
  renderInbox();
}

// --- 2. RENDER DASHBOARD EXECUTIVO & SLA ---
function handleBrandXrayMonthChange(monthVal) {
  state.brandXrayMonth = monthVal;
  renderBrandXrayTable();
}

function toggleExpandAllBrandRows() {
  state.expandAllBrandUnits = !state.expandAllBrandUnits;
  const txt = document.getElementById('btnToggleExpandText');
  if (txt) txt.innerText = state.expandAllBrandUnits ? 'Recolher Unidades' : 'Expandir Unidades';
  renderBrandXrayTable();
}

function renderBrandXrayTable() {
  const tbody = document.getElementById('brandXrayTableBody');
  if (!tbody) return;

  let html = '';
  state.brands.forEach(brand => {
    const brandDemands = state.demands.filter(d => {
      if (d.brandId !== brand.id) return false;
      if (state.brandXrayMonth !== 'ALL' && d.dataMetaEntrega && !d.dataMetaEntrega.startsWith(state.brandXrayMonth)) {
        return false;
      }
      return true;
    });

    const total = brandDemands.length;
    const ideaCount = brandDemands.filter(d => d.stage === 'IDEA').length;
    const prodCount = brandDemands.filter(d => !['IDEA', 'PUBLISHED_OR_DELIVERED'].includes(d.stage)).length;
    const blockedOrLateCount = brandDemands.filter(d => d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN').length;
    const deliveredCount = brandDemands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED').length;
    const pct = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;

    const brandUnits = state.units.filter(u => u.brandId === brand.id);

    html += `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-3 font-semibold text-white">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${brand.colorPrimary}"></span>
            <span>${brand.name}</span>
            <span class="text-[10px] font-mono text-slate-400">(${brand.code})</span>
            ${brandUnits.length > 0 ? `<span class="text-[10px] bg-slate-800 text-sky-400 px-1.5 py-0.2 rounded">${brandUnits.length} unid.</span>` : ''}
          </div>
        </td>
        <td class="py-3 px-3 text-center font-bold text-white">${total}</td>
        <td class="py-3 px-3 text-center text-slate-300">${ideaCount}</td>
        <td class="py-3 px-3 text-center text-sky-400 font-semibold">${prodCount}</td>
        <td class="py-3 px-3 text-center">
          ${blockedOrLateCount > 0
            ? `<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[11px]">${blockedOrLateCount} alerta(s)</span>`
            : '<span class="text-slate-500">0</span>'}
        </td>
        <td class="py-3 px-3 text-center text-emerald-400 font-bold">${deliveredCount}</td>
        <td class="py-3 px-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <div class="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
            </div>
            <span class="text-xs font-mono font-semibold text-slate-200 w-9">${pct}%</span>
          </div>
        </td>
      </tr>
    `;

    if (state.expandAllBrandUnits && brandUnits.length > 0) {
      brandUnits.forEach(u => {
        const uDemands = brandDemands.filter(d => d.scope === 'GLOBAL_BRAND' || (d.targetUnitIds && d.targetUnitIds.includes(u.id)));
        const uTotal = uDemands.length;
        const uDelivered = uDemands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED').length;
        const uPct = uTotal > 0 ? Math.round((uDelivered / uTotal) * 100) : 0;

        html += `
          <tr class="bg-slate-950/60 text-[11px] text-slate-400">
            <td class="py-2 pl-8 pr-3">↳ ${u.name} (${u.city}/${u.uf})</td>
            <td class="py-2 px-3 text-center">${uTotal}</td>
            <td class="py-2 px-3 text-center">${uDemands.filter(d => d.stage === 'IDEA').length}</td>
            <td class="py-2 px-3 text-center">${uDemands.filter(d => !['IDEA', 'PUBLISHED_OR_DELIVERED'].includes(d.stage)).length}</td>
            <td class="py-2 px-3 text-center">${uDemands.filter(d => d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN').length}</td>
            <td class="py-2 px-3 text-center text-emerald-400">${uDelivered}</td>
            <td class="py-2 px-3 text-right font-mono">${uPct}%</td>
          </tr>
        `;
      });
    }
  });

  tbody.innerHTML = html;
}

function renderDashboard() {
  const demands = getFilteredDemands();
  const finished = demands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED');
  const blocked = demands.filter(d => d.isBlocked);
  const overdueOpen = demands.filter(d => d.stage !== 'PUBLISHED_OR_DELIVERED' && getSlaInfo(d).status === 'OVERDUE_OPEN');

  document.getElementById('kpiTotalPlanned').innerText = demands.length;
  document.getElementById('kpiDigitalCount').innerText = demands.filter(d => d.naturezaDemanda === 'DIGITAL').length;
  document.getElementById('kpiOfflineCount').innerText = demands.filter(d => d.naturezaDemanda === 'OFFLINE').length;

  const onTimeFinished = finished.filter(d => getSlaInfo(d).status === 'COMPLETED_ON_TIME');
  const lateFinished = finished.filter(d => getSlaInfo(d).status === 'COMPLETED_LATE');

  document.getElementById('kpiOnTimeRate').innerText = `${finished.length > 0 ? Math.round((onTimeFinished.length / finished.length) * 100) : 100}%`;
  document.getElementById('kpiOnTimeCount').innerText = onTimeFinished.length;
  document.getElementById('kpiLateRate').innerText = lateFinished.length;
  document.getElementById('kpiOverdueOpenCount').innerText = overdueOpen.length;

  const overdueLabelEl = document.getElementById('kpiOverdueBottleneckLabel');
  if (overdueLabelEl) {
    if (overdueOpen.length > 0) {
      overdueLabelEl.innerText = overdueOpen[0].code;
    } else if (blocked.length > 0) {
      overdueLabelEl.innerText = blocked[0].code;
    } else {
      overdueLabelEl.innerText = 'Nenhum gargalo';
    }
  }

  // Blocker Ribbon
  const ribbon = document.getElementById('blockerRibbon');
  const blockerCountText = document.getElementById('blockerCountText');
  if (blocked.length > 0) {
    ribbon.classList.remove('hidden');
    blockerCountText.innerText = `${blocked.length} Demanda(s) Travada(s) no Pipeline`;
  } else {
    ribbon.classList.add('hidden');
  }

  // Brand X-Ray Table
  renderBrandXrayTable();

  // Dynamic Delay Origin Grid
  const originGrid = document.getElementById('delayOriginGrid');
  if (originGrid) {
    const recIssues = demands.filter(d => d.stage === 'RECORDING' && (d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN'));
    const offIssues = demands.filter(d => d.naturezaDemanda === 'OFFLINE' && (d.isBlocked || ['OVERDUE_OPEN', 'COMPLETED_LATE'].includes(getSlaInfo(d).status)));
    const qaIssues = demands.filter(d => ['QA_REVIEW', 'SCRIPT_APPROVAL', 'FINAL_APPROVAL'].includes(d.stage) && (d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN'));
    const prodIssues = demands.filter(d => d.stage === 'PRODUCTION' && (d.isBlocked || getSlaInfo(d).status === 'OVERDUE_OPEN'));

    originGrid.innerHTML = `
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <span class="text-slate-400 block text-[10px]">Atraso / Blocker em Captação:</span>
        <b class="${recIssues.length > 0 ? 'text-rose-400' : 'text-emerald-400'} text-sm">${recIssues.length} card(s)</b>
        <span class="text-[10px] text-slate-500 block truncate">${recIssues[0] ? recIssues[0].blockedReason || recIssues[0].code : 'Captações dentro do SLA'}</span>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <span class="text-slate-400 block text-[10px]">Fornecedor / Mídia Física:</span>
        <b class="${offIssues.length > 0 ? 'text-amber-400' : 'text-emerald-400'} text-sm">${offIssues.length} card(s)</b>
        <span class="text-[10px] text-slate-500 block truncate">${offIssues[0] ? `${offIssues[0].code} (${offIssues[0].offlineSupplier || 'Fornecedor'})` : 'Entregas gráficas em dia'}</span>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <span class="text-slate-400 block text-[10px]">Revisão QA / Aprovação:</span>
        <b class="${qaIssues.length > 0 ? 'text-amber-400' : 'text-emerald-400'} text-sm">${qaIssues.length} card(s)</b>
        <span class="text-[10px] text-slate-500 block truncate">${qaIssues[0] ? qaIssues[0].code : 'Validações dentro do prazo'}</span>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <span class="text-slate-400 block text-[10px]">Edição & Design Interno:</span>
        <b class="${prodIssues.length > 0 ? 'text-rose-400' : 'text-emerald-400'} text-sm">${prodIssues.length} card(s)</b>
        <span class="text-[10px] ${prodIssues.length > 0 ? 'text-rose-400' : 'text-emerald-400'} block truncate">${prodIssues.length > 0 ? prodIssues[0].code : 'Equipe de criação em dia'}</span>
      </div>
    `;
  }

  // Bottlenecks list
  const bottleneckContainer = document.getElementById('dashboardBottleneckList');
  bottleneckContainer.innerHTML = PIPELINE_STAGES.map(stage => {
    const stageDemands = demands.filter(d => d.stage === stage.id);
    const count = stageDemands.length;
    const blockedCount = stageDemands.filter(d => d.isBlocked).length;
    const avgDays = count > 0 ? (stageDemands.reduce((sum, d) => sum + (d.daysInStage || 0), 0) / count).toFixed(1) : 0;
    const isCritical = (count > 0 && avgDays > stage.slaDays) || blockedCount > 0;

    return `
      <div class="flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
        isCritical ? 'bg-rose-950/20 border-rose-800/60' : 'bg-slate-950/60 border-slate-800/80'
      }">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-rose-500 pulsing-red' : 'bg-slate-600'}"></span>
          <div>
            <span class="font-semibold text-white">${stage.labelDigital}</span>
            <span class="text-[10px] text-slate-400 ml-2">SLA: ${stage.slaDays}d</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-slate-400 text-[11px]">Média: <b class="${avgDays > stage.slaDays ? 'text-rose-400' : 'text-slate-200'}">${avgDays}d</b></span>
          <span class="px-2 py-0.5 rounded text-xs font-semibold ${count > 0 ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-500'}">
            ${count} cards
          </span>
          ${blockedCount > 0 ? `<span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 pulsing-red">TRAVADO: ${blockedCount}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Unit coverage
  const coverageTbody = document.getElementById('dashboardUnitCoverageBody');
  coverageTbody.innerHTML = state.units.map(u => {
    const unitDemands = state.demands.filter(d => {
      return (d.scope === 'GLOBAL_BRAND' && d.brandId === u.brandId) || (d.targetUnitIds && d.targetUnitIds.includes(u.id));
    });
    const scheduled = unitDemands.length;
    const isCessao = u.regime === 'CESSAO_SEM_CONTEUDO';
    const isRisk = !isCessao && scheduled === 0;

    let regimeBadge = '<span class="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded">Gestão</span>';
    if (u.regime === 'PRE_INAUGURACAO') regimeBadge = '<span class="text-[10px] bg-amber-500/10 text-amber-400 px-1 rounded">Lançamento</span>';
    if (isCessao) regimeBadge = '<span class="text-[10px] bg-slate-800 text-slate-400 px-1 rounded">Cessão</span>';

    return `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2">
          <span class="font-semibold text-white block">${u.name}</span>
          <span class="text-[10px] text-slate-400">${u.city} - ${u.uf}</span>
        </td>
        <td class="py-2">${regimeBadge}</td>
        <td class="py-2 text-center font-bold ${isRisk ? 'text-rose-400' : 'text-slate-200'}">${isCessao ? '-' : `${scheduled} posts`}</td>
        <td class="py-2 text-right">
          ${isCessao
            ? '<span class="text-[10px] text-slate-500 italic">Sem Demanda</span>'
            : (isRisk ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">Risco</span>' : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">Seguro</span>')}
        </td>
      </tr>
    `;
  }).join('');

  // Team Productivity Grid
  const teamGrid = document.getElementById('teamProductivityGrid');
  teamGrid.innerHTML = state.team.map(member => {
    const active = state.demands.filter(d => (d.currentAssigneeId === member.id || d.ownerId === member.id) && d.stage !== 'PUBLISHED_OR_DELIVERED').length;
    const isOver = active > member.maxActiveDemands;

    return `
      <div class="bg-slate-950 border ${isOver ? 'border-amber-500/60' : 'border-slate-800'} rounded-xl p-3.5 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-white">${member.name}</span>
          <span class="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">${member.roleDescription.split(' ')[0]}</span>
        </div>
        <div class="flex items-baseline justify-between text-xs">
          <span class="text-slate-400">Demandas ativas:</span>
          <span class="font-bold ${isOver ? 'text-amber-400' : 'text-sky-400'}">${active} / ${member.maxActiveDemands}</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div class="h-1.5 rounded-full ${isOver ? 'bg-amber-500' : 'bg-sky-500'}" style="width: ${Math.min(100, Math.round((active / member.maxActiveDemands) * 100))}%"></div>
        </div>
        <div class="text-[10px] text-slate-400 flex items-center justify-between pt-1">
          <span>Pontualidade: <b class="text-emerald-400">95%</b></span>
          <span>${isOver ? '<span class="text-amber-400 font-bold">Sobrecarregado</span>' : 'Equilibrado'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// --- 3. RENDER CALENDÁRIO EDITORIAL INTELIGENTE ---
function renderCalendar() {
  const container = document.getElementById('calendarDaysGrid');
  const demands = getFilteredDemands();
  const daysInMonth = 30;
  let html = '';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `2026-11-${String(day).padStart(2, '0')}`;

    const dayHolidays = (state.holidays || []).filter(h => h.date === dateStr);
    const holidayTag = dayHolidays.map(h =>
      `<div class="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded truncate mb-0.5">${String(day).padStart(2, '0')}/Nov: ${h.name}</div>`
    ).join('');

    const dayDemands = demands.filter(d => d.dataMetaEntrega === dateStr);

    html += `
      <div class="p-2 min-h-[110px] bg-slate-900/50 hover:bg-slate-800/40 transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-bold ${day === 9 ? 'bg-sky-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]' : 'text-slate-300'}">${day}</span>
            <span class="text-[9px] text-slate-500">${dayDemands.length > 0 ? `${dayDemands.length} entrega(s)` : ''}</span>
          </div>
          ${holidayTag}

          <div class="space-y-1 mt-1">
            ${dayDemands.map(d => {
              const isOff = d.naturezaDemanda === 'OFFLINE';
              return `
                <div onclick="openDemandDrawer('${d.id}')" class="p-1 rounded border ${isOff ? 'border-amber-500/50 bg-amber-950/60 text-amber-200' : 'border-sky-500/50 bg-sky-950/60 text-sky-200'} cursor-pointer hover:scale-[1.02] transition shadow-sm text-[10px] leading-tight">
                  <div class="flex items-center justify-between">
                    <span class="font-bold">${isOff ? '🏢 ' : ''}${d.code}</span>
                    ${d.isBlocked ? '<span class="text-rose-400 font-bold">!</span>' : ''}
                  </div>
                  <div class="truncate text-white font-medium">${d.title}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// --- 4. RENDER KANBAN (COM ADAPTAÇÃO MÍDIA OFF) ---
function renderKanban() {
  const container = document.getElementById('kanbanBoard');
  const demands = getFilteredDemands();

  container.innerHTML = PIPELINE_STAGES.map(stage => {
    const stageDemands = demands.filter(d => d.stage === stage.id);

    return `
      <div class="w-72 shrink-0 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col max-h-[calc(100vh-210px)] shadow-sm">
        <div class="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 rounded-t-xl">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}"></span>
            <h3 class="text-xs font-bold text-white tracking-tight">${stage.labelDigital}</h3>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
            ${stageDemands.length}
          </span>
        </div>

        <div class="p-2.5 overflow-y-auto space-y-2.5 flex-1">
          ${stageDemands.map(d => {
            const isOff = d.naturezaDemanda === 'OFFLINE';
            const sla = getSlaInfo(d);
            const assignee = state.team.find(t => t.id === d.currentAssigneeId);

            return `
              <div onclick="openDemandDrawer('${d.id}')" class="bg-slate-950 border ${d.isBlocked ? 'border-rose-600 ring-1 ring-rose-500/50 shadow-lg' : 'border-slate-800 hover:border-slate-700'} rounded-xl p-3 cursor-pointer transition hover:scale-[1.01] space-y-2">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="font-mono font-bold text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">${d.code}</span>
                  <div class="flex items-center gap-1">
                    ${isOff ? '<span class="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">🏢 OFF</span>' : '<span class="text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded font-semibold">📱 DIGITAL</span>'}
                    <span class="px-1.5 py-0.5 rounded font-semibold ${sla.badgeClass}">${sla.label}</span>
                  </div>
                </div>

                <h4 class="text-xs font-semibold text-white leading-snug line-clamp-2">${d.title}</h4>

                ${d.isBlocked ? `
                  <div class="bg-rose-950/60 border border-rose-800/80 rounded p-2 text-[10px] text-rose-200">
                    <b class="text-rose-300">TRAVADO:</b> ${d.blockedReason}
                    <div class="text-[9px] text-rose-400">Destravar: <b class="text-white">${d.blockedTarget}</b></div>
                  </div>
                ` : ''}

                <div class="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Prazo: <b class="text-slate-200">${d.dataMetaEntrega || 'Sem data'}</b></span>
                  <span class="text-sky-400 font-medium">Vez: ${assignee ? assignee.name.split(' ')[0] : 'Equipe'}</span>
                </div>
              </div>
            `;
          }).join('')}

          ${stageDemands.length === 0 ? '<div class="p-6 text-center text-slate-600 text-xs italic">Nenhuma demanda nesta etapa</div>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

// --- 5. RENDER CENTRAL DE APROVAÇÃO ---
function renderApprovalView() {
  const container = document.getElementById('approvalQueueContainer');
  const demands = state.demands.filter(d => ['SCRIPT_APPROVAL', 'FINAL_APPROVAL', 'QA_REVIEW'].includes(d.stage));

  if (demands.length === 0) {
    container.innerHTML = '<div class="p-12 text-center text-slate-500 text-xs">🎉 Não há roteiros ou peças aguardando aprovação no momento!</div>';
    return;
  }

  container.innerHTML = demands.map(d => {
    const brand = state.brands.find(b => b.id === d.brandId);

    return `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-800">${d.code}</span>
              <span class="text-xs font-semibold text-slate-300">${brand ? brand.name : 'Marca'}</span>
              <span class="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                ${d.stage === 'SCRIPT_APPROVAL' ? 'Aprovação de Roteiro' : 'Aprovação Final da Peça'}
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-1.5">${d.title}</h3>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="quickApprove('${d.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm">
              ✓ Aprovar Agora
            </button>
            <button onclick="openDemandDrawer('${d.id}'); switchDrawerSubTab('approval');" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs border border-slate-700 transition">
              Pedir Ajuste / Correção
            </button>
          </div>
        </div>

        ${d.scenes && d.scenes.length > 0 ? `
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Estrutura das Cenas do Vídeo:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              ${d.scenes.map(sc => `
                <div class="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1">
                  <div class="flex items-center justify-between text-[11px] text-sky-400 font-semibold">
                    <span>Cena ${sc.sceneNumber} (${sc.timeRange})</span>
                    <span class="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px]">${sc.stageHook}</span>
                  </div>
                  <div class="text-white text-xs"><b>Fala:</b> "${sc.voiceoverText}"</div>
                  <div class="text-slate-400 text-[11px]"><b>Visual:</b> ${sc.visualAction}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${d.slides && d.slides.length > 0 ? `
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Lâminas do Carrossel:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              ${d.slides.map(sl => `
                <div class="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1">
                  <span class="text-indigo-400 font-bold text-[11px]">Lâmina ${sl.slideNumber}</span>
                  <div class="font-semibold text-white text-xs">${sl.title}</div>
                  <div class="text-slate-300 text-[11px]">${sl.bodyText}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function getSelectedApproverName() {
  const sel = document.getElementById('approverSelector');
  if (sel && sel.value) {
    const member = state.team.find(m => m.id === sel.value);
    if (member) return member.name;
  }
  return `Diretoria ${state.holding?.name || 'Executiva'}`;
}

function quickApprove(demandId) {
  const demand = state.demands.find(d => d.id === demandId);
  if (!demand) return;
  demand.stage = demand.stage === 'SCRIPT_APPROVAL' ? (demand.naturezaDemanda === 'OFFLINE' ? 'PRODUCTION' : 'RECORDING') : 'SCHEDULED_OR_PRINT';
  demand.approvals = demand.approvals || [];
  demand.approvals.unshift({
    approverName: getSelectedApproverName(),
    approverRole: 'Aprovador',
    status: 'APPROVED',
    comment: 'Aprovado com 1 clique pela Central de Aprovação.'
  });
  demand.isBlocked = false;
  saveState();
  renderAll();
  alert('✓ Demanda APROVADA com sucesso pela diretoria!');
}

// --- 6. RENDER MATRIZ SEMÁFORO DAS MARCAS ---
function renderBrandHealthTable() {
  const tbody = document.getElementById('brandHealthTableBody');
  tbody.innerHTML = state.brands.map(brand => {
    const brandDemands = state.demands.filter(d => d.brandId === brand.id);
    const planned = brandDemands.length;
    const published = brandDemands.filter(d => d.stage === 'PUBLISHED_OR_DELIVERED').length;
    const brandUnits = state.units.filter(u => u.brandId === brand.id);

    let unitInfo = 'Operação Única';
    if (brandUnits.length > 0) {
      const active = brandUnits.filter(u => u.regime === 'GESTAO_COMPLETA').length;
      const cessao = brandUnits.filter(u => u.regime === 'CESSAO_SEM_CONTEUDO').length;
      unitInfo = `${active} ativas${cessao > 0 ? ` (+${cessao} cessão)` : ''}`;
    }

    const plannedPercent = Math.min(100, Math.round((planned / brand.monthlyTargetPosts) * 100));

    let statusBadge = '<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Saudável</span>';
    if (plannedPercent < 60 || brandDemands.some(d => d.isBlocked)) {
      statusBadge = '<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 pulsing-red">Atenção/Travado</span>';
    }

    return `
      <tr class="hover:bg-slate-800/40">
        <td class="py-3 px-3 font-semibold text-white">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${brand.colorPrimary}"></span>
            ${brand.name}
            <span class="text-[10px] text-slate-400 font-mono">(${brand.code})</span>
          </div>
        </td>
        <td class="py-3 px-3 text-slate-400 text-xs">${brand.segment}</td>
        <td class="py-3 px-3 text-center text-slate-300 font-medium">${unitInfo}</td>
        <td class="py-3 px-3 text-center font-bold text-white">${brand.monthlyTargetPosts} posts</td>
        <td class="py-3 px-3 text-center">${planned} (${plannedPercent}%)</td>
        <td class="py-3 px-3 text-center">${published}</td>
        <td class="py-3 px-3 text-center">${statusBadge}</td>
        <td class="py-3 px-3 text-right">
          <button onclick="document.getElementById('filterBrand').value = '${brand.id}'; handleFilterChange(); switchTab('inbox');" class="text-xs text-sky-400 hover:text-sky-300 font-medium">
            Filtrar &rarr;
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// --- 7. RENDER MINHA ROTINA ---
function renderMyRoutineView() {
  const container = document.getElementById('myRoutineColumns');
  const selector = document.getElementById('routineMemberSelector');
  const memberId = selector?.value || (state.team[0] && state.team[0].id);
  const member = state.team.find(m => m.id === memberId) || state.team[0];
  const demands = state.demands.filter(d => (d.currentAssigneeId === memberId || d.ownerId === memberId) && d.stage !== 'PUBLISHED_OR_DELIVERED');

  const blocked = demands.filter(d => d.isBlocked);
  const ready = demands.filter(d => !d.isBlocked);

  container.innerHTML = `
    <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 class="text-xs font-bold text-white uppercase tracking-wider">🎯 Minhas Entregas Prontas p/ Ação</h3>
        <span class="text-xs bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-bold">${ready.length}</span>
      </div>
      <div class="space-y-2">
        ${ready.map(d => `
          <div onclick="openDemandDrawer('${d.id}')" class="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-lg cursor-pointer transition space-y-1">
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-mono font-bold text-sky-400">${d.code}</span>
              <span class="text-slate-300">Prazo: <b>${d.dataMetaEntrega || 'Sem data'}</b></span>
            </div>
            <h4 class="text-xs font-semibold text-white">${d.title}</h4>
            <div class="text-[11px] text-slate-400">Etapa: <b class="text-slate-200">${d.stage}</b></div>
          </div>
        `).join('')}
        ${ready.length === 0 ? '<div class="text-slate-500 text-xs py-4 text-center">Nenhuma entrega no momento</div>' : ''}
      </div>
    </div>

    <div class="bg-slate-950/70 border border-rose-900/50 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between border-b border-rose-900/50 pb-2">
        <h3 class="text-xs font-bold text-rose-300 uppercase tracking-wider">🛑 Demandas Travadas</h3>
        <span class="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold">${blocked.length}</span>
      </div>
      <div class="space-y-2">
        ${blocked.map(d => `
          <div onclick="openDemandDrawer('${d.id}')" class="bg-rose-950/20 border border-rose-800/80 p-3 rounded-lg cursor-pointer transition space-y-1">
            <span class="font-mono text-rose-400 text-[10px] font-bold">${d.code}</span>
            <h4 class="text-xs font-semibold text-white">${d.title}</h4>
            <div class="text-[11px] text-rose-300/80">${d.blockedReason}</div>
          </div>
        `).join('')}
        ${blocked.length === 0 ? '<div class="text-slate-500 text-xs py-4 text-center">Nenhum card travado</div>' : ''}
      </div>
    </div>

    <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
      <div class="border-b border-slate-800 pb-2">
        <h3 class="text-xs font-bold text-white uppercase tracking-wider">💡 Papel na Operação (${state.holding?.name || 'Holding'})</h3>
      </div>
      <div class="text-xs text-slate-300 space-y-2">
        <p><b>Profissional:</b> ${member ? member.name : 'Profissional'}</p>
        <p><b>Função:</b> ${member ? member.roleDescription : 'Operações'}</p>
        <p class="text-slate-400 text-[11px]">Ordene sempre pelas entregas mais próximas da Data Meta para garantir o cumprimento integral de SLA.</p>
      </div>
    </div>
  `;
}

// --- 8. RENDER HIERARQUIA CORPORATIVA DINÂMICA ---
function renderHierarchyTree() {
  const container = document.getElementById('hierarchyTreeContainer');
  if (!container) return;

  const holdingName = state.holding?.name || 'Grupo Vértice (Demo)';
  const initials = holdingName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'GV';

  const multiUnitBrands = state.brands.filter(b => state.units.some(u => u.brandId === b.id));
  const singleBrands = state.brands.filter(b => !state.units.some(u => u.brandId === b.id));

  container.innerHTML = `
    <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base">${initials}</span>
        <div>
          <h3 class="text-base font-bold text-white">${holdingName}</h3>
          <p class="text-xs text-slate-400">${state.holding?.description || `Holding Executiva (${state.brands.length} Marcas Ativas)`}</p>
        </div>
      </div>

      <div class="pl-6 border-l-2 border-slate-800 space-y-4">
        ${multiUnitBrands.map((b, idx) => {
          const bUnits = state.units.filter(u => u.brandId === b.id);
          return `
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" style="background-color: ${b.colorPrimary}"></span>
                  <h4 class="text-sm font-bold text-white">${idx + 1}. ${b.name} (${b.code})</h4>
                  <span class="text-xs text-slate-400">${bUnits.length} Unidade(s) Vinculada(s)</span>
                </div>
                <span class="text-[11px] text-slate-400">${b.segment}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
                ${bUnits.map(u => {
                  let regimeText = '<b class="text-emerald-400">Gestão Completa</b>';
                  if (u.regime === 'PRE_INAUGURACAO') regimeText = '<b class="text-amber-400">Pré-Inauguração</b>';
                  if (u.regime === 'CESSAO_SEM_CONTEUDO') regimeText = '<b class="text-slate-400">Cessão (Sem Conteúdo)</b>';
                  return `
                    <div class="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-0.5">
                      <div class="font-semibold text-white">${u.name}</div>
                      <div class="text-[10px] text-slate-400">${u.city}/${u.uf} • ${regimeText}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}

        ${singleBrands.length > 0 ? `
          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <h4 class="text-sm font-bold text-white mb-2">Marcas de Operação Única & Expansível (${singleBrands.length})</h4>
            <div class="flex flex-wrap gap-2 text-xs">
              ${singleBrands.map(b => `
                <span class="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" style="background-color: ${b.colorPrimary}"></span>
                  ${b.name} (${b.code})
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// --- 9. DRAWER LATERAL: ROTEIROS, MULTICANAL, MÍDIA OFF & MULTI-RESPONSÁVEIS ---
function openDemandDrawer(demandId) {
  state.activeDrawerDemandId = demandId;
  const demand = state.demands.find(d => d.id === demandId);
  if (!demand) return;

  document.getElementById('drawerCode').innerText = demand.code;
  document.getElementById('drawerTitleInput').value = demand.title;
  document.getElementById('drawerDataMetaInput').value = demand.dataMetaEntrega || '';

  // Badges
  const natureBadge = document.getElementById('drawerNatureBadge');
  if (demand.naturezaDemanda === 'OFFLINE') {
    natureBadge.innerText = '🏢 Mídia Off';
    natureBadge.className = 'text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded';
    document.getElementById('dtab-offline').classList.remove('hidden');
    renderOfflineSpecs(demand);
  } else {
    natureBadge.innerText = '📱 Digital';
    natureBadge.className = 'text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded';
    document.getElementById('dtab-offline').classList.add('hidden');
  }

  document.getElementById('drawerScopeBadge').innerText = demand.scope === 'GLOBAL_BRAND' ? 'Global' : 'Unidade Local';
  document.getElementById('drawerFormatBadge').innerText = demand.format;

  // 6 Responsáveis Fixos
  const owner = state.team.find(t => t.id === demand.ownerId);
  const copywriter = state.team.find(t => t.id === demand.copywriterId);
  const producer = state.team.find(t => t.id === demand.producerId);
  const editor = state.team.find(t => t.id === demand.editorId);
  const publisher = state.team.find(t => t.id === demand.publisherId);
  const approver = state.team.find(t => t.id === demand.approverId);
  const assignee = state.team.find(t => t.id === demand.currentAssigneeId);

  document.getElementById('drawerRoleOwner').innerText = owner ? owner.name : 'Atendimento';
  document.getElementById('drawerRoleCopywriter').innerText = copywriter ? copywriter.name : 'Copy/Roteiro';
  document.getElementById('drawerRoleProducer').innerText = producer ? producer.name : 'Captação';
  document.getElementById('drawerRoleEditor').innerText = editor ? editor.name : 'Edição/Design';
  document.getElementById('drawerRolePublisher').innerText = publisher ? publisher.name : 'Tráfego/Post';
  document.getElementById('drawerRoleApprover').innerText = approver ? approver.name : 'Diretoria';
  document.getElementById('drawerWhosTurn').innerText = assignee ? assignee.name : (owner ? owner.name : 'Equipe');

  // Video Metadata
  const brand = state.brands.find(b => b.id === demand.brandId);
  const firstUnit = state.units.find(u => demand.targetUnitIds && demand.targetUnitIds.includes(u.id));
  document.getElementById('drawerVideoSpeakers').innerText = demand.videoSpeakers || (brand ? `Especialista ${brand.name}` : 'Especialista Responsável');
  document.getElementById('drawerVideoRecordingInfo').innerText = demand.videoRecordingInfo || (firstUnit ? `${firstUnit.name} (${firstUnit.city}/${firstUnit.uf})` : 'Local e horário sob agendamento');

  // SLA Display
  const sla = getSlaInfo(demand);
  document.getElementById('drawerSlaBadge').innerText = sla.label;
  document.getElementById('drawerSlaBadge').className = `px-2 py-0.5 rounded text-xs font-semibold ${sla.badgeClass}`;
  document.getElementById('drawerDataRealDisplay').innerText = demand.dataRealConclusao ? demand.dataRealConclusao.split('T')[0] : 'Em aberto';

  document.getElementById('drawerDaysInStage').innerText = `${demand.daysInStage || 0} dias`;

  populateDrawerStageSelect(demand);
  renderScenesInDrawer(demand);
  renderSlidesInDrawer(demand);
  renderMultichannelInDrawer(demand);

  document.getElementById('drawerCaptionInput').value = demand.caption || '';
  document.getElementById('drawerHashtagsInput').value = demand.hashtags || '';
  document.getElementById('drawerDriveRaw').value = demand.driveRawUrl || '';
  document.getElementById('drawerDriveEdited').value = demand.driveEditedUrl || '';

  renderDrawerBlockerState(demand);
  renderDrawerAdaptations(demand);
  renderDrawerApprovals(demand);

  document.getElementById('demandDrawerBackdrop').classList.remove('hidden');
  document.getElementById('demandDrawer').classList.remove('translate-x-full');
}

function closeDrawer() {
  document.getElementById('demandDrawerBackdrop').classList.add('hidden');
  document.getElementById('demandDrawer').classList.add('translate-x-full');
  state.activeDrawerDemandId = null;
}

function populateDrawerStageSelect(demand) {
  const select = document.getElementById('drawerStageSelect');
  const isOff = demand.naturezaDemanda === 'OFFLINE';
  select.innerHTML = PIPELINE_STAGES.map(s => {
    const label = isOff ? s.labelOffline : s.labelDigital;
    return `<option value="${s.id}" ${demand.stage === s.id ? 'selected' : ''}>${label}</option>`;
  }).join('');
}

function switchDrawerSubTab(tab) {
  state.currentDrawerSubTab = tab;
  document.querySelectorAll('.dtab-btn').forEach(btn => {
    btn.classList.remove('border-sky-500', 'text-sky-400', 'font-semibold');
    btn.classList.add('border-transparent', 'text-slate-400');
  });
  const activeBtn = document.getElementById(`dtab-${tab}`);
  if (activeBtn) {
    activeBtn.classList.add('border-sky-500', 'text-sky-400', 'font-semibold');
    activeBtn.classList.remove('border-transparent', 'text-slate-400');
  }

  ['editor', 'multichannel', 'offline', 'adaptations', 'approval'].forEach(t => {
    const el = document.getElementById(`dview-${t}`);
    if (el) {
      if (t === tab) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
}

function renderMultichannelInDrawer(demand) {
  const networks = getDemandNetworks(demand);
  demand.networkChecklists = demand.networkChecklists || {};
  const doneCount = networks.filter(n => demand.networkChecklists[n]).length;
  const totalCount = networks.length;

  const badge = document.getElementById('dtabMultichannelBadge');
  if (badge) badge.innerText = `${doneCount}/${totalCount}`;

  const statusBadge = document.getElementById('multichannelStatusBadge');
  if (statusBadge) {
    if (totalCount === 0) {
      statusBadge.innerText = 'Mídia Física (Sem Redes)';
    } else if (doneCount === totalCount) {
      statusBadge.innerText = `✓ 100% Publicado (${doneCount}/${totalCount})`;
      statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    } else {
      statusBadge.innerText = `Publicação Parcial (${doneCount}/${totalCount})`;
      statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40';
    }
  }

  const togglesContainer = document.getElementById('drawerTargetPlatformsToggles');
  if (togglesContainer) {
    togglesContainer.innerHTML = NETWORK_PLATFORMS.filter(p => p.id !== 'ALL').map(p => {
      const isSelected = networks.includes(p.id);
      return `
        <button onclick="toggleDemandNetwork('${p.id}')" class="px-2 py-1 rounded text-[11px] font-medium border transition cursor-pointer ${
          isSelected ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
        }">
          ${p.icon} ${p.label}
        </button>
      `;
    }).join('');
  }

  const checklistContainer = document.getElementById('multichannelChecklistContainer');
  if (checklistContainer) {
    if (networks.length === 0) {
      checklistContainer.innerHTML = '<div class="text-slate-500 text-xs italic">Nenhuma rede digital selecionada para esta demanda.</div>';
    } else {
      checklistContainer.innerHTML = networks.map(netId => {
        const netObj = NETWORK_PLATFORMS.find(p => p.id === netId) || { id: netId, label: netId, icon: '📱' };
        const isChecked = Boolean(demand.networkChecklists[netId]);
        return `
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>${netObj.icon}</span>
              <span class="font-semibold text-white text-xs">${netObj.label}</span>
            </div>
            <label class="flex items-center gap-2 cursor-pointer text-xs">
              <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleNetworkPublished('${netId}', this.checked)">
              <span class="${isChecked ? 'text-emerald-400 font-bold' : 'text-slate-400'}">${isChecked ? '✓ Publicado' : 'Pendente'}</span>
            </label>
          </div>
        `;
      }).join('');
    }
  }
}

function toggleDemandNetwork(netId) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  const current = new Set(getDemandNetworks(demand));
  if (current.has(netId)) current.delete(netId);
  else current.add(netId);
  demand.targetNetworks = Array.from(current);
  saveState();
  renderMultichannelInDrawer(demand);
  renderAll();
}

function toggleNetworkPublished(netId, isChecked) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.networkChecklists = demand.networkChecklists || {};
  demand.networkChecklists[netId] = isChecked;
  const nets = getDemandNetworks(demand);
  if (nets.length > 0 && nets.every(n => demand.networkChecklists[n])) {
    demand.stage = 'PUBLISHED_OR_DELIVERED';
    if (!demand.dataRealConclusao) demand.dataRealConclusao = new Date().toISOString();
  }
  saveState();
  renderMultichannelInDrawer(demand);
  renderAll();
}

function copyCurrentDemandCaption() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  const text = `${demand.caption || ''}\n\n${demand.hashtags || ''}`.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    alert('✓ Legenda e hashtags copiadas para a área de transferência!');
  }
}

function renderScenesInDrawer(demand) {
  const container = document.getElementById('scenesTableContainer');
  const scenes = demand.scenes || [];
  document.getElementById('drawerScenesCountBadge').innerText = `${scenes.length} Cenas`;

  container.innerHTML = scenes.map((sc, idx) => `
    <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
      <div class="flex items-center justify-between text-xs border-b border-slate-800/80 pb-1.5">
        <div class="flex items-center gap-2">
          <span class="font-bold text-sky-400">Cena ${sc.sceneNumber}</span>
          <input type="text" value="${sc.timeRange}" onchange="updateScene(${idx}, 'timeRange', this.value)" class="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300 w-24">
          <span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">${sc.stageHook}</span>
        </div>
        <button onclick="removeScene(${idx})" class="text-rose-400 text-xs">&times; Excluir</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <label class="block text-[10px] text-slate-400 mb-0.5">Locução / Fala Exata:</label>
          <textarea onchange="updateScene(${idx}, 'voiceoverText', this.value)" rows="2" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white">${sc.voiceoverText}</textarea>
        </div>
        <div>
          <label class="block text-[10px] text-slate-400 mb-0.5">Visual & Lettering:</label>
          <input type="text" value="${sc.visualAction}" onchange="updateScene(${idx}, 'visualAction', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 mb-1">
          <input type="text" value="${sc.letteringText || ''}" onchange="updateScene(${idx}, 'letteringText', this.value)" placeholder="Lettering tela" class="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-300 font-mono text-[11px]">
        </div>
      </div>
    </div>
  `).join('');
}

function addSceneToCurrentDemand() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.scenes = demand.scenes || [];
  demand.scenes.push({
    sceneNumber: demand.scenes.length + 1,
    timeRange: '00:00 - 00:08',
    stageHook: 'Desenvolvimento',
    visualAction: 'Ação de câmera...',
    voiceoverText: 'Fala do especialista...',
    letteringText: 'TEXTO DESTAQUE'
  });
  saveState();
  renderScenesInDrawer(demand);
}

function removeScene(idx) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.scenes) return;
  demand.scenes.splice(idx, 1);
  demand.scenes.forEach((s, i) => s.sceneNumber = i + 1);
  saveState();
  renderScenesInDrawer(demand);
}

function updateScene(idx, field, val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.scenes || !demand.scenes[idx]) return;
  demand.scenes[idx][field] = val;
  saveState();
}

function renderSlidesInDrawer(demand) {
  const container = document.getElementById('slidesTableContainer');
  const slides = demand.slides || [];
  document.getElementById('drawerSlidesCountBadge').innerText = `${slides.length} Lâminas`;

  container.innerHTML = slides.map((sl, idx) => `
    <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
      <div class="flex items-center justify-between border-b border-slate-800 pb-1">
        <span class="font-bold text-indigo-400">Lâmina ${sl.slideNumber}</span>
        <button onclick="removeSlide(${idx})" class="text-rose-400">&times; Excluir</button>
      </div>
      <div>
        <label class="text-[10px] text-slate-400 block">Título na Arte:</label>
        <input type="text" value="${sl.title}" onchange="updateSlide(${idx}, 'title', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-semibold">
      </div>
      <div>
        <label class="text-[10px] text-slate-400 block">Texto da Lâmina:</label>
        <textarea onchange="updateSlide(${idx}, 'bodyText', this.value)" rows="2" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200">${sl.bodyText}</textarea>
      </div>
    </div>
  `).join('');
}

function addSlideToCurrentDemand() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.slides = demand.slides || [];
  demand.slides.push({
    slideNumber: demand.slides.length + 1,
    title: `Lâmina ${demand.slides.length + 1}`,
    bodyText: 'Texto explicativo...'
  });
  saveState();
  renderSlidesInDrawer(demand);
}

function removeSlide(idx) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.slides) return;
  demand.slides.splice(idx, 1);
  demand.slides.forEach((s, i) => s.slideNumber = i + 1);
  saveState();
  renderSlidesInDrawer(demand);
}

function updateSlide(idx, field, val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.slides || !demand.slides[idx]) return;
  demand.slides[idx][field] = val;
  saveState();
}

function renderOfflineSpecs(demand) {
  document.getElementById('drawerOffPieceType').value = demand.offlinePieceType || '';
  document.getElementById('drawerOffDimensions').value = demand.offlineDimensions || '';
  document.getElementById('drawerOffColorSpecs').value = demand.offlineColorSpecs || '';
  document.getElementById('drawerOffSupplier').value = demand.offlineSupplier || '';
  document.getElementById('drawerOffDataEnvio').value = demand.dataEnvioFornecedor || '';
  document.getElementById('drawerOffNotes').value = demand.offlineNotes || '';
}

function updateOfflineField(field, val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand[field] = val;
  saveState();
}

function renderDrawerAdaptations(demand) {
  const container = document.getElementById('adaptationsListContainer');
  const adaptations = demand.adaptations || [];
  document.getElementById('dtabAdaptationsCount').innerText = adaptations.length;

  if (adaptations.length === 0) {
    container.innerHTML = '<div class="text-slate-500 text-xs italic">Nenhuma adaptação necessária (Peça exclusiva de uma unidade).</div>';
    return;
  }

  container.innerHTML = adaptations.map((adp, idx) => {
    const unit = state.units.find(u => u.id === adp.unitId);
    return `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span class="font-bold text-white">${unit ? unit.name : 'Unidade'}</span>
          <label class="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
            <input type="checkbox" ${adp.isScheduled ? 'checked' : ''} onchange="toggleAdaptation(${idx}, this.checked)">
            <span>Agendado no Canal</span>
          </label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="text-slate-400 text-[10px] block">CTA / Chamada Local:</span>
            <input type="text" value="${adp.localCta || ''}" onchange="updateAdaptation(${idx}, 'localCta', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white">
          </div>
          <div>
            <span class="text-slate-400 text-[10px] block">Endereço da Praça:</span>
            <input type="text" value="${adp.localAddress || ''}" onchange="updateAdaptation(${idx}, 'localAddress', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded p-1 text-slate-300">
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleAdaptation(idx, isChecked) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.adaptations) return;
  demand.adaptations[idx].isScheduled = isChecked;
  saveState();
  renderAll();
}

function updateAdaptation(idx, field, val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand || !demand.adaptations) return;
  demand.adaptations[idx][field] = val;
  saveState();
}

function renderDrawerApprovals(demand) {
  const container = document.getElementById('drawerApprovalsHistory');
  const approvals = demand.approvals || [];
  if (approvals.length === 0) {
    container.innerHTML = '<div class="text-slate-500 text-xs italic">Nenhum parecer registrado ainda.</div>';
    return;
  }
  container.innerHTML = approvals.map(app => `
    <div class="bg-slate-900 border border-slate-800 rounded p-2 text-xs space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-bold text-white">${app.approverName}</span>
        <span class="text-[10px] font-bold ${app.status === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}">${app.status}</span>
      </div>
      <p class="text-slate-300 italic">"${app.comment || ''}"</p>
    </div>
  `).join('');
}

function submitDrawerApproval(status) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  const comment = document.getElementById('drawerApprovalComment').value;
  const ref = document.getElementById('drawerApprovalSceneRef').value;

  demand.approvals = demand.approvals || [];
  demand.approvals.unshift({
    approverName: getSelectedApproverName(),
    approverRole: 'Aprovador',
    status,
    sceneOrSlideRef: ref,
    comment,
    createdAt: new Date().toISOString()
  });

  if (status === 'APPROVED') {
    demand.stage = 'SCHEDULED_OR_PRINT';
    demand.isBlocked = false;
  } else if (status === 'CORRECTION_REQUESTED') {
    demand.stage = 'ADJUSTMENT';
  }

  saveState();
  renderAll();
  openDemandDrawer(demand.id);
  alert('Parecer registrado com sucesso!');
}

function markAsConcludedNow() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.dataRealConclusao = new Date().toISOString();
  demand.stage = 'PUBLISHED_OR_DELIVERED';
  saveState();
  renderAll();
  openDemandDrawer(demand.id);
  alert('✓ Demanda concluída e baixada com registro exato de pontualidade!');
}

function updateDrawerDateMeta(val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.dataMetaEntrega = val;
  saveState();
  renderAll();
}

function handleDrawerStageChange(newStage) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.stage = newStage;
  demand.daysInStage = 0;
  saveState();
  renderAll();
}

function advanceStageCurrentDemand() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  const idx = PIPELINE_STAGES.findIndex(s => s.id === demand.stage);
  if (idx < PIPELINE_STAGES.length - 1) {
    demand.stage = PIPELINE_STAGES[idx + 1].id;
    demand.daysInStage = 0;
    saveState();
    renderAll();
    openDemandDrawer(demand.id);
  }
}

function deleteCurrentDemand() {
  if (confirm('Tem certeza que deseja excluir esta demanda do sistema?')) {
    state.demands = state.demands.filter(d => d.id !== state.activeDrawerDemandId);
    saveState();
    closeDrawer();
    renderAll();
  }
}

function renderDrawerBlockerState(demand) {
  const alertBox = document.getElementById('drawerBlockerAlert');
  const btn = document.getElementById('drawerBlockBtn');
  const btnText = document.getElementById('drawerBlockBtnText');

  if (demand.isBlocked) {
    alertBox.classList.remove('hidden');
    document.getElementById('drawerBlockerReasonText').innerText = demand.blockedReason || 'Gargalo no fluxo';
    document.getElementById('drawerBlockerTargetText').innerText = demand.blockedTarget || 'Gestor Responsável';
    btn.className = 'text-xs px-2.5 py-1 rounded font-medium border transition flex items-center gap-1.5 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20';
    btnText.innerText = 'Destravar Card';
  } else {
    alertBox.classList.add('hidden');
    btn.className = 'text-xs px-2.5 py-1 rounded font-medium border transition flex items-center gap-1.5 text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20';
    btnText.innerText = 'Marcar TRAVADO';
  }
}

function toggleCurrentDrawerBlocker() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  if (demand.isBlocked) {
    unblockCurrentDemand();
  } else {
    openBlockerModal(demand.id);
  }
}

function unblockCurrentDemand() {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (!demand) return;
  demand.isBlocked = false;
  demand.blockedReason = null;
  demand.blockedTarget = null;
  saveState();
  renderAll();
  renderDrawerBlockerState(demand);
}

function saveCurrentDrawerTitle(val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (demand) { demand.title = val; saveState(); renderAll(); }
}
function saveCurrentDrawerCaption(val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (demand) { demand.caption = val; saveState(); }
}
function saveCurrentDrawerHashtags(val) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (demand) { demand.hashtags = val; saveState(); }
}
function saveCurrentDrawerDrive(val, type) {
  const demand = state.demands.find(d => d.id === state.activeDrawerDemandId);
  if (demand) {
    if (type === 'raw') demand.driveRawUrl = val;
    else demand.driveEditedUrl = val;
    saveState();
  }
}

// --- 10. MODAIS: NOVO PEDIDO & BLOCKER ---
function openNewDemandModal() {
  document.getElementById('newDemandModalBackdrop').classList.remove('hidden');
}
function closeNewDemandModal() {
  document.getElementById('newDemandModalBackdrop').classList.add('hidden');
}

function handleNewNatureChange(val) {
  const formatSelect = document.getElementById('newDemandFormat');
  if (val === 'OFFLINE') {
    formatSelect.value = 'OFFLINE_PRINT';
  } else {
    if (formatSelect.value === 'OFFLINE_PRINT') formatSelect.value = 'REELS';
  }
}

function handleNewScopeRadio(val) {
  const box = document.getElementById('newDemandUnitSelectBox');
  if (val === 'SINGLE_UNIT') box.classList.remove('hidden');
  else box.classList.add('hidden');
}

function findTeamMemberIdByRole(role, fallbackId) {
  const found = state.team.find(t => t.role === role);
  return found ? found.id : (fallbackId || (state.team[0] ? state.team[0].id : 'user_default'));
}

function createDemandFromModal() {
  const title = document.getElementById('newDemandTitle').value.trim();
  if (!title) { alert('Informe o título do pedido'); return; }

  const brandId = document.getElementById('newDemandBrand').value;
  const naturezaDemanda = document.getElementById('newDemandNature').value;
  const format = document.getElementById('newDemandFormat').value;
  const dataMetaEntrega = document.getElementById('newDemandDateMeta').value || null;
  const scope = document.querySelector('input[name="newScope"]:checked').value;
  const ownerId = document.getElementById('newDemandOwner').value || findTeamMemberIdByRole('HEAD_OPERATIONS');
  const priority = document.getElementById('newDemandPriority').value;
  const singleUnit = document.getElementById('newDemandSingleUnit').value;

  const selectedNets = Array.from(document.querySelectorAll('input[name="newNetworks"]:checked')).map(el => el.value);

  const brand = state.brands.find(b => b.id === brandId);
  const code = `${brand ? brand.code : 'DEM'}-2026-${String(state.demands.length + 1).padStart(3, '0')}`;

  const newDemand = {
    id: 'dem_' + Date.now(),
    code,
    brandId,
    scope,
    targetUnitIds: scope === 'GLOBAL_BRAND' ? state.units.filter(u => u.brandId === brandId && u.regime === 'GESTAO_COMPLETA').map(u => u.id) : [singleUnit],
    naturezaDemanda,
    targetNetworks: naturezaDemanda === 'OFFLINE' ? [] : (selectedNets.length > 0 ? selectedNets : ['INSTAGRAM']),
    networkChecklists: {},
    title,
    format,
    stage: 'IDEA',
    priority,
    ownerId,
    copywriterId: findTeamMemberIdByRole('COPYWRITER_STRATEGIST', ownerId),
    producerId: findTeamMemberIdByRole('VIDEO_CAPTURE', ownerId),
    editorId: findTeamMemberIdByRole('VIDEO_EDITOR', ownerId),
    publisherId: findTeamMemberIdByRole('TRAFFIC_PUBLISHER', ownerId),
    approverId: findTeamMemberIdByRole('APPROVER', ownerId),
    currentAssigneeId: ownerId,
    dataMetaEntrega,
    dataRealConclusao: null,
    slaStatus: 'ON_TIME',
    delayDaysCount: 0,
    daysInStage: 0,
    reworkCount: 0,
    isBlocked: false,
    caption: title,
    hashtags: `#${brand ? brand.code.toLowerCase() : 'martech'}`,
    scenes: format === 'REELS' ? [
      { sceneNumber: 1, timeRange: '00:00 - 00:06', stageHook: 'Gancho (Hook)', visualAction: 'Ação inicial...', voiceoverText: 'Texto...', letteringText: 'ATENÇÃO' }
    ] : [],
    slides: format === 'CAROUSEL' ? [
      { slideNumber: 1, title: 'Capa', bodyText: 'Texto...' }
    ] : [],
    adaptations: []
  };

  state.demands.unshift(newDemand);
  saveState();
  closeNewDemandModal();
  document.getElementById('newDemandTitle').value = '';
  renderAll();
  openDemandDrawer(newDemand.id);
}

// Blocker Modal
let blockTargetId = null;
function openBlockerModal(id) {
  blockTargetId = id;
  document.getElementById('blockerModalBackdrop').classList.remove('hidden');
}
function closeBlockerModal() {
  document.getElementById('blockerModalBackdrop').classList.add('hidden');
  blockTargetId = null;
}
function confirmBlockDemand() {
  if (!blockTargetId) return;
  const demand = state.demands.find(d => d.id === blockTargetId);
  if (!demand) return;

  demand.isBlocked = true;
  demand.blockedReason = document.getElementById('blockerReasonSelect').value;
  demand.blockedTarget = document.getElementById('blockerTargetInput').value || 'Diretoria';
  demand.blockedAt = new Date().toISOString();

  saveState();
  closeBlockerModal();
  renderAll();
  if (state.activeDrawerDemandId === demand.id) {
    renderDrawerBlockerState(demand);
  }
}

// INICIALIZAÇÃO NATIVA
window.addEventListener('DOMContentLoaded', () => {
  initState();
});
