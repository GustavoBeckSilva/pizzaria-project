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