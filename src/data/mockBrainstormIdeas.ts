export interface BrainstormIdea {
  id: string;
  title: string;
  summary: string;
  description: string;
  format: string;
  series: string;
  content: string;
  accentColor: string;
}

export const MOCK_BRAINSTORM_IDEAS: BrainstormIdea[] = [
  {
    id: 'idea-001',
    title: 'Tribunal Simulado do Contrato Social',
    summary:
      'A classe divide-se em bancadas (hobbesianos, rousseaunianos e juízes) para "julgar" dilemas de convivência escolar à luz dos autores.',
    description:
      'A turma é organizada em três bancadas: hobbesianos, rousseaunianos e um júri composto por estudantes. Cada bancada defende sua leitura do contrato social diante de dilemas reais de convivência escolar, como filas, redes sociais e regras coletivas. Ao final, o júri delibera qual solução melhor equilibra liberdade e autoridade, e a classe registra as conclusões em um painel de síntese. A atividade desenvolve argumentação, escuta ativa e pensamento político, além de aproximar os conceitos filosóficos da realidade da escola.',
    format: 'Simulação',
    series: '1ª série EM',
    content: 'Filosofia política',
    accentColor: '#7C3AED',
  },
  {
    id: 'idea-002',
    title: 'Contrato Social no Cotidiano Escolar',
    summary:
      'Estudo de casos reais do ambiente da escola (fila, sala, recreio) para mapear "contratos" implícitos e regras de convivência.',
    description:
      'Os estudantes investigam situações do dia a dia escolar — fila do refeitório, regras de sala, divisão de espaços no recreio — e identificam quais "contratos" implícitos as regem. Em pequenos grupos, cada caso é analisado à luz das ideias de Hobbes e Rousseau: o que é imposição, o que é pacto, o que falta negociar. Os grupos apresentam propostas de novos combinados para a turma, que são votados em assembleia. A atividade conecta teoria política e convivência, com produção escrita de minutas de acordo.',
    format: 'Atividade',
    series: '6º ano',
    content: 'Convivência e ética',
    accentColor: '#00B8A9',
  },
  {
    id: 'idea-003',
    title: 'Mural Visual: Hobbes x Rousseau',
    summary:
      'Produção colaborativa de dois murais comparativos (estado de natureza, pacto, soberania) com ilustrações e verbetes.',
    description:
      'A turma produz dois murais comparativos — um sobre Hobbes e outro sobre Rousseau — organizados em eixos como estado de natureza, pacto social, soberania e liberdade. Cada grupo fica responsável por um eixo e cria ilustrações, verbetes e citações que sintetizam o pensamento do autor. Os murais são expostos no corredor com um card "hoje eu entendo que...", convidando outras turmas a registrar suas ideias. A proposta combina curadoria de informação, produção visual e comunicação pública do aprendizado.',
    format: 'Material',
    series: '2ª série EM',
    content: 'Teoria política',
    accentColor: '#FFB800',
  },
  {
    id: 'idea-004',
    title: 'Debate: Autoridade e Liberdade na Escola',
    summary:
      'Roteiro de debate em quatro bancadas sobre os limites da autoridade docente e a liberdade dos estudantes.',
    description:
      'Um roteiro de debate estruturado em quatro bancadas discute os limites da autoridade docente e da liberdade estudantil. Cada bancada recebe um texto-fonte (Hobbes, Rousseau, trechos do regimento escolar e relatos de estudantes) e cinco minutos para construir seus argumentos. A mediação é feita pelos próprios estudantes, com regras de tempo e escuta. Ao final, são votadas três propostas de convivência. A atividade treina argumentação oral, respeito a opiniões divergentes e leitura de fontes, com grade de avaliação inclusa no roteiro.',
    format: 'Roteiro de debate',
    series: '9º ano',
    content: 'Argumentação oral',
    accentColor: '#EC4899',
  },
  {
    id: 'idea-005',
    title: 'Carta Aberta: Nosso Pacto de Convivência',
    summary:
      'Os estudantes redigem, em assembleia, uma carta-pacto da turma inspirada nas ideias de contrato social estudadas.',
    description:
      'Inspirados nas ideias de contrato social, os estudantes redigem coletivamente uma carta-pacto da turma em formato de assembleia. Há um momento de escuta de propostas, uma rodada de ajustes e a votação final dos artigos do pacto. A carta é redigida em estilo argumentativo, com justificativas inspiradas em Hobbes e Rousseau para cada combinado, e assinada por todos. O documento é impresso e afixado na sala. A atividade desenvolve escrita argumentativa, tomada de decisão coletiva e senso de responsabilidade com acordos firmados.',
    format: 'Plano de aula',
    series: '7º ano',
    content: 'Escrita argumentativa',
    accentColor: '#3B82F6',
  },
];