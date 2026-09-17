export function getGenerateLabel(type?: string): string {
  switch (type) {
    case 'plano':
      return 'Gerar plano de aula';
    case 'debate':
      return 'Gerar roteiro de debate';
    case 'redacao':
      return 'Gerar oficina de redação';
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
    default:
      return 'Gerando material...';
  }
}
