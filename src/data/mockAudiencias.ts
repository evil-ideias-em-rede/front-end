export type PosicaoTema = 'favor' | 'contra' | 'neutro' | 'ambiguo';

export interface AudienciaParticipante {
  nome: string;
  /** Opcional: nem todos os participantes são políticos. */
  partido?: string;
  /** MOCK — será provido pelo backend após o processamento. */
  resumoArgumentos: string;
  /** Papel na audiência. 'presidente' = mediação imparcial (tag virá do backend). */
  papel?: 'presidente' | 'participante';
}

/** Espelha o formato do payload recebido pelo front-end. */
export interface FalaParticipante {
  id: string;
  autor: string;
  ordem_no_debate: number;
  /** Fala completa (texto integral da intervenção). */
  texto: string;
  resumo: string;
  objeto_do_posicionamento: string;
  taxonomia: Record<string, string[]>;
}

export interface AudienciaProposta {
  id: string;
  titulo: string;
  descricao: string;
  autor: string;
}

export interface AudienciaResumo {
  id: string;
  titulo: string;
  resumoCurto: string;
}

export interface AudienciaDetalhe extends AudienciaResumo {
  resumo: string;
  textoIntegral: string[];
  participantes: AudienciaParticipante[];
  falas: FalaParticipante[];
  propostas: AudienciaProposta[];
}

