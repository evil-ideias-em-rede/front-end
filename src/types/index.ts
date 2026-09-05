export interface User {
  name: string;
  email: string;
}

export type AuthMode = 'login' | 'register' | 'forgot_password';

export type MaterialType = 'source' | 'slide' | 'atv';

export type MaterialCategory = 'plano' | 'material' | 'atividade';

export interface Material {
  id: string;
  title: string;
  autoral: boolean;
  orientation: 'V' | 'H';
  type: MaterialType;
  category: MaterialCategory;
  fileType: 'pdf' | 'html';
  qtd: number;
  status: ContentStatus;
  htmlContent: string;
  fileUrl?: string;
  turmaIds?: string[];
  lastModified?: string;
  lastModifiedAt?: number;
}

export interface Turma {
  id: string;
  school: string;
  series: string;
  idSeries: string;
  qtd: number;
  disciplina: string;
  color?: string;
  image?: string;
  lastModifiedAt?: number;
}

export interface Template {
  id: string;
  title: string;
  qtd: number;
  description?: string;
  htmlContent: string;
  turmaIds?: string[];
  lastModifiedAt?: number;
}

export type ContentStatus = 'Criando' | 'Pronto para usar';

export interface PlanoDeAula {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  status: ContentStatus;
  turmaId: string;
}

export type AtividadeType = 'prova' | 'trabalho' | 'exercicio' | 'oficina';

export interface Atividade {
  id: string;
  title: string;
  type: AtividadeType;
  description?: string;
  status: ContentStatus;
  turmaId: string;
}

export interface MaterialTurma {
  id: string;
  title: string;
  type: MaterialType;
  status: ContentStatus;
  turmaId: string;
}

export interface TeacherProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  schools: string[];
  activeClassesCount: number;
  createdPlansCount: number;
  generatedMaterialsCount: number;
  createdWorksCount: number;
}

export interface RecentWorkItem {
  id: string;
  title: string;
  category: 'debate' | 'plano' | 'redacao' | 'simulacao' | 'brainstorm';
  categoryLabel: string;
  lastModified: string;
  tags: string[];
  excerpt: string;
  status: 'Criando' | 'Rascunho' | 'Pronto para aula';
  accentColor: string;
  questionsCount?: number;
  duration?: string;
}

export interface QuickCategory {
  id: string;
  label: string;
  iconName: string;
  description: string;
  color: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  badges: string[];
}

export interface TeachingTip {
  title: string;
  category: string;
  description: string;
  tags: string[];
  iconName: string;
  steps: string[];
}
