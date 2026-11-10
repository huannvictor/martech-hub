# MarTech Hub — Multi-Brand Marketing Operations OS

Plataforma web e motor de engenharia de operações de marketing (**MarTech OS**) projetado para holdings multimarcas e redes de franquias/unidades. O sistema unifica o fluxo de produção de conteúdo digital e mídia física (offline), roteirização estruturada em blocos, controle rigoroso de SLA (Data Meta vs. Data Real) e desdobramento territorial por unidade/CNPJ.

> **Nota de Arquitetura & Portfólio de Engenharia de Software:**  
> Este repositório contém a arquitetura de software, motor de regras de negócio (TypeScript / Prisma / SQL) e interface interativa client-side construídos sob medida para gestão operacional de marketing em escala. Por padrão, a aplicação executa em **Modo Demonstração** com uma holding fictícia (*Grupo Vértice*), utilizando a arquitetura **BYOD (*Bring Your Own Data*)** para carregamento local de dados operacionais reais sem exposição em nuvem pública.

---

## Principais Funcionalidades de Engenharia

1. **Arquitetura BYOD (*Bring Your Own Data*) & Zero-Cloud-Leakage:**
   - **Código Público + Dados Privados Locais:** A aplicação pode ser hospedada publicamente (Vercel, GitHub Pages, Cloudflare Pages) sem banco de dados exposto e sem necessidade de infraestrutura de autenticação para uso individual.
   - **Importação e Backup `.json` Instantâneo:** Através dos controles **`Carregar Meus Dados`** e **`Salvar Backup`** no cabeçalho, o usuário carrega seu próprio arquivo `.json` de workspace diretamente na memória local do navegador (`localStorage`), mantendo 100% dos dados sensíveis restritos à própria máquina.

2. **Pipeline Produtivo Híbrido (10 Etapas — Digital & Mídia Off):**
   - Fluxo unificado em 10 estágios (`IDEA` &rarr; `SCRIPTING` &rarr; `SCRIPT_APPROVAL` &rarr; `RECORDING` &rarr; `PRODUCTION` &rarr; `QA_REVIEW` &rarr; `FINAL_APPROVAL` &rarr; `ADJUSTMENT` &rarr; `SCHEDULED_OR_PRINT` &rarr; `PUBLISHED_OR_DELIVERED`).
   - Adaptação dinâmica de nomenclatura e metadados conforme a natureza da demanda (**Digital / Redes Sociais** vs. **Mídia Física / Gráfica** com dimensões, sangria, especificação de cor CMYK/Pantone e fornecedor).

3. **Motor de SLA Rigoroso & Rastreabilidade de 6 Papéis Fixos:**
   - Cálculo automático de pontualidade comparando `dataMetaEntrega` com `dataRealConclusao` (`ON_TIME`, `COMPLETED_ON_TIME`, `COMPLETED_LATE`, `OVERDUE_OPEN`).
   - Atribuição simultânea dos 6 papéis operacionais em cada demanda (*Atendimento/Dono*, *Roteiro/Copy*, *Captação*, *Edição/Design*, *Tráfego/Publicação* e *Aprovador Executivo*), evitando perda de histórico quando o card avança no funil.

4. **Construtores Estruturados (Cena a Cena & Lâmina a Lâmina):**
   - Editor de roteiros de vídeo (Reels/TikTok/Shorts) dividido por blocos de tempo, gancho (*hook*), ação visual, locução e *lettering*.
   - Construtor de carrosséis dividido por lâminas com título, copy e direção de arte.

5. **Escopo Territorial & Regimes Operacionais por Unidade:**
   - Suporte a demandas globais (`GLOBAL_BRAND`) com replicação automática de checklists locais por unidade (`GESTAO_COMPLETA`, `PRE_INAUGURACAO`) e isolamento automático de unidades em regime de cessão de marca (`CESSAO_SEM_CONTEUDO`).

---

## Estrutura do Projeto

```text
├── public/
│   ├── index.html              # SPA Interface (Tailwind CSS + Drawer Estruturado + BYOD Controls)
│   └── js/
│       ├── seed.js             # Dataset fictício de demonstração (Grupo Vértice - Demo)
│       └── app.js              # Core Frontend Engine, SLA Calculator & Local JSON Workspace Manager
├── prisma/
│   └── schema.prisma           # Modelagem relacional completa (PostgreSQL)
├── sql/
│   └── schema.sql              # DDL SQL puro com índices de performance
├── src/
│   ├── types/martech.ts        # Contratos e interfaces TypeScript
│   ├── data/seed-data.ts       # Seed tipado de demonstração
│   └── services/
│       └── martech-engine.ts   # Motor de regras de negócio (SLA, desdobramento multi-unidade)
├── server.js                   # Servidor HTTP estático zero-dependency para desenvolvimento local
└── vercel.json                 # Configuração de deploy imediato na Vercel
```

---

## Como Executar Localmente

```bash
# Iniciar o servidor local na porta 3000
npm start
```

Acesse `http://localhost:3000` no navegador.

---

## Como Utilizar com Dados Reais (Fluxo BYOD sem Risco de Vazamento)

1. Acesse a URL pública da aplicação (ex.: deploy na Vercel).
2. No canto superior direito, clique em **`Carregar Meus Dados`** e selecione seu arquivo privado `.json` de workspace.
3. O sistema substituirá imediatamente os dados de demonstração pelos dados reais apenas no seu navegador (`🔒 Workspace Privado Ativo (Local)`).
4. Ao finalizar o expediente ou antes de limpar o navegador, clique em **`Salvar Backup`** para baixar o arquivo `.json` atualizado com todas as novas pautas, aprovações e baixas de SLA.
