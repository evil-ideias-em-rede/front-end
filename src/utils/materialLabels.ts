export function getGenerateLabel(type?: string): string {
  switch (type) {
    case 'plano':
      return 'Gerar plano de aula';
    case 'debate':
      return 'Gerar roteiro de debate';
    case 'redacao':
      return 'Gerar oficina de redação';
    case 'slides':
      return 'Gerar slides';
    case 'complementares':
      return 'Gerar materiais complementares';
    default:
      return 'Gerar material';
  }
}

export function getGeneratingMessage(type?: string): string {
  switch (type) {
    case 'plano':
      return 'Gerando plano de aula...';
    case 'debate':
      return 'Gerando roteiro de debate...';
    case 'redacao':
      return 'Gerando oficina de redação...';
    case 'slides':
      return 'Gerando slides...';
    case 'complementares':
      return 'Gerando materiais complementares...';
    default:
      return 'Gerando material...';
  }
}
