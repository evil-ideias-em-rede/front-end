// A visualização é local à aba e não altera a fonte confirmada da sessão.
const key = (sessionId: string) => `contraponto_viewed_audience_${sessionId}`;

export function rememberViewedAudience(sessionId: string | null, id: string | null): void {
  if (!sessionId) return;
  try {
    sessionStorage.setItem(key(sessionId), id ?? '');
  } catch {
    // A navegação continua funcionando mesmo com armazenamento indisponível.
  }
}

export function restoreViewedAudience(sessionId: string, fallback: string | null): string | null {
  try {
    const saved = sessionStorage.getItem(key(sessionId));
    return saved === null ? fallback : saved || null;
  } catch {
    return fallback;
  }
}
