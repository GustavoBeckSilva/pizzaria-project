export function formatarData(dataString) {
  const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dataString).toLocaleDateString(undefined, opcoes);
}

export function extrairErro(erro) {
  if (erro.response && erro.response.data && erro.response.data.message) {
    return erro.response.data.message;
  }
  return erro.message || 'Erro desconhecido';
}

export function formatarPreco(valor) {
  if (valor === undefined || valor === null) return '';
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}