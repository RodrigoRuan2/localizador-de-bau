// Coleta o Mercado Steam do TBH e gera src/data/market.js, agora organizado em
// ABAS: Mais vendidos, Materiais, Acessórios, Equipamentos e "Vale a pena vender".
//
// Rode com:  npm run mercado
//
// POR QUE um script separado, e não buscar direto no app?
//  - A API do Mercado Steam NÃO manda cabeçalho CORS → o navegador bloqueia.
//  - Tem rate limit agressivo (HTTP 429 em poucas chamadas seguidas).
// Rodando aqui no Node (sua máquina / CI) os dois problemas somem. O app só LÊ
// o market.js gerado — mesmo padrão de curadoria do game-updates.js / meta.js.
//
// De onde vem a CATEGORIA? Cada item traz um campo `type` (ex.: "Crafting
// Material", "Helmet - Lv. 80", "Ring - Lv. 30"). Daí derivamos a categoria.

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// ----- Ajustes (mexa só aqui) -----------------------------------------------
const APPID = 3678970 // TBH: Task Bar Hero
const MOEDA = 7 // 1 = US$ (dólar) · 7 = R$ (real)
const PAGINAS_QTD = 5 // páginas (10 cada) ordenadas por QUANTIDADE (mais listados)
const PAGINAS_PRECO = 3 // páginas ordenadas por PREÇO desc (itens mais caros)
const VENDIDOS_N = 15 // itens na aba "Mais vendidos"
const CATEGORIA_N = 10 // itens em cada aba de categoria
const VALE_N = 12 // itens na aba "Vale a pena vender"
// ----------------------------------------------------------------------------

const SIMBOLO = { 1: 'US$', 7: 'R$' }
const UA = { 'User-Agent': 'Mozilla/5.0 (coletor-mercado-tbh)' }
const POR_PAGINA = 10 // limite fixo do endpoint search/render
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Deriva a categoria a partir do `type` da Steam.
function categoriaDoTipo(type) {
  if (!type) return 'outros'
  if (/Material$/i.test(type)) return 'materiais'
  if (/^Soulstone/i.test(type)) return 'soulstone'
  const base = type.split(' - ')[0].trim() // "Ring - Lv. 30" -> "Ring"
  if (['Ring', 'Amulet', 'Earing', 'Earring', 'Bracer'].includes(base)) return 'acessorios'
  if (type.includes(' - Lv.')) return 'equipamentos' // Sword, Armor, Helmet, Bow...
  return 'outros'
}

// "R$ 1.234,56" -> 1234.56 (assume formato pt-BR, pois MOEDA=7). Só para ORDENAR.
function precoParaNumero(txt) {
  if (!txt) return 0
  const limpo = txt.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.')
  return Number(limpo) || 0
}

// Uma página da lista à venda (10 itens). Traz nome, hash, ícone e categoria —
// tudo barato, sem o rate limit do priceoverview.
async function buscarPagina(sortCol, start) {
  const url =
    `https://steamcommunity.com/market/search/render/?appid=${APPID}` +
    `&norender=1&count=${POR_PAGINA}&start=${start}` +
    `&sort_column=${sortCol}&sort_dir=desc&currency=${MOEDA}`
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`search/render respondeu HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error('search/render devolveu success=false')
  return (json.results ?? []).map((r) => ({
    nome: r.name,
    hash: r.hash_name,
    icone: r.asset_description?.icon_url ?? null, // usado para a foto no app
    categoria: categoriaDoTipo(r.asset_description?.type),
  }))
}

// Junta candidatos por QUANTIDADE (pega os campeões de venda) e por PREÇO
// (pega os caros, p/ a aba "Vale a pena"), removendo repetidos pelo hash.
async function buscarCandidatos() {
  const mapa = new Map()
  const planos = [
    ...Array.from({ length: PAGINAS_QTD }, (_, i) => ['quantity', i * POR_PAGINA]),
    ...Array.from({ length: PAGINAS_PRECO }, (_, i) => ['price', i * POR_PAGINA]),
  ]
  for (const [col, start] of planos) {
    const itens = await buscarPagina(col, start)
    if (!itens.length) continue
    for (const it of itens) if (!mapa.has(it.hash)) mapa.set(it.hash, it)
    await sleep(800) // educado entre páginas
  }
  return [...mapa.values()]
}

// O volume REAL vendido nas 24h e o preço mediano só vêm item a item aqui.
// É o endpoint com rate limit — por isso o sleep entre as chamadas.
async function detalhe(hash) {
  const url =
    `https://steamcommunity.com/market/priceoverview/?appid=${APPID}` +
    `&currency=${MOEDA}&market_hash_name=${encodeURIComponent(hash)}`
  const res = await fetch(url, { headers: UA })
  if (res.status === 429) return { rate: true }
  if (!res.ok) return null
  const j = await res.json()
  if (!j.success) return null
  const volume = j.volume ? Number(j.volume.replace(/[.,]/g, '')) : 0
  return {
    menorPreco: j.lowest_price ?? null,
    precoMediano: j.median_price ?? null,
    volume24h: volume,
  }
}

