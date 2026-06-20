// Meta atual do TBH (heróis, time, pet e dicas de farm), curado e traduzido
// de guias da comunidade. NÃO é busca ao vivo — curadoria manual, como as
// novidades do jogo. Para atualizar, peça "atualiza o meta".
//
// Fonte principal: https://progameguides.com/guides/tbh-task-bar-hero-tier-list-best-characters-pets/
// Última curadoria: 20/06/2026

export const META_CURATED_AT = '20/06/2026'
export const META_SOURCE =
  'https://progameguides.com/guides/tbh-task-bar-hero-tier-list-best-characters-pets/'

export const META_HEROIS = [
  { nome: 'Ranger', tier: 'S', papel: 'Melhor DPS free — limpa waves quase sozinho (sangramento + alta velocidade de ataque).' },
  { nome: 'Priest', tier: 'S', papel: 'Melhor tank/healer — segura a frente, cura e reviva; obrigatório no late game. (v1.00.15: dano do Wrath of Heaven normalizado, Blessing of Might não empilha mais — suporte continua forte.)' },
  { nome: 'Sorcerer', tier: 'A', papel: 'AoE elemental que controla as waves; entra no lugar do tank quando o time já aguenta.' },
  { nome: 'Knight', tier: 'B', papel: 'Caiu no meta atual; ainda serve como tank no começo.' },
]

export const META_TIMES = [
  { nome: 'Melhor time 100% free', comp: 'Priest + Ranger + Sorcerer', obs: 'Com o pet Dragon, é o conjunto free mais forte para farm geral.' },
  { nome: 'Com DLC', comp: 'Knight + Hunter + Priest', obs: 'Melhor equilíbrio de defesa, dano e consistência no late game.' },
]

export const META_PET =
  'Dragon — o melhor pet disparado: bônus de ouro, XP e loot ao mesmo tempo, do início ao endgame.'

export const META_FARM = [
  'Regra dos 2-3 hits: farme onde seu time mata os inimigos em 2 a 3 golpes — clear rápido e gear ainda relevante. Alto demais = kill lento; baixo demais = gear fraco.',
  'Deixe os baús comuns (brancos) estocados e foque nos baús azuis do chefe de fase, que têm drop melhor.',
  'Boss box e desafios de Soulstone são as fontes de gear Tier 10.',
  'Caixa de correio: o refresh caiu de 10s para 5s — itens de mercado/recompensa chegam nela, não no inventário.',
'⚠️ O exploit de pegar baú trocando de fase rápido foi corrigido (v1.00.14) e agora tem anticheat: a v1.00.17 bloqueia trocas de fase por um tempo quando detecta troca "anormal". A rotação legítima (vários níveis, cada um esperando seu cooldown) continua valendo — só não fique trocando freneticamente.',
]
