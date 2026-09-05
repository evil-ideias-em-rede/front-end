export const EDITOR_SPEC_HTML = `
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; margin: 28px; line-height: 1.65; }
  h2 { font-size: 17px; color: #7C3AED; margin: 18px 0 8px; }
  h3 { font-size: 14px; color: #00B8A9; margin: 14px 0 6px; }
  p { margin: 8px 0; }
  ul, ol { margin: 8px 0; padding-left: 22px; }
  li { margin: 4px 0; }
  select { padding: 4px 8px; border: 1px solid #E4D6FF; border-radius: 6px; background: #fff; font-size: 13px; }
  .tag { font-weight: 700; color: #7C3AED; }
  section { border-left: 3px solid #00B8A9; padding-left: 12px; margin: 12px 0; }
</style>
  <h2>Especificação da Atividade — Tribunal Simulado do Contrato Social</h2>
  <p>
    Nesta atividade, a turma é organizada em <b>bancadas</b> (hobbesianos, rousseaunianos e um
    júri) para <b>julgar dilemas</b> reais de convivência escolar à luz dos filósofos.
  </p>

  <section>
    <h3>Formato da atividade</h3>
    <select contenteditable="false">
      <option selected>Simulação</option>
      <option>Debate estruturado</option>
      <option>Estudo de caso</option>
      <option>Produção de mural</option>
    </select>
    <p>
      <span class="tag">Componente:</span> Filosofia política &nbsp;&nbsp;
      <span class="tag">Duração:</span> 3 aulas
    </p>
  </section>

  <section>
    <h3>Turma associada</h3>
    <select contenteditable="false" data-field="turma">
      <option value="">Selecione a turma...</option>
      <option value="turma-1">1ª série EM — Manhã</option>
      <option value="turma-2">1ª série EM — Tarde</option>
      <option value="turma-3">2ª série EM — Manhã</option>
      <option value="turma-4">9º ano — Tarde</option>
    </select>
  </section>

  <h3>Objetivos</h3>
  <ul>
    <li>Compreender o estado de natureza em Hobbes e Rousseau</li>
    <li>Diferenciar pacto social e soberania popular</li>
    <li>Aplicar os conceitos a dilemas do cotidiano escolar</li>
    <li>Desenvolver argumentação oral e escuta ativa</li>
  </ul>

  <h3>Desenvolvimento</h3>
  <ol>
    <li>Abertura: levantamento de conhecimentos prévios sobre convivência</li>
    <li>Distribuição das bancadas e leitura das fontes</li>
    <li>Simulação do julgamento dos dilemas escolares</li>
    <li>Deliberação do júri e síntese coletiva</li>
  </ol>

  <h3>Avaliação</h3>
  <p>
    Observação da participação e da qualidade dos argumentos apresentados, com registro
    das conclusões em um painel de síntese.
  </p>
`;