async function main() {
  console.log(`Coletando Mercado Steam (appid ${APPID}, moeda ${SIMBOLO[MOEDA]})...`)
  const candidatos = await buscarCandidatos()
  console.log(`  ${candidatos.length} itens distintos encontrados. Buscando volume/preço...`)

  const itens = []
  for (const c of candidatos) {
    let d = await detalhe(c.hash)
    if (d?.rate) {
      console.log('  Rate limit (429) — pausando 30s...')
      await sleep(30000)
      d = await detalhe(c.hash)
    }
    if (d && !d.rate) {
      const precoNum = precoParaNumero(d.precoMediano ?? d.menorPreco)
      itens.push({ ...c, ...d, precoNum })
    }
    await sleep(1500) // respeita o rate limit da Steam
  }
  console.log(`  ${itens.length} itens com preço/volume.`)

  // Formato final de cada item no app (sem o precoNum, que é só p/ ordenar).
  const limpo = (x) => ({
    nome: x.nome,
    hash: x.hash,
    icone: x.icone,
    categoria: x.categoria,
    menorPreco: x.menorPreco,
    precoMediano: x.precoMediano,
    volume24h: x.volume24h,
  })

  const porVolume = (a, b) => b.volume24h - a.volume24h
  const porPreco = (a, b) => b.precoNum - a.precoNum
  const daCategoria = (cat) =>
    itens.filter((x) => x.categoria === cat).sort(porVolume).slice(0, CATEGORIA_N).map(limpo)

  const tabs = [
    // Geral: os mais vendidos de todas as categorias.
    { id: 'vendidos', titulo: 'Mais vendidos', itens: [...itens].sort(porVolume).slice(0, VENDIDOS_N).map(limpo) },
    { id: 'materiais', titulo: 'Materiais', itens: daCategoria('materiais') },
    { id: 'acessorios', titulo: 'Acessórios', itens: daCategoria('acessorios') },
    { id: 'equipamentos', titulo: 'Equipamentos', itens: daCategoria('equipamentos') },
    // Vale a pena: os mais CAROS que de fato venderam nas 24h (volume > 0).
    { id: 'vale-a-pena', titulo: 'Vale a pena vender', itens: itens.filter((x) => x.volume24h > 0).sort(porPreco).slice(0, VALE_N).map(limpo) },
  ]

  const dataBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const conteudo = `// ARQUIVO GERADO AUTOMATICAMENTE por scripts/coletar-mercado.mjs.
// NÃO edite à mão — rode "npm run mercado" para atualizar.
//
// Dados do Mercado Steam do TBH (appid ${APPID}), organizados em abas. A coleta
// roda na máquina/CI (nunca no navegador) porque a API bloqueia CORS e tem rate
// limit. O app apenas lê este arquivo.

export const MARKET_SOURCE = 'https://steamcommunity.com/market/search/?appid=${APPID}'
export const MARKET_COLLECTED_AT = ${JSON.stringify(dataBR)}
export const MARKET_CURRENCY = ${JSON.stringify(SIMBOLO[MOEDA])}

export const MARKET_TABS = ${JSON.stringify(tabs, null, 2)}
`

  const aqui = dirname(fileURLToPath(import.meta.url))
  const destino = join(aqui, '..', 'src', 'data', 'market.js')
  await writeFile(destino, conteudo, 'utf8')
  console.log('\nResumo por aba:')
  for (const t of tabs) console.log(`  ${t.titulo}: ${t.itens.length} itens`)
  console.log(`\nGerado: ${destino}`)
}

main().catch((e) => {
  console.error('Falhou:', e.message)
  process.exit(1)
})
