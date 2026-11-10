-- MarTech Hub Schema - Multi-Brand Operations
-- Regime Operacional: gestao_completa | pre_inauguracao | cessao_sem_conteudo
-- Natureza: DIGITAL vs OFFLINE (Mídia Off / Materiais Físicos)
-- SLA: data_meta_entrega vs data_real_conclusao (Concluído no Prazo vs Concluído com Atraso)

CREATE TABLE IF NOT EXISTS holdings (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Grupo Vértice (Demo)',
    slug VARCHAR(100) UNIQUE NOT NULL DEFAULT 'grupo-vertice-demo',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(64) PRIMARY KEY,
    holding_id VARCHAR(64) NOT NULL REFERENCES holdings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    segment VARCHAR(100) NOT NULL,
    color_primary VARCHAR(20) DEFAULT '#0EA5E9',
    color_secondary VARCHAR(20) DEFAULT '#0F172A',
    logo_url TEXT,
    brand_voice_guidelines TEXT,
    pillars_json TEXT NOT NULL DEFAULT '[]',
    monthly_target_posts INTEGER DEFAULT 20,
    is_multi_unit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(20),
    city VARCHAR(100) NOT NULL,
    uf VARCHAR(10) NOT NULL,
    address TEXT,
    local_manager_name VARCHAR(150),
    local_manager_email VARCHAR(150),
    regime VARCHAR(30) DEFAULT 'GESTAO_COMPLETA', -- GESTAO_COMPLETA, PRE_INAUGURACAO, CESSAO_SEM_CONTEUDO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_units_brand_id ON units(brand_id);
CREATE INDEX IF NOT EXISTS idx_units_regime ON units(regime);

CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    unit_id VARCHAR(64) REFERENCES units(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    url TEXT,
    follower_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    role_description VARCHAR(100),
    avatar_url TEXT,
    max_active_demands INTEGER DEFAULT 12,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS holidays (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    city VARCHAR(100),
    uf VARCHAR(10),
    is_national BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS demands (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    scope VARCHAR(30) NOT NULL DEFAULT 'GLOBAL_BRAND', -- GLOBAL_BRAND, MULTI_UNIT, SINGLE_UNIT
    target_units_json TEXT NOT NULL DEFAULT '[]',
    natureza_demanda VARCHAR(30) NOT NULL DEFAULT 'DIGITAL', -- DIGITAL vs OFFLINE
    
    title VARCHAR(300) NOT NULL,
    description TEXT,
    format VARCHAR(50) NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'IDEA',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    campaign_name VARCHAR(200),

    -- Múltiplos responsáveis por demanda
    owner_id VARCHAR(64) REFERENCES team_members(id),       -- Atendimento / Dono da Demanda
    copywriter_id VARCHAR(64) REFERENCES team_members(id),  -- Roteiro / Copy
    producer_id VARCHAR(64) REFERENCES team_members(id),    -- Captação / Produção
    editor_id VARCHAR(64) REFERENCES team_members(id),      -- Edição / Design
    publisher_id VARCHAR(64) REFERENCES team_members(id),   -- Publicação / Tráfego
    approver_id VARCHAR(64) REFERENCES team_members(id),    -- Aprovador
    current_assignee_id VARCHAR(64) REFERENCES team_members(id), -- De quem é a vez

    -- Controle de Pontualidade & SLA (Data Meta vs Data Real)
    data_meta_entrega DATE,                                 -- Data combinada de entrega (NUNCA SOBRESCREVER)
    data_real_conclusao TIMESTAMP,                          -- Data real de conclusão / publicação
    sla_status VARCHAR(30) DEFAULT 'ON_TIME',               -- ON_TIME, OVERDUE_OPEN, COMPLETED_ON_TIME, COMPLETED_LATE
    delay_days_count INTEGER DEFAULT 0,                     -- Dias de atraso
    delay_reason TEXT,                                      -- Motivo do atraso
    stage_where_delayed VARCHAR(50),                        -- Etapa onde o atraso ocorreu

    days_in_stage INTEGER DEFAULT 0,
    stage_entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rework_count INTEGER DEFAULT 0,

    -- Blocker (Travamento)
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_reason TEXT,
    blocked_target VARCHAR(200),
    blocked_at TIMESTAMP,

    -- Metadados Digitais
    caption TEXT,
    hashtags TEXT,
    drive_raw_url TEXT,
    drive_edited_url TEXT,

    -- Metadados de Vídeo & Gravação
    video_duration_sec INTEGER DEFAULT 45,
    video_tone_of_voice VARCHAR(150),
    video_audio_track TEXT,
    video_lighting_tips TEXT,
    video_speakers TEXT,
    recording_date DATE,
    recording_location VARCHAR(200),
    recording_time VARCHAR(20),

    -- Metadados de Mídia Off / Material Físico
    offline_piece_type VARCHAR(100), -- Fachada, Tapume, Outdoor, Banner, Camiseta, Crachá, Apostila, Impresso
    offline_dimensions VARCHAR(100), -- ex: 3x2m, A4, CMYK com sangria de 5mm
    offline_color_specs VARCHAR(100),
    offline_supplier VARCHAR(200),
    data_envio_fornecedor DATE,
    offline_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_demands_brand ON demands(brand_id);
CREATE INDEX IF NOT EXISTS idx_demands_stage ON demands(stage);
CREATE INDEX IF NOT EXISTS idx_demands_sla ON demands(sla_status);
CREATE INDEX IF NOT EXISTS idx_demands_data_meta ON demands(data_meta_entrega);

CREATE TABLE IF NOT EXISTS demand_scenes (
    id VARCHAR(64) PRIMARY KEY,
    demand_id VARCHAR(64) NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    time_range VARCHAR(50) NOT NULL,
    stage_hook VARCHAR(50) NOT NULL,
    visual_action TEXT NOT NULL,
    voiceover_text TEXT NOT NULL,
    lettering_text TEXT,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS demand_slides (
    id VARCHAR(64) PRIMARY KEY,
    demand_id VARCHAR(64) NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
    slide_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    body_text TEXT NOT NULL,
    footer_cta VARCHAR(255),
    visual_direction TEXT,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS demand_adaptations (
    id VARCHAR(64) PRIMARY KEY,
    demand_id VARCHAR(64) NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
    unit_id VARCHAR(64) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    channel_id VARCHAR(64) REFERENCES channels(id) ON DELETE SET NULL,
    local_cta TEXT,
    local_address TEXT,
    local_contact VARCHAR(100),
    is_scheduled BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demand_approvals (
    id VARCHAR(64) PRIMARY KEY,
    demand_id VARCHAR(64) NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
    approver_id VARCHAR(64) REFERENCES team_members(id) ON DELETE SET NULL,
    approver_name VARCHAR(150) NOT NULL,
    approver_role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    scene_or_slide_ref VARCHAR(100),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
