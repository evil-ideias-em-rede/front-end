export interface AudienciaParticipante {
  nome: string;
  partido: string;
}

export interface AudienciaPosicionamento {
  autor: string;
  partido?: string;
  texto: string;
}

export interface AudienciaProposta {
  id: string;
  titulo: string;
  descricao: string;
  posicionamentos: AudienciaPosicionamento[];
}

export interface AudienciaResumo {
  id: string;
  titulo: string;
  temaTags: string[];
  resumoCurto: string;
}

export interface AudienciaDetalhe extends AudienciaResumo {
  resumo: string;
  participantes: AudienciaParticipante[];
  propostas: AudienciaProposta[];
}

const DETALHES: Record<string, AudienciaDetalhe> = {
  'aud-001': {
    id: 'aud-001',
    titulo: 'Reforma do Ensino Médio em debate',
    temaTags: ['Educação', 'Ensino Médio'],
    resumoCurto: 'Audiência sobre carga horária, itinerários e formação técnica.',
    resumo:
      'Audiência pública da Comissão de Educação para discutir a reforma do Ensino Médio: carga horária da formação geral básica, organização dos itinerários formativos, ensino técnico integrado e impactos nas redes estaduais. Foram apresentados dados de evasão, depoimentos de estudantes e propostas de revisão da lei, com foco em equidade entre escolas públicas e privadas e na valorização da docência.',
    participantes: [
      { nome: 'Maria da Silva', partido: 'PT' },
      { nome: 'João Pereira', partido: 'PL' },
      { nome: 'Ana Costa', partido: 'PSDB' },
      { nome: 'Carlos Mota', partido: 'PSOL' },
      { nome: 'Fernanda Lima', partido: 'MDB' },
      { nome: 'Rafael Souza', partido: 'NOVO' },
    ],
    propostas: [
      {
        id: 'aud-001-p1',
        titulo: 'Ampliar a formação geral básica',
        descricao: 'Elevar a carga mínima da formação geral para 2.400 horas no Ensino Médio.',
        posicionamentos: [
          { autor: 'Maria da Silva', partido: 'PT', texto: 'Defende a ampliação como garantia de equidade e base comum.' },
          { autor: 'Rafael Souza', partido: 'NOVO', texto: 'Critica o engessamento e prefere flexibilidade dos itinerários.' },
        ],
      },
      {
        id: 'aud-001-p2',
        titulo: 'Integrar ensino técnico ao regular',
        descricao: 'Criar trilhas técnicas integradas com certificação ao fim de cada etapa.',
        posicionamentos: [
          { autor: 'João Pereira', partido: 'PL', texto: 'Apoia a integração como saída para empregabilidade jovem.' },
          { autor: 'Carlos Mota', partido: 'PSOL', texto: 'Alerta para o risco de formação precoce e precarizada.' },
        ],
      },
    ],
  },
  'aud-002': {
    id: 'aud-002',
    titulo: 'Marco regulatório da inteligência artificial',
    temaTags: ['Tecnologia', 'Direitos digitais'],
    resumoCurto: 'Audiência sobre regulação de IA, transparência e uso em sala de aula.',
    resumo:
      'Audiência pública para debater o marco regulatório da inteligência artificial no Brasil: classificação de riscos, transparência de modelos, direitos autorais, moderação de conteúdo sintético e usos educacionais. Especialistas defenderam sandbox regulatório, auditorias independentes e formação de professores para uso crítico da IA como fonte de pesquisa em sala de aula.',
    participantes: [
      { nome: 'Paulo Henrique', partido: 'PSD' },
      { nome: 'Luciana Alves', partido: 'REDE' },
      { nome: 'Marcos Vieira', partido: 'UNIÃO' },
      { nome: 'Beatriz Rocha', partido: 'PT' },
    ],
    propostas: [
      {
        id: 'aud-002-p1',
        titulo: 'Classificar sistemas por risco',
        descricao: 'Criar níveis de risco com obrigações proporcionais de transparência.',
        posicionamentos: [
          { autor: 'Luciana Alves', partido: 'REDE', texto: 'Defende classificação rígida para usos em educação e saúde.' },
          { autor: 'Marcos Vieira', partido: 'UNIÃO', texto: 'Pede regras mais leves para não travar startups.' },
        ],
      },
      {
        id: 'aud-002-p2',
        titulo: 'Rotular conteúdo gerado por IA',
        descricao: 'Exigir marcação visível em textos, imagens e vídeos sintéticos.',
        posicionamentos: [
          { autor: 'Beatriz Rocha', partido: 'PT', texto: 'Vê a rotulagem como base do letramento midiático.' },
          { autor: 'Paulo Henrique', partido: 'PSD', texto: 'Apoia, mas quer exceções para usos artísticos.' },
        ],
      },
    ],
  },
  'aud-003': {
    id: 'aud-003',
    titulo: 'Mudanças climáticas e proteção de biomas',
    temaTags: ['Meio ambiente', 'Clima'],
    resumoCurto: 'Audiência sobre metas de desmatamento zero e fundo climático.',
    resumo:
      'Audiência conjunta das comissões de Meio Ambiente e Agricultura para discutir metas de desmatamento zero, restauração de áreas degradadas, pagamento por serviços ambientais e o fundo climático para municípios. Cientistas apresentaram séries históricas de queimadas e parlamentares divergiram sobre prazos, fiscalização e compensações ao agronegócio.',
    participantes: [
      { nome: 'Ricardo Nunes', partido: 'MDB' },
      { nome: 'Sônia Guajajara', partido: 'PSOL' },
      { nome: 'Tereza Cristina', partido: 'PP' },
      { nome: 'Marina Duarte', partido: 'PV' },
    ],
    propostas: [
      {
        id: 'aud-003-p1',
        titulo: 'Meta de desmatamento zero até 2030',
        descricao: 'Fixar meta legal com monitoramento anual público por bioma.',
        posicionamentos: [
          { autor: 'Sônia Guajajara', partido: 'PSOL', texto: 'Defende a meta com participação de povos indígenas.' },
          { autor: 'Tereza Cristina', partido: 'PP', texto: 'Pede transição gradual com apoio técnico a produtores.' },
        ],
      },
      {
        id: 'aud-003-p2',
        titulo: 'Fundo climático para municípios',
        descricao: 'Destinar recursos a prevenção de enchentes e restauração local.',
        posicionamentos: [
          { autor: 'Marina Duarte', partido: 'PV', texto: 'Prioriza periferias e áreas de risco.' },
          { autor: 'Ricardo Nunes', partido: 'MDB', texto: 'Quer critérios objetivos de repasse por vulnerabilidade.' },
        ],
      },
    ],
  },
};

export const MOCK_AUDIENCIAS_RESUMO: AudienciaResumo[] = Object.values(DETALHES).map(
  ({ id, titulo, temaTags, resumoCurto }) => ({ id, titulo, temaTags, resumoCurto })
);

export function getMockAudienciaDetalhe(id: string): AudienciaDetalhe | null {
  return DETALHES[id] ?? null;
}
