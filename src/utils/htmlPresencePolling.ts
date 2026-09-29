/** Observa conteúdo parcial; nunca confirma conclusão nem navega. */
export function startHtmlPresencePolling(
  check: () => Promise<boolean>,
  onContentDetected: () => void,
): () => void {
  let active = true;
  let timer: ReturnType<typeof setTimeout>;

  const poll = async () => {
    try {
      const exists = await check();
      if (active && exists) onContentDetected();
    } catch {
      // Falha transitória de status não encerra a geração nem muda seu resultado.
    } finally {
      // Uma consulta por vez, inclusive quando o servidor demora a responder.
      if (active) timer = setTimeout(() => { void poll(); }, 5000);
    }
  };

  timer = setTimeout(() => { void poll(); }, 5000);
  return () => {
    active = false;
    clearTimeout(timer);
  };
}
