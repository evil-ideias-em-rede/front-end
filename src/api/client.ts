import type { Material, Template, Turma } from '../types';

export interface AuthUser {
  id?: string;
  user_id?: string;
  email: string;
  name?: string | null;
  picture_url?: string | null;
  schools?: string[];
}

export interface AuthResponse extends AuthUser {
  access_token: string;
}

export interface WorkflowSession {
  id: string;
  created_at: string;
  selected_agent: string | null;
  messages: Array<Record<string, unknown>>;
}

export interface WorkflowSessionSummary {
  id: string;
  created_at: string;
  selected_agent: string | null;
  current_stage: 'audiences' | 'editor';
  message_count: number;
  last_message_at: string | null;
  last_message: string | null;
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8006').replace(/\/$/, '');
const TOKEN_KEY = 'contraponto.access_token';
const USER_KEY = 'contraponto.user';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function persistAuth(response: AuthResponse): AuthUser {
  const user = {
    id: response.user_id ?? response.id,
    user_id: response.user_id,
    email: response.email,
    name: response.name,
    picture_url: response.picture_url,
  };
  localStorage.setItem(TOKEN_KEY, response.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response | undefined;
  let networkError: unknown;
  // O backend pode levar alguns segundos para ficar disponível depois de um
  // rebuild/restart do Docker. Repetimos somente falhas de rede transitórias.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetch(`${API_BASE}${path}`, { ...init, headers });
      break;
    } catch (error) {
      networkError = error;
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  if (!response) throw networkError instanceof Error ? networkError : new Error('Não foi possível conectar ao servidor.');
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const rawDetail = typeof body === 'object' && body && 'detail' in body
      ? (body as { detail?: unknown }).detail
      : body;
    const detail = Array.isArray(rawDetail)
      ? rawDetail.map((item) => {
          if (typeof item === 'object' && item && 'msg' in item) {
            return String((item as { msg: unknown }).msg);
          }
          return String(item);
        }).join('; ')
      : typeof rawDetail === 'string'
        ? rawDetail
        : rawDetail
          ? JSON.stringify(rawDetail)
          : response.statusText;
    throw new Error(detail || `Erro ${response.status}`);
  }
  return body as T;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  return persistAuth(await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }));
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  return persistAuth(await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }));
}

