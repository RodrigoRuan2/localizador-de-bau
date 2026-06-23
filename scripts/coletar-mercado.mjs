// Coleta os itens mais vendidos do Mercado Steam do TBH e gera src/data/market.js.
//
// Rode com:  npm run mercado
//
// POR QUE um script separado, e não buscar direto no app?
//  - A API do Mercado Steam NÃO manda cabeçalho CORS → o navegador bloqueia.
//    Como o app é um site estático (GitHub Pages), ele nunca conseguiria chamar.
//  - A API tem rate limit agressivo (trava com HTTP 429 em poucas chamadas).
// Rodando aqui no Node (na SUA máquina) os dois problemas somem: a coleta
// acontece fora do navegador e uma vez só. O app apenas LÊ o market.js gerado —
// mesmo padrão de curadoria do game-updates.js e do meta.js.

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// ----- Ajustes (mexa só aqui) -----------------------------------------------
const APPID = 3678970 // TBH: Task Bar Hero
const MOEDA = 7 // 1 = US$ (dólar) · 7 = R$ (real)
const TOP_N = 15 // quantos itens no ranking final
const CANDIDATOS = 40 // quantos itens puxar antes de filtrar pelos mais vendidos
// ----------------------------------------------------------------------------

const SIMBOLO = { 1: 'US$', 7: 'R$' }
const UA = { 'User-Agent': 'Mozilla/5.0 (coletor-mercado-tbh)' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 1) Lista os itens à venda (ordenada por quantidade). O endpoint devolve no
//    máximo 10 por página, então paginamos com "start" até juntar CANDIDATOS.
//    É barato e não estoura o rate limit. Daqui tiramos nome, nº de listagens
//    e a URL do ícone (guardada para um possível uso futuro com imagem).
const POR_PAGINA = 10 // limite fixo do endpoint search/render

async function buscarCandidatos() {
  const itens = []
  for (let start = 0; start < CANDIDATOS; start += POR_PAGINA) {
    const url =
      `https://steamcommunity.com/market/search/render/?appid=${APPID}` +
      `&norender=1&count=${POR_PAGINA}&start=${start}` +
      `&sort_column=quantity&sort_dir=desc&currency=${MOEDA}`
    const res = await fetch(url, { headers: UA })
    if (!res.ok) throw new Error(`search/render respondeu HTTP ${res.status}`)
    const json = await res.json()
    if (!json.success) throw new Error('search/render devolveu success=false')
    if (!json.results?.length) break // acabaram os itens
    for (const r of json.results) {
      itens.push({
        nome: r.name,
        hash: r.hash_name,
        listagens: r.sell_listings ?? 0,
        icone: r.asset_description?.icon_url ?? null, // só guardado, ainda não usado
      })
    }
    await sleep(800) // educado entre páginas
  }
  return itens
}

// 2) O volume REAL vendido nas 24h e o preço mediano só vêm item a item, neste
//    endpoint. É o que tem rate limit — por isso o sleep entre as chamadas.
async function detalhe(hash) {
  const url =
    `https://steamcommunity.com/market/priceoverview/?appid=${APPID}` +
    `&currency=${MOEDA}&market_hash_name=${encodeURIComponent(hash)}`
  const res = await fetch(url, { headers: UA })
  if (res.status === 429) return { rate: true }
  if (!res.ok) return null
  const j = await res.json()
  if (!j.success) return null
  // "volume" vem como string com separador de milhar ("1.646"/"1,646") ou ausente.
  const volume = j.volume ? Number(j.volume.replace(/[.,]/g, '')) : 0
  return {
    menorPreco: j.lowest_price ?? null, // menor preço à venda agora
    precoMediano: j.median_price ?? null, // preço mediano das vendas recentes
    volume24h: volume, // unidades vendidas nas últimas 24h
  }
}

async function main() {
  console.log(`Coletando Mercado Steam (appid ${APPID}, moeda ${SIMBOLO[MOEDA]})...`)
  const candidatos = await buscarCandidatos()
  console.log(`  ${candidatos.length} itens listados encontrados. Buscando volume/preço...`)

  const enriquecidos = []
  // Enriquecemos um pouco além do TOP_N para o ranking por volume ter de onde escolher.
  for (const c of candidatos.slice(0, TOP_N + 10)) {
    let d = await detalhe(c.hash)
    if (d?.rate) {
      console.log('  Rate limit (429) — pausando 30s...')
      await sleep(30000)
      d = await detalhe(c.hash)
    }
    if (d && !d.rate) {
      enriquecidos.push({ ...c, ...d })
      console.log(`  • ${c.nome} — ${d.precoMediano ?? d.menorPreco ?? '?'} (vol 24h: ${d.volume24h})`)
    }
    await sleep(1500) // respeita o rate limit da Steam
  }

  // "Mais vendido de verdade" = maior volume nas últimas 24h.
  const top = enriquecidos.sort((a, b) => b.volume24h - a.volume24h).slice(0, TOP_N)

  const dataBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  const conteudo = `// ARQUIVO GERADO AUTOMATICAMENTE por scripts/coletar-mercado.mjs.
// NÃO edite à mão — rode "npm run mercado" para atualizar.
//
// Dados do Mercado Steam do TBH (appid ${APPID}). A coleta roda na máquina
// (Node), nunca no navegador, porque a API da Steam bloqueia CORS e tem rate
// limit. O app apenas lê este arquivo.

export const MARKET_SOURCE = 'https://steamcommunity.com/market/search/?appid=${APPID}'
export const MARKET_COLLECTED_AT = ${JSON.stringify(dataBR)}
export const MARKET_CURRENCY = ${JSON.stringify(SIMBOLO[MOEDA])}

export const MARKET_TOP = ${JSON.stringify(top, null, 2)}
`

  const aqui = dirname(fileURLToPath(import.meta.url))
  const destino = join(aqui, '..', 'src', 'data', 'market.js')
  await writeFile(destino, conteudo, 'utf8')
  console.log(`\nPronto! ${top.length} itens salvos em src/data/market.js`)
}

main().catch((e) => {
  console.error('Falhou:', e.message)
  process.exit(1)
})
