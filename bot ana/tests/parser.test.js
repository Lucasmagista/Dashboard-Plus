const { parseMensagemErroRobusto, validarErro } = require('../utils');

describe('Parser de Mensagens de Erro', () => {
  it('deve identificar um erro válido (pt-BR)', () => {
    const msg = `Responsável pelo erro: Montagem\nConta: João Tonioli - ML \nIdentificação da venda: 2000008210687315\nSKU: 511-OFFWHITE-FREIJO\nMotivo do erro: Foi enviado faltando 3 pés de 30 cm\nCusto: R$ 16,08 (envio)`;
    const erro = parseMensagemErroRobusto(msg, false);
    expect(erro).toBeTruthy();
    expect(erro.responsavel).toBe('Montagem');
    expect(erro.motivo).toContain('faltando 3 pés');
  });

  it('deve rejeitar mensagem inválida', () => {
    const msg = 'Mensagem aleatória';
    const erro = parseMensagemErroRobusto(msg, false);
    expect(erro).toBeNull();
  });
});