const DETALHES: Record<string, AudienciaDetalhe> = {
  'aud-001': {
    id: 'aud-001',
    titulo: 'Reforma do Ensino Médio em debate',
    resumoCurto: 'Audiência sobre carga horária, itinerários e formação técnica.',
    resumo:
      'Audiência pública da Comissão de Educação para discutir a reforma do Ensino Médio: carga horária da formação geral básica, organização dos itinerários formativos, ensino técnico integrado e impactos nas redes estaduais. Foram apresentados dados de evasão, depoimentos de estudantes e propostas de revisão da lei, com foco em equidade entre escolas públicas e privadas e na valorização da docência.',
    textoIntegral: [
      'A presidenta da Comissão de Educação abriu a sessão destacando que a reforma do Ensino Médio, em vigor desde 2017, precisa de revisão à luz dos dados de evasão e da sobrecarga de itinerários.',
      'Maria da Silva (PT) defendeu a ampliação da formação geral básica para 2.400 horas como garantia de equidade. Rafael Souza (NOVO) criticou o engessamento curricular e defendeu itinerários flexíveis.',
      'João Pereira (PL) apoiou a integração do ensino técnico ao regular. Carlos Mota (PSOL) alertou para o risco de formação precoce e precarizada.',
      'Encerrada a rodada de debates, a relatoria encaminhou duas propostas para sistematização, com prazo de quinze dias para emendas.',
    ],
    participantes: [
      { nome: 'Paulo Magalhães', partido: 'PSD', papel: 'presidente', resumoArgumentos: 'Presidiu a sessão; sem posicionamento registrado.' },
      { nome: 'Maria da Silva', partido: 'PT', resumoArgumentos: 'Defende a base comum de 2.400h como garantia de equidade entre redes pública e privada.' },
      { nome: 'Rafael Souza', partido: 'NOVO', resumoArgumentos: 'Critica o engessamento curricular e prefere itinerários flexíveis com foco em empreendedorismo.' },
      { nome: 'João Pereira', partido: 'PL', resumoArgumentos: 'Apoia trilhas técnicas certificadas como saída para a empregabilidade jovem.' },
      { nome: 'Carlos Mota', partido: 'PSOL', resumoArgumentos: 'Alerta para o risco de formação precoce e precarizada sem fiscalização de estágios.' },
      { nome: 'Fernanda Lima', partido: 'MDB', resumoArgumentos: 'Oscila entre ampliar a base comum e preservar itinerários técnicos regionais.' },
      { nome: 'Ana Costa', partido: 'PSDB', resumoArgumentos: 'Participou como ouvinte; sem falas registradas neste recorte.' },
    ],
    falas: [
      {
        id: 'aud-001-f1',
        autor: 'Maria da Silva',
        ordem_no_debate: 2,
        texto:
          'Sr. Presidente, defendo a ampliação da formação geral básica para 2.400 horas. A base comum é garantia de equidade: sem ela, aprofundamos o abismo entre escolas públicas e privadas. Apresento dados de proficiência que mostram queda justamente onde a flexibilização foi maior.',
        resumo: 'Defende a ampliação da base comum para 2.400h como garantia de equidade, com dados de proficiência.',
        objeto_do_posicionamento: 'A ampliação da formação geral básica e a defesa da base comum contra a flexibilização excessiva.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-001-f2',
        autor: 'Rafael Souza',
        ordem_no_debate: 3,
        texto:
          'A padronização nacional ignora vocações locais e trava parcerias com o setor produtivo. Critico o engessamento curricular: precisamos de itinerários flexíveis, com empreendedorismo e ensino técnico optativo.',
        resumo: 'Critica o engessamento e defende itinerários flexíveis com empreendedorismo e técnico optativo.',
        objeto_do_posicionamento: 'A manutenção de itinerários flexíveis contra a padronização curricular nacional.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-001-f3',
        autor: 'João Pereira',
        ordem_no_debate: 5,
        texto:
          'Apoio a integração do ensino técnico ao regular, com trilhas certificadas ao fim de cada etapa. É a saída mais concreta para a empregabilidade dos nossos jovens.',
        resumo: 'Apoia trilhas técnicas integradas e certificadas como via de empregabilidade jovem.',
        objeto_do_posicionamento: 'A integração do ensino técnico ao ensino regular com certificação por etapa.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Confiante'],
          'Credibilidade e Validação': ['Recursos Retóricos'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-001-f4',
        autor: 'Carlos Mota',
        ordem_no_debate: 6,
        texto:
          'Alerta: sem fiscalização de estágios e contrapartidas das empresas, a trilha técnica vira formação precoce e precarizada. Não podemos entregar adolescentes ao mercado sem proteção.',
        resumo: 'Alerta para o risco de precarização sem fiscalização de estágios e contrapartidas.',
        objeto_do_posicionamento: 'A crítica à integração técnica sem mecanismos de proteção ao estudante.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-001-f5',
        autor: 'Fernanda Lima',
        ordem_no_debate: 8,
        texto:
          'Concordo com a colega Maria quanto à importância da base comum, mas peço cautela: redes do interior dependem dos itinerários técnicos para manter os alunos na escola.',
        resumo: 'Concorda com a base comum, mas pede cautela para preservar itinerários técnicos no interior.',
        objeto_do_posicionamento: 'A conciliação entre base comum e itinerários técnicos regionais.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-001-f6',
        autor: 'Fernanda Lima',
        ordem_no_debate: 12,
        texto:
          'Depois de ouvir os dados da evasão no interior, revejo minha posição: impor 2.400 horas agora pode inviabilizar turnos noturnos. Sou contra a ampliação imediata sem transição.',
        resumo: 'Revê a posição e se diz contra a ampliação imediata sem transição para o noturno.',
        objeto_do_posicionamento: 'A crítica ao cronograma imediato da ampliação da carga horária.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Contrário'],
        },
      },
    ],
    propostas: [
      {
        id: 'aud-001-p1',
        titulo: 'Ampliar a formação geral básica',
        descricao: 'Elevar a carga mínima da formação geral para 2.400 horas no Ensino Médio, com transição para o noturno.',
        autor: 'Maria da Silva',
      },
      {
        id: 'aud-001-p2',
        titulo: 'Integrar ensino técnico ao regular',
        descricao: 'Criar trilhas técnicas integradas com certificação ao fim de cada etapa e fiscalização de estágios.',
        autor: 'João Pereira',
      },
    ],
  },
  'aud-002': {
    id: 'aud-002',
    titulo: 'Marco regulatório da inteligência artificial',
    resumoCurto: 'Audiência sobre regulação de IA, transparência e uso em sala de aula.',
    resumo:
      'Audiência pública para debater o marco regulatório da inteligência artificial no Brasil: classificação de riscos, transparência de modelos, direitos autorais, moderação de conteúdo sintético e usos educacionais.',
    textoIntegral: [
      'O relator abriu a audiência afirmando que o Brasil não pode regular a inteligência artificial nem por cópia de modelos estrangeiros nem por omissão.',
      'Luciana Alves (REDE) defendeu classificação rígida de risco para educação e saúde. Marcos Vieira (UNIÃO) pediu regras mais leves para não travar startups.',
      'Beatriz Rocha (PT) defendeu a rotulagem obrigatória de conteúdo sintético. A especialista Helena Prado apresentou evidências sobre vieses em correção automatizada.',
      'Como encaminhamento, a comissão acordou sistematizar duas propostas e convocar plataformas e universidades para a próxima rodada.',
    ],
    participantes: [
      { nome: 'Sérgio Cabral', partido: 'MDB', papel: 'presidente', resumoArgumentos: 'Presidiu a sessão; sem posicionamento registrado.' },
      { nome: 'Luciana Alves', partido: 'REDE', resumoArgumentos: 'Defende classificação rígida de risco para usos em educação e saúde.' },
      { nome: 'Marcos Vieira', partido: 'UNIÃO', resumoArgumentos: 'Pede regras leves e sandbox para não travar startups nacionais.' },
      { nome: 'Beatriz Rocha', partido: 'PT', resumoArgumentos: 'Vê a rotulagem de conteúdo sintético como base do letramento midiático.' },
      { nome: 'Helena Prado', resumoArgumentos: 'Pesquisadora convidada; apresentou evidências de vieses em correção automatizada de redações.' },
    ],
    falas: [
      {
        id: 'aud-002-f1',
        autor: 'Luciana Alves',
        ordem_no_debate: 2,
        texto:
          'Defendo classificação rígida de risco para sistemas usados em educação e saúde, com auditorias independentes e registro público de modelos de alto risco. Vieses em correção automatizada já prejudicaram estudantes.',
        resumo: 'Defende classificação rígida com auditorias e registro público de modelos de alto risco.',
        objeto_do_posicionamento: 'A classificação de sistemas de IA por nível de risco com obrigações de transparência.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-002-f2',
        autor: 'Marcos Vieira',
        ordem_no_debate: 4,
        texto:
          'Peço regras mais leves e um sandbox regulatório: exigências excessivas concentram o mercado em grandes plataformas e travam as startups brasileiras.',
        resumo: 'Pede sandbox e regras leves para não concentrar o mercado nem travar startups.',
        objeto_do_posicionamento: 'A crítica a exigências regulatórias excessivas e a defesa do sandbox.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-002-f3',
        autor: 'Helena Prado',
        ordem_no_debate: 7,
        texto:
          'Como pesquisadora, apresento evidências: corretores automatizados penalizam variedades linguísticas periféricas. Recomendo validação amostral antes de qualquer adoção em larga escala, sem me posicionar sobre o desenho legal.',
        resumo: 'Apresenta evidências de vieses e recomenda validação amostral, sem posição sobre o desenho legal.',
        objeto_do_posicionamento: 'A apresentação técnica de evidências sobre vieses, sem posicionamento legislativo.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa'],
          Posicionamento: ['Neutro'],
        },
      },
    ],
    propostas: [
      {
        id: 'aud-002-p1',
        titulo: 'Classificar sistemas por risco',
        descricao: 'Criar níveis de risco com obrigações proporcionais de transparência e auditorias independentes.',
        autor: 'Luciana Alves',
      },
      {
        id: 'aud-002-p2',
        titulo: 'Rotular conteúdo gerado por IA',
        descricao: 'Exigir marcação visível em textos, imagens e vídeos sintéticos, com exceções para usos artísticos.',
        autor: 'Beatriz Rocha',
      },
    ],
  },
  'aud-003': {
    id: 'aud-003',
    titulo: 'Mudanças climáticas e proteção de biomas',
    resumoCurto: 'Audiência sobre metas de desmatamento zero e fundo climático.',
    resumo:
      'Audiência conjunta das comissões de Meio Ambiente e Agricultura para discutir metas de desmatamento zero, restauração de áreas degradadas e fundo climático para municípios.',
    textoIntegral: [
      'A sessão conjunta foi aberta com séries históricas de queimadas por bioma, mostrando aceleração do desmatamento na Amazônia e no Cerrado.',
      'Sônia Guajajara (PSOL) defendeu a meta legal de desmatamento zero até 2030 com participação indígena. Tereza Cristina (PP) pediu transição gradual com apoio a produtores.',
      'Marina Duarte (PV) priorizou o fundo climático para municípios vulneráveis; Ricardo Nunes (MDB) cobrou critérios objetivos de repasse.',
    ],
    participantes: [
      { nome: 'Helena Nogueira', partido: 'PSDB', papel: 'presidente', resumoArgumentos: 'Presidiu a sessão; sem posicionamento registrado.' },
      { nome: 'Sônia Guajajara', partido: 'PSOL', resumoArgumentos: 'Defende a meta legal com participação de povos indígenas no monitoramento.' },
      { nome: 'Tereza Cristina', partido: 'PP', resumoArgumentos: 'Pede transição gradual com crédito e assistência a produtores.' },
      { nome: 'Marina Duarte', partido: 'PV', resumoArgumentos: 'Prioriza periferias e áreas de risco no fundo climático.' },
      { nome: 'Ricardo Nunes', partido: 'MDB', resumoArgumentos: 'Cobra critérios objetivos de repasse por vulnerabilidade.' },
    ],
    falas: [
      {
        id: 'aud-003-f1',
        autor: 'Sônia Guajajara',
        ordem_no_debate: 3,
        texto:
          'Defendo a fixação legal da meta de desmatamento zero até 2030, com participação de povos indígenas no monitoramento e pagamento por serviços ambientais às comunidades guardiãs.',
        resumo: 'Defende meta legal com monitoramento indígena e pagamento por serviços ambientais.',
        objeto_do_posicionamento: 'A meta de desmatamento zero até 2030 com participação indígena.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-003-f2',
        autor: 'Tereza Cristina',
        ordem_no_debate: 5,
        texto:
          'Peço transição gradual com apoio técnico e crédito: prazos rígidos sem assistência penalizam médios agricultores e geram insegurança jurídica.',
        resumo: 'Pede transição gradual com crédito, criticando prazos rígidos sem assistência.',
        objeto_do_posicionamento: 'A transição gradual com apoio a produtores contra prazos rígidos.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
    ],
    propostas: [
      {
        id: 'aud-003-p1',
        titulo: 'Meta de desmatamento zero até 2030',
        descricao: 'Fixar meta legal com monitoramento anual público por bioma.',
        autor: 'Sônia Guajajara',
      },
      {
        id: 'aud-003-p2',
        titulo: 'Fundo climático para municípios',
        descricao: 'Destinar recursos a prevenção de enchentes e restauração local.',
        autor: 'Marina Duarte',
      },
    ],
  },
  'aud-004': {
    id: 'aud-004',
    titulo: 'Plano Nacional de Educação Digital e Conectividade (MOCK)',
    resumoCurto: 'Mock: participantes, falas e propostas para teste de volume moderado.',
    resumo:
      'Audiência simulada para teste: participantes com falas classificadas, propostas com autoria e categorias de posicionamento ao tema.',
    textoIntegral: [
      'Sessão simulada do Plano Nacional de Educação Digital com dez participantes e falas classificadas por alinhamento, postura e credibilidade.',
      'Camila Ribeiro (PT) defendeu metas universais com recorte de equidade; Thiago Martins (NOVO) criticou a centralização federal.',
      'A relatoria fictícia consolidou as propostas com autoria identificada para teste das telas de participante e de outros debates.',
    ],
    participantes: [
      { nome: 'Otávio Rocha', partido: 'UNIÃO', papel: 'presidente', resumoArgumentos: 'Presidiu a sessão; sem posicionamento registrado.' },
      { nome: 'Camila Ribeiro', partido: 'PT', resumoArgumentos: 'Defende metas universais com recorte de equidade para Norte e Nordeste.' },
      { nome: 'Eduardo Tavares', partido: 'PL', resumoArgumentos: 'Apoia metas com cronograma por etapas e contrapartida de estados.' },
      { nome: 'Thiago Martins', partido: 'NOVO', resumoArgumentos: 'Critica a centralização e prefere vouchers contratados pelas escolas.' },
      { nome: 'Daniela Souza', partido: 'PSOL', resumoArgumentos: 'Defende prioridade para escolas rurais, quilombolas e indígenas.' },
      { nome: 'Renata Carvalho', partido: 'MDB', resumoArgumentos: 'Oscila entre piloto focalizado e escala nacional imediata.' },
      { nome: 'Patrícia Gomes', partido: 'PSDB', resumoArgumentos: 'Defende trilhas de formação docente por nível de proficiência.' },
      { nome: 'João Victor', partido: 'PV', resumoArgumentos: 'Participou como ouvinte; sem falas registradas neste recorte.' },
      { nome: 'Luciana Alves', partido: 'REDE', resumoArgumentos: 'Defende licenciamento aberto para materiais comprados com verba federal.' },
      { nome: 'Marcos Vieira', partido: 'UNIÃO', resumoArgumentos: 'Pede modelo híbrido com espelhos privados para picos de acesso.' },
      { nome: 'Maria da Silva', partido: 'PT', resumoArgumentos: 'Reforça a defesa da base comum também no contexto digital.' },
    ],
    falas: [
      {
        id: 'aud-004-f1',
        autor: 'Camila Ribeiro',
        ordem_no_debate: 2,
        texto:
          'Defendo a meta universal de conectividade como condição de equidade, usando dados de exclusão digital no Norte e Nordeste para justificar a urgência do investimento público.',
        resumo: 'Defende meta universal com dados de exclusão digital do Norte e Nordeste.',
        objeto_do_posicionamento: 'A universalização da conectividade escolar como política de equidade.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-004-f2',
        autor: 'Thiago Martins',
        ordem_no_debate: 4,
        texto:
          'Critico a centralização federal: prefiro vouchers de conectividade contratados diretamente pelas escolas, com concorrência entre operadoras.',
        resumo: 'Critica a centralização e propõe vouchers com concorrência entre operadoras.',
        objeto_do_posicionamento: 'A descentralização da contratação de conectividade via vouchers.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-004-f3',
        autor: 'Renata Carvalho',
        ordem_no_debate: 6,
        texto:
          'Apoio o piloto em escolas de baixo IDEB antes da escala nacional, pedindo avaliação independente de impacto em dois anos.',
        resumo: 'Apoia piloto focalizado com avaliação independente antes da escala.',
        objeto_do_posicionamento: 'O faseamento da política com piloto e avaliação de impacto.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-004-f4',
        autor: 'Renata Carvalho',
        ordem_no_debate: 11,
        texto:
          'Diante dos atrasos do piloto, sou contra manter o cronograma nacional: sem avaliação concluída, escalar é irresponsabilidade fiscal.',
        resumo: 'Revê a posição e se diz contra escalar sem avaliação concluída.',
        objeto_do_posicionamento: 'A crítica à escala nacional sem avaliação do piloto.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-004-f5',
        autor: 'Daniela Souza',
        ordem_no_debate: 7,
        texto:
          'Defendo prioridade para escolas rurais, quilombolas e indígenas, usando indicadores de evasão para justificar a focalização inicial.',
        resumo: 'Defende focalização inicial em escolas rurais, quilombolas e indígenas.',
        objeto_do_posicionamento: 'A priorização de escolas vulneráveis na conectividade.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Técnica'],
          'Credibilidade e Validação': ['Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-004-f6',
        autor: 'Patrícia Gomes',
        ordem_no_debate: 9,
        texto:
          'Registro posição técnica pela formação docente em trilhas por proficiência, sem entrar no mérito do desenho federativo do programa.',
        resumo: 'Posição técnica pela formação docente, sem mérito sobre o desenho federativo.',
        objeto_do_posicionamento: 'A formação docente por proficiência como ponto técnico.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Neutro'],
        },
      },
    ],
    propostas: [
      {
        id: 'aud-004-p1',
        titulo: 'Conectividade universal nas escolas públicas',
        descricao: 'Garantir banda larga de alta velocidade em 100% das escolas públicas até 2027.',
        autor: 'Camila Ribeiro',
      },
      {
        id: 'aud-004-p2',
        titulo: 'Vouchers de conectividade por escola',
        descricao: 'Repasse direto para contratação local com concorrência entre operadoras.',
        autor: 'Thiago Martins',
      },
      {
        id: 'aud-004-p3',
        titulo: 'Piloto com avaliação independente',
        descricao: 'Fase piloto em escolas de baixo IDEB com avaliação de impacto em dois anos.',
        autor: 'Renata Carvalho',
      },
      {
        id: 'aud-004-p4',
        titulo: 'Plataforma de conteúdos abertos',
        descricao: 'Repositório público com licenciamento aberto para materiais federais.',
        autor: 'Luciana Alves',
      },
    ],
  },
  'aud-005': {
    id: 'aud-005',
    titulo: 'PL das Fake News e liberdade de expressão',
    resumoCurto: 'Audiência sobre regulação de plataformas, moderação e liberdade de expressão.',
    resumo:
      'Audiência pública da Comissão de Comunicação para debater o PL das Fake News: tipificação de desinformação, moderação de conteúdo, coleta de dados, rotulagem de conteúdo sintético e os limites da liberdade de expressão. Jornalistas dos Twitter Files Brasil, parlamentares, juristas e representantes de plataformas divergiram sobre censura, privacidade e o papel do Judiciário.',
    textoIntegral: [
      'O presidente da Comissão abriu a sessão afirmando que o Congresso precisa decidir se o Brasil terá uma lei específica sobre desinformação ou se bastará aplicar a legislação vigente. Registrou a presença de jornalistas, parlamentares, juristas e representantes de plataformas.',
      'Eli Vieira Araujo Júnior, um dos responsáveis pelo Twitter Files Brasil, sustentou que fake news, desinformação e discurso de ódio não são tipos penais autônomos e que condutas ilícitas já estão previstas em lei. Defendeu um padrão amplo de liberdade de expressão e denunciou coleta de dados sem ordem judicial.',
      'O Deputado Arlindo Chinaglia rebateu com exemplos de incitação à violência e cobrou responsabilização das plataformas. O Deputado Luiz Philippe de Orléans e Bragança perguntou aos convidados quais instrumentos o Parlamento deveria acionar.',
      'A jurista Érica Gorga apresentou análise técnica sobre publicidade dos processos e Lei de Abuso de Autoridade. Representantes de plataformas defenderam transparência com auditoria externa e regras factíveis.',
      'Encerrada a rodada, a relatoria registrou sete propostas — do padrão amplo de expressão à tipificação eleitoral da desinformação — e convocou nova rodada com o Ministério da Justiça.',
    ],
    participantes: [
      { nome: 'Rita Camargo', partido: 'MDB', papel: 'presidente', resumoArgumentos: 'Presidiu a sessão; sem posicionamento registrado.' },
      { nome: 'Eli Vieira Araujo Júnior', resumoArgumentos: 'Diz que fake news e discurso de ódio não são crimes autônomos e denuncia censura e coleta de dados sem ordem judicial.' },
      { nome: 'Arlindo Chinaglia', partido: 'PT', resumoArgumentos: 'Defende a regulação com exemplos de incitação à violência e cobra responsabilidade das plataformas.' },
      { nome: 'Luiz Philippe de Orléans e Bragança', partido: 'PL', resumoArgumentos: 'Questiona os abusos relatados e cobra instrumentos parlamentares como impeachment e CPIs.' },
      { nome: 'David Ágape', resumoArgumentos: 'Corresponsável pelo Twitter Files Brasil; sustenta as revelações sobre moderação e cooperação com autoridades.' },
      { nome: 'Michael Shellenberger', resumoArgumentos: 'Jornalista americano; afirma que o Judiciário é o Poder que mais abusa para calar vozes.' },
      { nome: 'Érica Gorga', resumoArgumentos: 'Jurista; aponta violação à publicidade dos processos e à Lei de Abuso de Autoridade.' },
      { nome: 'Paulo Henrique', partido: 'PSD', resumoArgumentos: 'Oscila entre apoiar a rotulagem com exceções e rejeitar a tipificação ampla de desinformação.' },
      { nome: 'Beatriz Rocha', partido: 'PT', resumoArgumentos: 'Defende rotulagem obrigatória e tipificação eleitoral como base do letramento midiático.' },
      { nome: 'Rafael Duarte', resumoArgumentos: 'Representante de plataforma; defende transparência com auditoria externa e regras tecnicamente factíveis.' },
      { nome: 'Mariana Prado', partido: 'PV', resumoArgumentos: 'Participou como ouvinte; sem falas registradas neste recorte.' },
    ],
    falas: [
      {
        id: 'aud-005-f1',
        autor: 'Eli Vieira Araujo Júnior',
        ordem_no_debate: 6,
        texto:
          'Muito obrigado, Sr. Presidente.\n\nÉ uma honra para mim, como cidadão brasileiro, poder falar nesta Casa, que representa o povo brasileiro. Acredito que estamos num momento em que é preciso haver maior ênfase do Poder representativo de fato, que ganha os votos do povo, para o nosso País retornar à normalidade, o que não está acontecendo.\n\nSrs. Parlamentares, concidadãos, em nenhum lugar da lei brasileira está escrito que é crime produzir ou propagar fake news, desinformação ou discurso de ódio. Esses termos são termos particulares de uma determinada visão política que, não satisfeita com o fato de que essas expressões não são tipificadas como crimes, planeja usar o aparato burocrático do País para fazer valer a sua opinião. Isso — é claro — viola diversos princípios do Estado Democrático de Direito.\n\nÉ a lei que deve mandar, e não a opinião política em voga no momento, entre setores influentes da imprensa, da academia ou das instituições. Esses termos incluem em si expressões e atos já codificados como crimes em lei. Por exemplo, discurso de ódio incluiria a injúria racial, que é crime; fake news incluiria calúnia e difamação, que são crimes.\n\nÉ justamente por estarem insatisfeitos com essa base legal que representantes dessa visão política repetem esses termos à exaustão — digo os termos "discurso de ódio", "desinformação" e fake news. Querem um PL das fake news para codificar em lei coisas que já estão fazendo, há anos, à margem da lei. Estão muitas vezes dispostos a atropelar leis, como o Marco Civil da Internet, e a atropelar direitos constitucionais, como o direito à privacidade, para implantar a sua interpretação mais restritiva dessas expressões do que a prevista pelas leis brasileiras.\n\nEssa trama, em suma, senhores, é corroborada pelos Twitter Files Brasil e pelas investigações mais amplas do meu colega David Ágape, em parceria com o nosso colaborador americano Michael Shellenberger.\n\nConfesso que eu nem sei ao certo a opinião do meu colega Ágape, apesar de sermos grandes amigos, a respeito de qual deve ser o modelo de liberdade de expressão no Brasil. Shellenberger e eu, por nossa vez, e também Glenn Greenwald, que está conosco, apoiamos o modelo americano, é verdade, o mais amplo do mundo. Esse modelo, ao contrário do que alegam seus críticos, não cria um caos social. A sociedade americana é uma das menos racistas do mundo, por exemplo. Temos estudos para mostrar isso.\n\nPermitir que preconceituosos falem com liberdade, portanto, não é um endosso ao conteúdo do que eles falam e não causa aumento de crenças preconceituosas ou de discriminação. Peço, então, que considerem adotar esse padrão amplo de proteção à expressão como amostra de grande tolerância do Estado até para com as palavras ofensivas, porque, se as piores pessoas entre nós têm o direito de fala, todos nós temos.\n\nA ofensa é subjetiva, não deveria ser o limite da expressão de ninguém. Particularmente, contudo, eu consigo viver bem sob o ordenamento jurídico que nós já temos no Brasil, que é mais restritivo do que o padrão americano. O que os Twitter Files Brasil mostram é que esse ordenamento está sendo desrespeitado por Parlamentares que querem violar correspondência privada nas redes sociais, por promotores e seus colaboradores das grandes empresas de tecnologia, que entregam dados privados voluntariamente sem ordem judicial, e por ordens judiciais de coleta em massa de informações que não respeitam a lei.\n\nEndosso a fala do meu colega Ágape, que esteve no Senado na semana passada, quando disse que o ativismo pela mordaça tem representantes influentes nos Três Poderes. Também endosso a fala do meu colega Shellenberger de que o Poder que mais vem abusando de suas atribuições para calar bocas é o Judiciário.\n\nPara a Gazeta do Povo, eu escrevi uma reportagem que entra em detalhes sobre os estudos disponíveis para responder à ideia de que piadas podem matar. Como os senhores sabem, humoristas como Leo Lins já foram alvo de censura no Brasil, e já temos uma "lei antipiadas" sancionada pelo Presidente Lula. É falso, senhoras e senhores, que piadas matam.\n\nEu digo o mesmo a respeito de declarações alarmistas sobre o potencial ofensivo geral das fake news. As fake news que realmente podem desembocar em violência e demais danos sérios já são previstas como crimes por lei, mas muitas supostas fake news que os adeptos da mordaça querem censurar estão perfeitamente dentro da lei.\n\nAo contrário do que disse o então Ministro da Justiça Flávio Dino, no Twitter — declaração pela qual ele foi corrigido pelo sistema de notas da comunidade, repetida agora como esperança pelo Presidente Lula de que mentira deve ser crime —, mentir, por si só, não é um crime no Brasil nem deve ser. Eu posso mentir que eu sou bonito, inteligente e magro. Esse é um direito meu.\n\nOdiar também não deve ser crime. A ideia de que essa emoção humana deveria ter permissão prévia do Estado é um absurdo distópico. Por acaso, os senhores não odeiam a crueldade, a violência injustificada, mesmo quando o ódio é direcionado injustamente a uma pessoa ou a um grupo? Ele não deve ser crime até que culmine em ações danosas concretas, ameaças credíveis, além de difamação e calúnia objetivas.\n\nHá 5 anos, está sendo normalizada no Brasil uma situação de exceção, de abuso, de uso de regimento interno de tribunal acima da Constituição para inquéritos que nunca terminam. Os Twitter Files Brasil mostram que essa é uma situação de anomalia insustentável. Como se dizia no fim da pandemia, precisamos voltar à normalidade.\n\nNeste caso, a normalidade é do respeito à lei e à Constituição, e a normalidade do debate político para propor mudanças na lei, como aquela que eu quero, às claras, e não pelos bastidores, usando dinheiro estrangeiro em campanhas globais pela censura.\n\nÉ preciso que o brasileiro volte a postar hashtags sem pensar que, por mera opinião, seus dados privados serão coletados pelas Cortes, muitas vezes atropelando os princípios constitucionais da publicidade dos processos, do juiz natural — porque também há cidadãos comuns envolvidos —, além da livre expressão.\n\nSrs. Parlamentares, concidadãos, protejam a integridade da vida privada do cidadão, removam a mordaça da boca dele.\n\nObrigado. (Palmas.)',
        resumo:
          'O titular critica propostas e práticas de regulação e moderação que ele associa a censura, sustentando que "fake news", "discurso de ódio" e "desinformação" não são tipos penais autônomos e que condutas ilícitas já estão previstas na legislação (calúnia, difamação, injúria racial). Defende um padrão amplo de liberdade de expressão — inspirado no modelo americano — argumentando que permitir a fala de preconceituosos não aumenta discriminação e que ofensa é subjetiva e não deveria limitar a expressão. Afirma que o Judiciário e outros atores vêm abusando de poder para violar privacidade e coletar dados sem ordem judicial, citando os "Twitter Files Brasil" como evidência dessa anomalia. Pede o respeito à Constituição e à lei e a retirada de restrições que, segundo ele, atropelam direitos fundamentais.',
        objeto_do_posicionamento:
          'A crítica às iniciativas e práticas (legislativas, judiciais e de moderação) que visam restringir a expressão online sob rótulos como "fake news", "discurso de ódio" e "desinformação", e a defesa de um padrão mais amplo de liberdade de expressão e de proteção da privacidade contra coleta de dados sem ordem judicial.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Confiante', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa', 'Recursos Retóricos'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f2',
        autor: 'Eli Vieira Araujo Júnior',
        ordem_no_debate: 54,
        texto:
          'Obrigado, Sr. Presidente.\n\nPrestei atenção detidamente em todas as falas. Vou destacar especialmente a do Deputado Arlindo Chinaglia, que não se encontra mais presente. Eu gostaria de responder a alguns de seus comentários.\n\nEm primeiro lugar, nenhum de nós três que fizemos Twitter Files Brazil trabalhamos com o Sr. Elon Musk. Houve uma mentira. Assim que saíram os Twitter Files, mentiram, acredito que por desespero, por falta de resposta e argumento contra os fatos apresentados, que foi Musk em pessoa que teria planejado isso, para atingir pessoalmente o Ministro Alexandre de Moraes. Falso. Esses arquivos estavam em poder do Sr. Shellenberger e também de outros jornalistas competentes, como Matt Taibbi e Bari Weiss, desde o fim de 2022. Então, nada foi planejado pelo Sr. Elon Musk. Ele soube como todos os outros — exceto nós três — souberam, quando o Sr. Shellenberger publicou no X, no Twitter, o Twitter Files Brazil.\n\nO Sr. Chinaglia também nos trouxe uma fala — ele não disse quem apresentou essa fala — de que era uma clara incitação à violência contra filhas e famílias de certas pessoas. Ora, com todo o respeito ao Sr. Deputado, nenhum dos pais da ideia da liberdade de expressão, de John Milton e John Stuart Mill a George Orwell — que também considero um pai —, acharia que essa expressão é livre, a chamar diretamente pela violência. Então, o exemplo escolhido a dedo, imagino, foi meio capcioso, com todo o respeito. Gostaria que o Sr. Chinaglia nos respondesse por que, por exemplo, a dona de casa Barbara Destefani, uma youtuber que é, sim, apoiadora de Jair Bolsonaro, está sendo julgada pela maior Corte do País. Não é o juiz natural. Não é competência do STF. Ela não tem foro privilegiado. Está tudo errado. Está tudo errado.\n\nAcredito que esses foram os principais pontos levantados aqui pela situação.\n\nVou responder ao Deputado Luiz Philippe de Orleans e Bragança, que se encontra aqui conosco. Ele nos perguntou qual é a nossa opinião sobre o que fazer. Nós já temos aí os instrumentos. Sabemos que o Presidente do Senado era quem deveria sair de cima dos vários pedidos de impeachment contra Alexandre de Moraes. Mas quero ressaltar também que, desde o começo, no Twitter Files Brazil, ficou claro que não é somente o Moraes que é o problema. Há outros atores, como, inclusive, Parlamentares. Cito a CPI das Fake News e a CPI da COVID. Quiseram ler mensagens diretas. Isso é violação da correspondência, que a Constituição proíbe. O que fazer? Bem, eu acho que a opinião pública é importante. O debate da liberdade de expressão, que não tem acontecido, é importantíssimo.\n\nPara terminar minha fala, se eu tiver tempo, gostaria de trazer... Eu perguntei a juristas. Eu não sou nenhum especialista em direito. Então, perguntei a juristas quais leis foram violadas segundo o Twitter Files Brazil, pelo que nós revelamos. Então, está lá no art. 5º, inciso LX, da Constituição que consagra a publicidade dos processos judiciais. A Constituição reitera isso no art. 93. Há também a Lei de Abuso de Autoridade, a Lei nº 13.869, de 2019, cujo art. 25 proíbe o que nós mostramos que foi feito, além do art. 27 dessa lei e do nosso Código Penal.\n\nPara falar mais um pouquinho do Presidente do Senado, o Sr. Pacheco, o meu veículo, a Gazeta do Povo, que me emprega, tem mostrado certo escândalo de um projeto ligado ao Sr. Pacheco, que é o de reforma do Código Civil. O Pacheco disse, em resposta à cobertura, que era fake news que ele fosse associado ao projeto. O Sr. Pacheco tem espaço na Gazeta do Povo: se ele quiser nos escrever um artigo em que mostre que foi alguma coisa falsa dita por nós, que ele fique à vontade. O que esse episódio mostra, para mim, é que ele parece ser um adepto dessas ideias que eu critiquei na minha fala inicial, de que fake news são proibidas, a mentira é proibida, coisas desse tipo. Então, ele está enganado. Nossa base legal não é assim.\n\nEu estou muito esperançoso hoje, após ouvir as falas dos colegas e até mesmo a resposta, a crítica ao Twitter Files Brazil. Acredito que, pelo menos, o debate está aberto. O que estava acontecendo era que havia um pânico seguido de restrições. E cadê o debate? Não houve debate sobre liberdade de expressão quando era necessário haver.\n\nTermino com a opinião da Dra. Érica Gorga. Ela disse que a própria inclusão do Elon Musk no inquérito das milícias digitais comprova o que vocês denunciaram, isto é, que qualquer pessoa que critique está em risco de ser investigada pelo STF, sem nenhuma base processual ou criminal para tanto.\n\nObrigado.',
        resumo:
          'O titular defende que os Twitter Files Brazil expõem abusos e violações legais em decisões judiciais e requerem debate público sobre liberdade de expressão. Afirma que Elon Musk não planejou a divulgação, rejeita que o material incite violência, critica o julgamento de pessoas sem foro adequado pelo STF e pede responsabilização também de parlamentares. Cita a Constituição e a Lei de Abuso de Autoridade como normas violadas e encerra esperançoso com a abertura do debate.',
        objeto_do_posicionamento:
          'A legitimidade e as consequências dos Twitter Files Brazil e a alegada prática de censura e abuso de autoridade por parte do STF ao determinar bloqueios de contas na rede social.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa', 'Recursos Retóricos'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f3',
        autor: 'Arlindo Chinaglia',
        ordem_no_debate: 9,
        texto:
          'Sr. Presidente, senhoras e senhores, trago a esta Casa um exemplo concreto que não pode ser varrido para debaixo do tapete retórico.\n\nCirculou nesta semana, com dezenas de milhares de compartilhamentos, uma mensagem que expunha filhas menores de idade de uma autoridade, com endereço da escola e conclamação explícita para que "fossem buscar" as meninas. Isso não é opinião. Isso não é piada. Isso é incitação à violência contra crianças, e qualquer ordenamento civilizado precisa de instrumentos ágeis para derrubar esse conteúdo em horas, não em meses.\n\nOuvi aqui que "mentir não é crime" e que "odiar não deve ser crime". Pois eu pergunto: e quando a mentira organizada elege gente, derruba vacina e lota UTI? E quando o ódio organizado marca o endereço de uma família? A abstração liberal é bonita no papel, mas o plenário precisa legislar para o mundo real, onde a velocidade da rede supera em muito a velocidade do Judiciário.\n\nDefendo, portanto, um PL que tipifique a desinformação em período eleitoral, que obrigue as plataformas a manter representantes legais no País, com responsabilidade solidária, e que crie o dever de transparência sobre impulsionamento e moderação, com relatórios trimestrais auditáveis.\n\nNão se trata de mordaça: trata-se de colocar as plataformas sob o mesmo regime de responsabilidade que já vale para jornais, rádios e emissoras de televisão. Quem lucra com o alcance precisa responder pelo dano.\n\nAos colegas que citam o modelo americano, lembro que lá existe a Seção 230 em debate no Congresso deles, existe regulação eleitoral severa e existe responsabilização civil robusta. Ninguém está inventando a roda: estamos trazendo o Brasil para o padrão das democracias que já legislaram.\n\nEncerro pedindo que esta Comissão aprove o regime de urgência para o projeto. Cada semana sem lei é uma semana em que novas Barbaras — de todos os lados — serão expostas.',
        resumo:
          'Defende a regulação com um caso concreto de exposição de menores e incitação à violência, pedindo tipificação eleitoral, representante legal das plataformas e transparência auditável.',
        objeto_do_posicionamento:
          'A defesa de um PL que tipifique a desinformação eleitoral e responsabilize plataformas, contra a tese de que a lei vigente basta.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Recursos Retóricos'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-005-f4',
        autor: 'Luiz Philippe de Orléans e Bragança',
        ordem_no_debate: 14,
        texto:
          'Sr. Presidente, agradeço aos expositores e vou direto ao ponto: quais instrumentos o Parlamento tem hoje, e quais lhe faltam, diante do que foi revelado?\n\nPrimeiro, os pedidos de impeachment parados na gaveta do Senado. Não é papel desta Casa julgar o mérito de cada um, mas é papel do Senado dar andamento. Engavetar indefinidamente é, na prática, absolver sem processo.\n\nSegundo, as CPIs. A CPI das Fake News e a CPI da COVID quiseram ler mensagens diretas de cidadãos. Isso é violação de correspondência, vedada pela Constituição. CPI não é poder constituinte: tem limites, e esta Casa precisa reafirmá-los.\n\nTerceiro, o orçamento. As agências que financiam campanhas globais pela censura com dinheiro estrangeiro precisam ser auditadas. Transparência para todos — inclusive para os financiadores do ativismo regulatório.\n\nPor fim, pergunto objetivamente aos jornalistas aqui presentes: na opinião dos senhores, o que o Congresso deveria fazer nesta semana? Porque o debate é importantíssimo, mas o brasileiro espera providências, não seminários.',
        resumo:
          'Cobra andamento de impeachments, limites constitucionais às CPIs e auditoria de financiadores, perguntando medidas objetivas ao Congresso.',
        objeto_do_posicionamento:
          'A cobrança de providências parlamentares concretas diante dos abusos relatados, contra a inércia institucional.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Confiante', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f5',
        autor: 'David Ágape',
        ordem_no_debate: 18,
        texto:
          'Sr. Presidente, sou jornalista e corresponsável, ao lado do Eli e do Michael, pelo Twitter Files Brasil. Vou me ater aos documentos.\n\nO que os arquivos mostram, em síntese, é um circuito informal de pedidos: mensagens de autoridades e de seus entornos chegando a funcionários de plataformas, que por sua vez aplicavam suspensões, reduções de alcance e, em alguns casos, entrega de dados — tudo sem ordem judicial específica, sem contraditório e sem registro público.\n\nQuero ser preciso: não afirmamos que cada caso isolado configura crime; afirmamos que o padrão, lido em conjunto, revela um regime de exceção informal. E é justamente por ser informal que ele escapa aos controles: não há decisão para recorrer, não há autos para consultar, não há autoridade para responsabilizar.\n\nPor isso endosso o que disse meu colega Eli: o ativismo pela mordaça tem representantes influentes nos Três Poderes, e o debate público é o primeiro instrumento. O segundo é documental: que esta Comissão requisite, formalmente, os registros de pedidos de remoção e de entrega de dados dirigidos às plataformas nos últimos cinco anos.\n\nDeixo ainda um alerta metodológico aos colegas parlamentares: desconfiem de quem pede para legislar a partir de um único caso chocante. Casos chocantes pedem investigação e punição exemplar dos culpados — com a lei que já existe. Leis novas, feitas no calor do exemplo, costumam acertar os inocentes e errar os culpados.',
        resumo:
          'Sustenta com documentos um circuito informal de pedidos de remoção e dados sem ordem judicial e pede requisição formal dos registros às plataformas.',
        objeto_do_posicionamento:
          'A denúncia documental do regime informal de moderação e a defesa de apuração formal em vez de leis de ocasião.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f6',
        autor: 'Michael Shellenberger',
        ordem_no_debate: 22,
        texto:
          'Thank you, Mr. Chairman — falarei em português, com a ajuda dos colegas.\n\nInvestigo censura industrial há uma década, em vários países. O padrão brasileiro que documentamos não é único, mas é um dos mais avançados: aqui, a cooperação entre Estado e plataformas deixou de ser exceção e virou rotina operacional.\n\nQuero destacar dois pontos. Primeiro: quem mais abusa, no Brasil, é o Judiciário — ordens secretas, sem contraditório, com alvos expandidos por associação. Isso não tem paralelo nas democracias que estudo.\n\nSegundo: a tese de que a fala causa dano mensurável em escala social não se sustenta na literatura. Estudamos as correlações entre discurso ofensivo liberado e indicadores de discriminação real, e a correlação não aparece. O que aparece, sim, é outro efeito: quando o Estado decide o que pode ser dito, os primeiros calados são os dissidentes, nunca os poderosos.\n\nMinha recomendação a esta Casa é simples: protejam o processo, não o conteúdo. Transparência total de pedidos estatais, proibição de coleta em massa sem ordem individualizada e contraditório posterior obrigatório. O resto — o debate sobre ideias — deixem para a sociedade.',
        resumo:
          'Afirma que o Judiciário brasileiro abusa com ordens secretas e que a literatura não sustenta dano social da fala livre; recomenda proteger o processo.',
        objeto_do_posicionamento:
          'A denúncia do abuso judicial e a defesa de garantias processuais em vez de controle de conteúdo.',
        taxonomia: {
          'Alinhamento Temático': ['Parcialmente focalizado'],
          'Postura do Orador': ['Confiante', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f7',
        autor: 'Érica Gorga',
        ordem_no_debate: 27,
        texto:
          'Sr. Presidente, sou jurista e vou me ater à técnica, sem adjetivos políticos.\n\nPrimeiro fato: o art. 5º, inciso LX, da Constituição, reiterado no art. 93, consagra a publicidade dos processos. Ordens judiciais sigilosas que atingem terceiros, sem fundamentação acessível, violam essa garantia. Não é questão de opinião: é texto expresso.\n\nSegundo fato: a Lei de Abuso de Autoridade, Lei nº 13.869, de 2019, tipifica, em seus arts. 25 e 27, condutas como requisitar diligências manifestamente descabidas e constranger sob ameaça. Os documentos apresentados nesta audiência descrevem, em tese, condutas que se amoldam a esses tipos — caberá ao Ministério Público, não a esta debatedora, concluir.\n\nTerceiro fato: o Marco Civil da Internet condiciona a entrega de dados à ordem judicial específica. Entregas voluntárias em massa, ainda que bem-intencionadas, operam fora da lei.\n\nDito isso, pondero: reconhecer ilegalidades passadas não resolve o futuro. Recomendo a esta Comissão três medidas legislativas precisas — (i) vedação expressa à coleta em massa sem individualização; (ii) contraditório diferido obrigatório em bloqueios de contas; (iii) auditoria externa e periódica dos relatórios de transparência das plataformas.\n\nEncerro com uma nota de método: esta jurista não subscreve nem o pânico regulatório nem o negacionismo do problema. Casos reais de incitação existem e devem ser punidos com rigor — pela lei vigente. E garantias violadas devem ser restauradas — também pela lei.',
        resumo:
          'Aponta violações à publicidade processual, à Lei de Abuso de Autoridade e ao Marco Civil, e propõe três medidas legislativas precisas.',
        objeto_do_posicionamento:
          'A análise técnica das ilegalidades apontadas e a proposição de garantias legislativas precisas, sem adesão a polos.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa'],
          Posicionamento: ['Neutro'],
        },
      },
      {
        id: 'aud-005-f8',
        autor: 'Paulo Henrique',
        ordem_no_debate: 31,
        texto:
          'Sr. Presidente, apoio a rotulagem de conteúdo sintético como ponto de partida: saber o que foi gerado por máquina é informação básica do cidadão, e nisso acompanho a colega Beatriz. Mas quero exceções claras para sátira, paródia e arte — sem as quais a regra vira censura oblíqua.\n\nPondero, porém, que rotular não é regular tudo: o PL não pode transformar cada compartilhamento em infração. Defendo um texto enxuto, focado em impulsionamento pago e em período eleitoral, com sanções proporcionais.',
        resumo:
          'Apoia a rotulagem com exceções para arte e defende texto enxuto focado em impulsionamento e eleição.',
        objeto_do_posicionamento:
          'O apoio à rotulagem mínima com exceções, contra a regulação ampla de compartilhamentos.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Conciliadora', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria'],
          Posicionamento: ['Favorável'],
        },
      },
      {
        id: 'aud-005-f9',
        autor: 'Paulo Henrique',
        ordem_no_debate: 48,
        texto:
          'Retomo a palavra porque, ouvidos os relatos de coleta de dados e os exemplos trazidos pelo Deputado Chinaglia, mudei de avaliação sobre um ponto central.\n\nContinuo a favor de rotular conteúdo sintético. Mas sou contra a tipificação ampla de desinformação proposta no substitutivo: o tipo é vago, e tipo vago na mão de autoridade é arbítrio na certa. Vimos nesta mesma sessão dois campos chamarem os mesmos fatos de "prova" e de "farsa" — e ambos com convicção honesta.\n\nSe a lei não consegue definir com precisão o proibido, ela não deve proibir. Que se puna a fraude eleitoral concreta, já tipificada, com os meios que já temos — e que se rejeite o capítulo genérico.',
        resumo:
          'Mantém apoio à rotulagem, mas rejeita a tipificação ampla por vagueza, após ouvir os relatos da sessão.',
        objeto_do_posicionamento:
          'A rejeição da tipificação genérica de desinformação por imprecisão, mantido o apoio à rotulagem.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Confiante'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Recursos Retóricos'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-005-f10',
        autor: 'Beatriz Rocha',
        ordem_no_debate: 35,
        texto:
          'Sr. Presidente, parto do chão da escola, onde leciono há quinze anos.\n\nMeus alunos não distinguem um vídeo real de um sintético bem-feito. Não é ingenuidade deles: é engenharia de ponta contra adolescentes. Dizer que "a lei vigente basta" ignora que a lei vigente foi escrita para o boca a boca, não para um robô que produz dez mil mentiras por minuto.\n\nDefendo, portanto, três coisas bem concretas. Primeira: rotulagem obrigatória de conteúdo sintético, sem exceção que vire brecha — sátira se declara como sátira, e pronto. Segunda: tipificação da desinformação eleitoral massiva, com dolo específico e majorante para impulsionamento pago. Terceira: representante legal das plataformas no País, porque direito sem responsável é favor.\n\nE respondo de antemão à objeção da vagueza: o Código Penal convive há oitenta anos com tipos abertos como "ato obsceno". A técnica legislativa sabe lidar com conceitos indeterminados — o que falta, muitas vezes, é vontade de proteger os vulneráveis em vez dos poderosos.\n\nPor fim, como base de tudo: letramento midiático obrigatório no currículo. Nenhuma lei substitui o cidadão crítico — mas o cidadão crítico precisa de lei que o proteja enquanto aprende.',
        resumo:
          'Defende rotulagem sem brechas, tipificação eleitoral e representante legal, a partir da experiência em sala de aula.',
        objeto_do_posicionamento:
          'A defesa de regulação protetiva focada em vulneráveis, contra a tese da suficiência da lei vigente.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Emocional', 'Confiante', 'Técnica'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Referência Externa'],
          Posicionamento: ['Contrário'],
        },
      },
      {
        id: 'aud-005-f11',
        autor: 'Rafael Duarte',
        ordem_no_debate: 40,
        texto:
          'Sr. Presidente, falo em nome de uma plataforma que opera no Brasil e emprego centenas de moderadores brasileiros.\n\nPrimeiro, um dado operacional: recebemos milhares de pedidos por semana, em formatos diferentes, de autoridades diferentes, muitas vezes sem número de processo. Atender bem, nessas condições, é heroísmo administrativo — e heroísmo não escala.\n\nSegundo, um pedido técnico: regras precisam ser factíveis. "Remover em uma hora" soa bem no plenário e quebra na prática: significa remover primeiro e perguntar depois — o oposto do devido processo que todos aqui dizem defender.\n\nTerceiro, nossa proposta: portal único e padronizado de pedidos de autoridades, com número de processo obrigatório; relatórios de transparência trimestrais com auditoria externa independente; e canal de apelação com prazo e resposta fundamentada.\n\nNão pedimos imunidade: pedimos previsibilidade. Plataforma que descumprir ordem judicial válida deve ser punida — com multa, não com bloqueio sumário do serviço inteiro, que pune milhões de usuários inocentes pelo erro de alguns.',
        resumo:
          'Pede portal único de pedidos, auditoria externa e punição proporcional, alertando que prazos inexequíveis invertem o devido processo.',
        objeto_do_posicionamento:
          'A defesa de regras tecnicamente factíveis e sanções proporcionais, sem imunidade às plataformas.',
        taxonomia: {
          'Alinhamento Temático': ['Focalizado'],
          'Postura do Orador': ['Técnica', 'Conciliadora'],
          'Credibilidade e Validação': ['Autoridade Própria', 'Recursos Retóricos'],
          Posicionamento: ['Neutro'],
        },
      },
    ],
    propostas: [
      {
        id: 'aud-005-p1',
        titulo: 'Adotar padrão amplo de liberdade de expressão',
        descricao: 'Proteger inclusive palavras ofensivas nos moldes do modelo americano, sem criminalizar mentira ou ódio por si sós.',
        autor: 'Eli Vieira Araujo Júnior',
      },
      {
        id: 'aud-005-p2',
        titulo: 'Vedação à coleta de dados sem ordem judicial',
        descricao: 'Proibir entregas voluntárias em massa e exigir ordem individualizada, com contraditório posterior.',
        autor: 'Eli Vieira Araujo Júnior',
      },
      {
        id: 'aud-005-p3',
        titulo: 'Tipificar a desinformação eleitoral massiva',
        descricao: 'Criar tipo penal com dolo específico e majorante para impulsionamento pago em período eleitoral.',
        autor: 'Arlindo Chinaglia',
      },
      {
        id: 'aud-005-p4',
        titulo: 'Representante legal das plataformas',
        descricao: 'Exigir representante no País com responsabilidade solidária e canal de apelação fundamentada.',
        autor: 'Beatriz Rocha',
      },
      {
        id: 'aud-005-p5',
        titulo: 'Requisitar registros de moderação',
        descricao: 'Requisitar formalmente às plataformas os registros de remoções e entregas de dados dos últimos cinco anos.',
        autor: 'David Ágape',
      },
      {
        id: 'aud-005-p6',
        titulo: 'Auditoria externa de transparência',
        descricao: 'Relatórios trimestrais auditados por entidade independente e portal único de pedidos de autoridades.',
        autor: 'Rafael Duarte',
      },
      {
        id: 'aud-005-p7',
        titulo: 'Debate público permanente sobre expressão',
        descricao: 'Manter audiências periódicas e mobilizar a opinião pública em vez de legislar sob pânico.',
        autor: 'Eli Vieira Araujo Júnior',
      },
    ],
  },
};

export const MOCK_AUDIENCIAS_RESUMO: AudienciaResumo[] = Object.values(DETALHES).map(
  ({ id, titulo, resumoCurto }) => ({ id, titulo, resumoCurto })
);

export function getMockAudienciaDetalhe(id: string): AudienciaDetalhe | null {
  return DETALHES[id] ?? null;
}

/** Outras audiências com participação de `nome` (exclui a atual quem chama). */
export function findAudienciasByParticipante(nome: string): AudienciaResumo[] {
  return Object.values(DETALHES)
    .filter((d) => d.participantes.some((p) => p.nome === nome))
    .map(({ id, titulo, resumoCurto }) => ({ id, titulo, resumoCurto }));
}
