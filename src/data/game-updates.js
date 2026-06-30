// Atualizações do JOGO (TBH: Task Bar Hero), traduzidas das notas oficiais da
// Steam. NÃO é busca ao vivo: a API da Steam bloqueia o navegador (CORS) e o
// site é estático. Então estes resumos são curados à mão a partir da fonte
// oficial. Para atualizar, peça "atualiza as novidades do jogo".
//
// Formato de cada entrada:
//   { date, title, novo?, intro?, items? }
//   - intro: parágrafo de contexto (opcional)
//   - items: lista de tópicos, no mesmo espírito das notas oficiais (opcional)
//
// Fonte: https://store.steampowered.com/news/app/3678970
// Última curadoria desta lista: 30/06/2026

export const GAME_UPDATE_SOURCE = 'https://store.steampowered.com/news/app/3678970'
export const GAME_UPDATES_CURATED_AT = '30/06/2026'

export const GAME_UPDATES = [
  {
    date: '30/06/2026',
    title: 'Desculpas e compensação para todos os jogadores',
    novo: true,
    intro:
      'A equipe pediu desculpas pelos atrasos de conexão e instabilidades do último mês desde o lançamento e vai compensar todos os jogadores com moedas comemorativas.',
    items: [
      'A partir de quinta, 02/07/2026, serão distribuídas 10 moedas comemorativas por dia, durante 7 dias (70 no total).',
      'As combinações mudam a cada dia, misturando moedas de aniversário de Reino e Império (1º, 10º e 50º aniversário).',
      'A distribuição começa de forma sequencial a partir de 02/07 (horário KST); o horário exato será anunciado depois e pode haver pequena diferença entre jogadores.',
      'Prazo para resgatar todos os itens: 31/07 às 24h (KST).',
      'Os detalhes da recompensa podem mudar conforme as circunstâncias.',
    ],
  },
  {
    date: '25/06/2026',
    title: 'Mercado Steam reaberto + hotfix (v1.00.21)',
    intro:
      'O Mercado Steam do TBH reabriu, com um hotfix para estabilizar o Mercado e corrigir bugs. Logo após a reabertura pode haver fila de até 1h. Regras do Mercado: 4 vagas de listagem, cada uma com cooldown de 8h — ao listar um item no Navio Comercial o cooldown já começa e a listagem não pode ser cancelada. Em algumas contas, os botões de listar/vender podem demorar de 30 min a 2h para ativar. Os 3 grades mais altos (Cosmic, Divine, Celestial) seguem temporariamente proibidos de listar — só Soulstones podem; serão liberados depois, conforme a estabilidade.',
    items: [
      'Janela do Navio Comercial não se movia ao arrastar o menu — corrigido.',
      'Faixa de nível do resultado não atualizava ao trocar o tipo de síntese em Cubo > Síntese — corrigido.',
      'Lista de correio sumia e ficava invisível ao atualizar a Caixa de Correio — corrigido.',
      'Nomes dos baús na Caixa de Correio eram exibidos incorretamente — corrigido.',
      'Em Cubo > Oferta apareciam Soulstones de grade abaixo da Moeda — corrigido.',
      'Moedas não aparecem mais como item de resultado na Oferta — corrigido.',
      'Efeito "Skill Level +1" das opções de equipamento não era somado ao atributo real — corrigido.',
      'Usar o menu de Runas com o Baú (Stash) aberto interagia com os slots do Stash atrás — corrigido.',
      'Adicionado texto de orientação de uso dentro da Caixa de Correio.',
    ],
  },
  {
    date: '25/06/2026',
    title: 'Punições a cheaters: 6.180 contas',
    intro:
      'A equipe revisou atividade de trapaça pelos dados do servidor e puniu 6.180 contas confirmadas. Conforme o tipo e a gravidade de cada caso, foi aplicada restrição de acesso ao jogo ou restrição no Mercado Steam. Quem acredita ter sido punido injustamente pode recorrer por um formulário oficial.',
    items: [
      'Quem criou ou obteve itens por métodos anormais.',
      'Quem usou programas não autorizados ou explorou sistemas do jogo para vantagem injusta.',
    ],
  },
  {
    date: '23/06/2026',
    title: 'Cronograma do Mercado Steam + hotfix (v1.00.20)',
    intro:
      'Anunciado o cronograma de abertura do Mercado Steam: 25/06/2026 (qui), às 04h00 (horário de Brasília). No início, os 3 grades mais altos (Cosmic, Divine e Celestial) ficam temporariamente proibidos de serem listados — só as Soulstones podem; os grades restritos serão liberados depois, conforme a estabilidade do Mercado.',
    items: ['Corrigida uma falha de segurança.'],
  },
  {
    date: '22/06/2026',
    title: 'Hotfix (v1.00.19)',
    items: ['Corrigido o limite máximo de velocidade de movimento que estava sendo aplicado incorretamente.'],
  },
  {
    date: '22/06/2026',
    title: 'Hotfix (v1.00.18)',
    items: [
      'Corrigido o caso em que as trocas de fase ficavam bloqueadas ao desafiar o chefe de ato várias vezes seguidas (ajuste do anticheat da v1.00.17, que estava pegando troca legítima).',
      'Corrigida uma falha de segurança.',
    ],
  },
  {
    date: '20/06/2026',
    title: 'Hotfix (v1.00.17)',
    intro:
      'Fim da manutenção de emergência. Pode haver fila de até ~30 min após a atualização.',
    items: [
      'Ao detectar uma troca de fase "anormal", as trocas passam a ser bloqueadas por um tempo (anticheat reforçando o fim do exploit de rotação).',
      'Corrigida uma falha de segurança.',
    ],
  },
  {
    date: '20/06/2026',
    title: 'Manutenção de emergência do servidor',
    intro:
      'Um problema de segurança foi identificado no servidor e uma manutenção de emergência foi realizada. Resolvido na v1.00.17 (acima).',
  },
  {
    date: '19/06/2026',
    title: 'Hotfix (v1.00.16)',
    items: [
      'Achievement de "primeiro equipamento de alta qualidade" desbloqueava ao obter qualquer item, não só equipamentos — corrigido.',
    ],
  },
  {
    date: '19/06/2026',
    title: 'Hotfix (v1.00.15)',
    items: [
      "Dano do 'Wrath of Heaven' do Priest estava anormalmente alto — corrigido.",
      "Buff 'Blessing of Might' do Priest empilhava em certas situações — corrigido.",
      'Achievement de item Arcana não completava ao obtê-lo de baús ou da caixa de correio — corrigido.',
      'Cap máximo de 75% de Redução de Dano não era aplicado corretamente — corrigido.',
      'Efeito Explosive Bolt (entre os Stats Únicos de item) aplicava redução de cooldown em vez de redução na contagem de ataque básico — corrigido.',
    ],
  },
  {
    date: '17/06/2026',
    title: 'Hotfix (v1.00.14)',
    intro:
      'Pacote grande de correções, incluindo o fim do exploit que afetava direto a estratégia de rotação de baús.',
    items: [
      'Baús podiam ser obtidos mais rápido ao trocar de fase — corrigido (afeta a estratégia de rotação).',
      'Ao reconectar com mais de 5 baús guardados, só 5 eram mantidos — corrigido (baús retidos de versões antigas podem voltar gradualmente ao inventário).',
      'Cubo não funcionava direito ao ser usado durante o clear de um chefe de ato — corrigido.',
      'Em certas situações, clarear um chefe de ato também clareava a fase normal em progresso — corrigido.',
      "Aumento de Dano de Raio não era aplicado ao 'Wrath of Heaven' do Priest — corrigido.",
      "Knight atravessava monstros e saía da tela ao usar 'Unyielding Will' — corrigido.",
      'Acessórios não dropavam de alguns baús de chefe de ato — corrigido.',
      'No Inferno (Hell) ou acima, se o chefe da 2-10 fosse congelado durante o pulo, os heróis não conseguiam continuar atacando — corrigido.',
      'Descrição de skill de outro herói aparecia no tooltip do Knight — corrigido.',
      'Texto de dano quebrava em duas linhas quando passava de 5 dígitos — corrigido.',
      'Texto dos Termos de Serviço revisado para ficar mais claro.',
    ],
  },
  {
    date: '15/06/2026',
    title: 'Hotfix (v1.00.13)',
    items: [
      'Baús inválidos recebidos rápido demais ao reconectar — corrigido.',
      'Decoração / Gravação / Inscrição não podiam ser aplicadas em equipamentos legados não sintetizáveis — corrigido.',
      'Texto flutuante do Ouro ganho na Alquimia mostrava valor sem o efeito do buff de Runa, diferente do real — corrigido.',
      'A próxima batalha de chefe de ato não começa mais antes de o baú do chefe ser recebido — corrigido.',
    ],
  },
  {
    date: '15/06/2026',
    title: 'Migração de servidor (v1.00.12)',
    intro:
      'Migração de servidor concluída — primeiro passo para resolver a sobrecarga. ⚠️ Atenção: depois de entrar na v1.00.12, reconectar numa versão antiga pode causar perda de itens (irreversível). Mantenha sempre a versão mais nova.',
  },
  {
    date: '12/06/2026',
    title: 'Atualização dos Termos de Serviço e Privacidade',
    intro:
      'Os Termos foram revisados novamente (v1.5) após o feedback dos jogadores sobre a versão publicada em 11/06, alinhando-os à reformulação dos sistemas do jogo.',
  },
  {
    date: '11/06/2026',
    title: 'Migração de servidor e reabertura do Mercado Steam',
    intro:
      'Para resolver a sobrecarga, os dados principais do jogo passam a ser processados em servidores próprios. Foi anunciado também o cronograma de reabertura do Mercado Steam.',
  },
  {
    date: '08/06/2026',
    title: 'Fechamento temporário do Mercado Steam',
    intro:
      'A listagem de itens no Mercado Steam foi suspensa temporariamente. O menu do Navio Comercial (Trade Ship) foi desativado — em versões antigas ele abre, mas dá erro.',
  },
  {
    date: '07/06/2026',
    title: 'Hotfix dos baús',
    intro: 'A atualização de "Relay Server" que estava marcada foi adiada.',
    items: ['Corrigido o bug em que os baús não apareciam.'],
  },
]
