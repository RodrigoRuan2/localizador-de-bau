import stages from '../data/stages.json'

// Este arquivo concentra tudo que envolve os DADOS do jogo.
// Os componentes não mexem no JSON diretamente: eles pedem para cá.
// Isso facilita manutenção — se o formato do JSON mudar um dia,
// só este arquivo precisa ser ajustado.

// Lista de níveis de baú existentes no jogo (4, 5, 7, 15... 80).
// O Set elimina repetições, já que várias fases dropam o mesmo nível.
export const CHEST_LEVELS = [...new Set(stages.map((s) => s.boss_chest_level))].sort(
  (a, b) => a - b
)

// Traduções PT-BR dos nomes de mapas (mesmos nomes usados no jogo).
// O stages.json fica intocado em inglês — quem traduz é esta camada.
// Assim, se o JSON for atualizado um dia, as traduções não se perdem.
const MAP_NAMES_PT_BR = {
  'Bug Nest': 'Ninho de Insetos',
  'Burning Ravine': 'Ravina Ardente',
  'Burning Village Entrance': 'Entrada da Vila em Chamas',
  Cemetery: 'Cemitério',
  'Citadel of Ruin': 'Cidadela das Ruínas',
  'City Outskirts': 'Arredores da Cidade',
  'Core of the Abyss': 'Núcleo do Abismo',
  'Cursed Land': 'Terra Amaldiçoada',
  'Desert Underground Cave': 'Caverna Subterrânea do Deserto',
  'Eerie Canyon': 'Cânion Sinistro',
  'Frozen Battlefield': 'Campo de Batalha Gelado',
  'Frozen Glacier Cavern': 'Caverna Glacial Congelada',
  'Glacial Cave Entrance': 'Entrada da Caverna Glacial',
  'Hell Command Chamber': 'Câmara de Comando do Inferno',
  'Hell Gate': 'Portão do Inferno',
  'Midnight Sands': 'Areias da Meia-Noite',
  'Oasis Road': 'Estrada do Oásis',
  Pasture: 'Pasto',
  "Pharaoh's Crypt": 'Cripta do Faraó',
  "Pharaoh's Underchannel": 'Canal Subterrâneo do Faraó',
  'Plains of Torment': 'Planícies do Tormento',
  'Rumstreet Square': 'Praça Rumstreet',
  'Sacred Tomb': 'Túmulo Sagrado',
  'Sandstorm Valley': 'Vale da Tempestade de Areia',
  'Scorching Dunes': 'Dunas Escaldantes',
  'Shadow Meadow': 'Prado Sombrio',
  'Snowbound Outpost': 'Posto Avançado Nevado',
  'Sunset Ruins': 'Ruínas do Entardecer',
  'Throne of Darkness': 'Trono das Trevas',
  Wasteland: 'Terra Devastada',
}

const DIFFICULTY_PT_BR = {
  Normal: 'Normal',
  Nightmare: 'Pesadelo',
  Hell: 'Inferno',
  Torment: 'Tormento',
}

// Ordem oficial de progressão das dificuldades (usada nos filtros).
export const DIFFICULTIES = ['Normal', 'Nightmare', 'Hell', 'Torment']

// Lista completa das 120 fases, na ordem de progressão do jogo.
export function allStages() {
  return stages
}

// Nome da fase em português. O `?? stage.name` é uma rede de segurança:
// se aparecer um mapa novo sem tradução, mostramos o nome original
// em vez de "undefined" na tela.
export function stageName(stage) {
  return MAP_NAMES_PT_BR[stage.name] ?? stage.name
}

export function difficultyName(stage) {
  return DIFFICULTY_PT_BR[stage.difficulty] ?? stage.difficulty
}

// Identificador único de uma fase. "name" sozinho não serve porque
// a mesma fase existe nas 4 dificuldades (Normal, Nightmare, Hell, Torment).
export function stageId(stage) {
  return `${stage.difficulty}-${stage.act}-${stage.stage}`
}

// Todas as fases que dropam o baú de um certo nível,
// ordenadas da maior chance de drop para a menor.
// Em caso de empate no %, vem primeiro a fase mais fácil (menor nível de inimigo).
export function stagesForLevel(level) {
  return stages
    .filter((s) => s.boss_chest_level === level)
    .sort(
      (a, b) =>
        b.boss_chest_drop_percent - a.boss_chest_drop_percent ||
        a.enemy_level - b.enemy_level
    )
}

export function findStage(id) {
  return stages.find((s) => stageId(s) === id) ?? null
}

// Texto exibido nos selects e nos cards.
// Ex.: "Entrada da Vila em Chamas · Normal A1-5 · 80%"
export function stageLabel(stage) {
  return `${stageName(stage)} · ${difficultyName(stage)} A${stage.act}-${stage.stage} · ${stage.boss_chest_drop_percent}%`
}
