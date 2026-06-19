// Atualizações do JOGO (TBH: Task Bar Hero), resumidas e traduzidas das notas
// oficiais da Steam. NÃO é busca ao vivo: a API da Steam bloqueia o navegador
// (CORS) e o site é estático. Então estes resumos são curados à mão a partir
// da fonte oficial. Para atualizar, peça "atualiza as novidades do jogo".
//
// Fonte: https://store.steampowered.com/news/app/3678970
// Última curadoria desta lista: 19/06/2026

export const GAME_UPDATE_SOURCE = 'https://store.steampowered.com/news/app/3678970'
export const GAME_UPDATES_CURATED_AT = '19/06/2026'

export const GAME_UPDATES = [
  {
    date: '19/06/2026',
    title: 'Hotfix (v1.00.15)',
    novo: true,
    summary:
      'Correções de balanço: dano do Wrath of Heaven do Priest estava absurdamente alto (corrigido); Blessing of Might não empilhava corretamente (corrigido). Também corrigido o cap de 75% de Redução de Dano e o efeito Explosive Bolt que aplicava redução de cooldown em vez de contagem de ataque básico.',
  },
  {
    date: '17/06/2026',
    title: 'Hotfix (v1.00.14)',
    summary:
      'Corrigido o bug que deixava pegar baús mais rápido ao trocar de fase — isso afeta direto a estratégia de rotação. Também corrigido o caso em que, ao reconectar com mais de 5 baús guardados, só 5 eram mantidos (agora os baús retidos são preservados).',
  },
  {
    date: '15/06/2026',
    title: 'Hotfix (v1.00.13)',
    summary:
      'Corrigido o recebimento de baús inválidos rápido demais ao reconectar. Também corrigido o caso em que Decoração / Gravação / Inscrição não podiam ser aplicadas em equipamentos legados não sintetizáveis.',
  },
  {
    date: '15/06/2026',
    title: 'Migração de servidor (v1.00.12)',
    summary:
      'Migração de servidor concluída — primeiro passo para resolver a sobrecarga. ⚠️ Atenção: depois de entrar na v1.00.12, reconectar numa versão antiga pode causar perda de itens (irreversível). Mantenha sempre a versão mais nova.',
  },
  {
    date: '12/06/2026',
    title: 'Atualização dos Termos de Serviço e Privacidade',
    summary:
      'Os Termos foram revisados novamente (v1.5) após o feedback dos jogadores sobre a versão publicada em 11/06, alinhando-os à reformulação dos sistemas do jogo.',
  },
  {
    date: '11/06/2026',
    title: 'Migração de servidor e reabertura do Mercado Steam',
    summary:
      'Para resolver a sobrecarga, os dados principais do jogo passam a ser processados em servidores próprios. Foi anunciado também o cronograma de reabertura do Mercado Steam.',
  },
  {
    date: '08/06/2026',
    title: 'Fechamento temporário do Mercado Steam',
    summary:
      'A listagem de itens no Mercado Steam foi suspensa temporariamente. O menu do Navio Comercial (Trade Ship) foi desativado — em versões antigas ele abre, mas dá erro.',
  },
  {
    date: '07/06/2026',
    title: 'Hotfix dos baús',
    summary:
      'Corrigido o bug em que os baús não apareciam. A atualização de "Relay Server" que estava marcada foi adiada.',
  },
]