export async function currentUser(): Promise<AuthUser> {
  const user = await request<AuthUser>('/auth/me');
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function updateCurrentUser(profile: {
  email: string;
  name: string;
  picture_url: string | null;
  schools: string[];
}): Promise<AuthUser> {
  const user = await request<AuthUser>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function listTurmas(): Promise<Turma[]> {
  return request<Turma[]>('/api/turmas');
}

export async function createTurma(turma: Turma): Promise<Turma> {
  return request<Turma>('/api/turmas', { method: 'POST', body: JSON.stringify(turma) });
}

export async function updateTurma(turma: Turma): Promise<Turma> {
  return request<Turma>(`/api/turmas/${turma.id}`, { method: 'PATCH', body: JSON.stringify(turma) });
}

export async function deleteTurma(id: string): Promise<void> {
  await request(`/api/turmas/${id}`, { method: 'DELETE' });
}

export async function listTemplates(): Promise<Template[]> {
  return request<Template[]>('/api/templates');
}

export async function createTemplate(template: Template): Promise<Template> {
  return request<Template>('/api/templates', { method: 'POST', body: JSON.stringify(template) });
}

export async function updateTemplate(template: Template): Promise<Template> {
  return request<Template>(`/api/templates/${template.id}`, { method: 'PATCH', body: JSON.stringify(template) });
}

export async function deleteTemplate(id: string): Promise<void> {
  await request(`/api/templates/${id}`, { method: 'DELETE' });
}

export async function listMateriais(): Promise<Material[]> {
  return request<Material[]>('/api/materiais');
}

export async function createMaterial(material: Material): Promise<Material> {
  return request<Material>('/api/materiais', { method: 'POST', body: JSON.stringify(material) });
}

export async function updateMaterial(material: Material): Promise<Material> {
  return request<Material>(`/api/materiais/${material.id}`, { method: 'PATCH', body: JSON.stringify(material) });
}

export async function deleteMaterial(id: string): Promise<void> {
  await request(`/api/materiais/${id}`, { method: 'DELETE' });
}

export async function createWorkflowSession(agent_name?: string): Promise<WorkflowSession> {
  return request<WorkflowSession>('/api/workflow/sessions', {
    method: 'POST',
    body: JSON.stringify(agent_name ? { agent_name } : {}),
  });
}

export async function getWorkflowSession(sessionId: string): Promise<WorkflowSession> {
  return request<WorkflowSession>(`/api/workflow/sessions/${encodeURIComponent(sessionId)}`);
}

export async function deleteWorkflowSession(sessionId: string): Promise<void> {
  await request(`/api/workflow/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
}

export async function listWorkflowSessions(userId = 10): Promise<WorkflowSessionSummary[]> {
  return request<WorkflowSessionSummary[]>(`/api/workflow/sessions?user_id=${userId}`);
}

export async function updateWorkflowStage(
  sessionId: string,
  stage: 'audiences' | 'editor',
): Promise<void> {
  await request(`/api/workflow/sessions/${encodeURIComponent(sessionId)}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });
}

export async function sendWorkflowMessage(
  sessionId: string,
  text: string,
  agent_name: string,
  hidden = false,
): Promise<any> {
  return request(`/api/workflow/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text, agent_name, hidden }),
  });
}

export async function sendEditorMessage(
  sessionId: string,
  text: string,
  agent_name: string,
  userEdited = false,
): Promise<any> {
  return request(`/api/workflow/sessions/${sessionId}/editor/messages`, {
    method: 'POST',
    body: JSON.stringify({ text, agent_name, user_edited: userEdited }),
  });
}

export async function listAudiencias<T = any>(): Promise<T[]> {
  return request<T[]>('/api/audiencias');
}

export async function getWorkflowPlanning<T = any>(sessionId: string): Promise<T[]> {
  return request<T[]>(`/api/workflow/sessions/${sessionId}/planning`);
}

export async function getAudiencia<T = any>(id: string): Promise<T> {
  return request<T>(`/api/audiencias/${encodeURIComponent(id)}`);
}

export async function getWorkflowFile<T = any>(sessionId: string, filename: string): Promise<T> {
  return request<T>(`/api/workflow/sessions/${encodeURIComponent(sessionId)}/${filename}`);
}

export async function selectWorkflowPlanningItem<T = any>(sessionId: string, planningId: string): Promise<T> {
  return request<T>(`/api/workflow/sessions/${sessionId}/planning/select/${encodeURIComponent(planningId)}`, { method: 'POST' });
}

export async function advanceWorkflow(sessionId: string, fromAgent = 'brainstorm'): Promise<{ allowed: boolean; message?: any }> {
  return request(`/api/workflow/sessions/${sessionId}/advance`, {
    method: 'POST',
    body: JSON.stringify({ from_agent: fromAgent }),
  });
}

export async function getWorkflowHtml(sessionId: string): Promise<string> {
  return request<string>(`/api/workflow/sessions/${sessionId}/html`);
}

export async function uploadWorkflowFile(sessionId: string, filename: string, content: string): Promise<void> {
  const form = new FormData();
  form.append('file', new File([content], filename, { type: 'text/html' }));
  await request(`/api/workflow/sessions/${sessionId}/files`, { method: 'POST', body: form });
}

export async function downloadWorkflowPdf(
  sessionId: string,
  html: string,
  orientation: 'V' | 'H' = 'V',
): Promise<void> {
  const form = new FormData();
  form.append('file', new File([html], 'HTML.html', { type: 'text/html' }));

  const token = getAccessToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(
    `${API_BASE}/api/workflow/sessions/${encodeURIComponent(sessionId)}/pdf?orientation=${orientation}`,
    { method: 'POST', headers, body: form },
  );

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    const detail = typeof body === 'object' && body && 'detail' in body
      ? String((body as { detail?: unknown }).detail ?? '')
      : String(body || response.statusText);
    throw new Error(detail || `Erro ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'atividade.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function workflowSocketUrl(sessionId: string): string {
  const token = getAccessToken();
  const base = API_BASE.replace(/^http/, 'ws');
  return `${base}/api/workflow/sessions/${sessionId}/ws${token ? `?token=${encodeURIComponent(token)}` : ''}`;
}
