# 📦 Localizador de Baú — TBH Timer

Cronômetro de drop de baús para o jogo **TBH: Task Bar Hero** (Steam), inspirado no
[tbh-codown](https://feroddev.github.io/tbh-codown/).

## Como funciona o drop de baú no jogo

- O jogo tem **120 fases** (4 dificuldades × 3 atos × 10 fases). Cada fase dropa um
  **baú de chefe** ("Stage Boss Box") de um nível específico. Existem 10 níveis de baú:
  **4, 5, 7, 15, 20, 30, 40, 50, 65 e 80**.
- Cada fase tem um **% de chance de drop** (100%, 80%, 60%, 40%...).
- Depois que um baú de certo nível dropa, há um **cooldown interno** (~12–14 min) até
  aquele nível dropar de novo.
- A estratégia da comunidade é a **rotação**: ter vários níveis de baú no farm e, quando
  um dropa, trocar para a fase de outro nível cujo cooldown já zerou.

Este app automatiza a parte chata: um cronômetro por nível de baú, com alerta sonoro
quando o cooldown termina.

## Funcionalidades

- ✅ Card de cronômetro por nível de baú, com a fase de **maior % de drop** sugerida
- ✅ Dados reais das 120 fases (`src/data/stages.json`)
- ✅ Botão **"Baú dropou!"** inicia o countdown (duração padrão configurável, 14 min)
- ✅ Alerta sonoro (Web Audio API — sem arquivos de áudio) com volume ajustável
- ✅ Persistência em `localStorage`: dá F5 e os cronômetros continuam corretos
- ✅ Histórico de eventos (últimos 20 drops/resets)
- ✅ **Guia de fases**: tabela das 120 fases com chance de baú, filtros por
  dificuldade e nível, e busca por nome (com ou sem acento)
- ✅ Nomes de fases e dificuldades traduzidos para pt-BR
- ✅ **⏱ Tempo na fase**: contagem crescente de há quanto tempo você está na
  fase (reinicia ao trocar de fase ou marcar um drop)
- ✅ **🗺️ Planejador de rota**: escolha os níveis de baú que quer farmar e o app
  sugere a melhor fase de cada um (maior chance de drop + clear mais rápido) e
  cria os cronômetros da rota com um clique
- ✅ **⭐ Próximo da rotação**: destaque dourado no baú que fica pronto primeiro
- ✅ **📊 Média real entre drops**: histórico persistido por nível de baú;
  um clique em "usar" adota a SUA média como cooldown daquele card
- ✅ Tema **cyberpunk** responsivo: roxo neon como cor principal, ciano de
  contraste, fontes Orbitron/Rajdhani, brilhos neon e scanlines

## Como rodar

```bash
npm install   # primeira vez
npm run dev   # abre em http://localhost:5173
```

## Estrutura do projeto

```
src/
├── main.jsx          # ponto de entrada — monta o React no index.html
├── App.jsx           # estado central (timers, configurações, localStorage)
├── components/       # peças visuais reutilizáveis
│   ├── ChestCard.jsx   # card de um baú com countdown
│   ├── AddChest.jsx    # formulário de adicionar baú
│   ├── SettingsBar.jsx # duração padrão, som, volume
│   ├── StageGuide.jsx  # tabela de consulta das 120 fases
│   └── EventLog.jsx    # histórico de eventos
├── hooks/
│   └── useNow.js     # hook que faz o relógio "andar" na tela
├── utils/
│   ├── stages.js     # consultas aos dados das fases
│   ├── time.js       # formatação MM:SS
│   └── sound.js      # beep de alerta (Web Audio API)
├── data/
│   └── stages.json   # as 120 fases do jogo com nível e % de drop
└── styles/           # todo o CSS do projeto (um arquivo por componente)
```

**Por que essa estrutura?** `components/` separa o visual da lógica de dados (`utils/`),
então dá para mexer no layout sem risco de quebrar regras de negócio. `hooks/` guarda
lógica reutilizável de React. `data/` isola o que é "conteúdo do jogo" — se o jogo
mudar os drops, só o JSON muda.

## Ideias futuras

- [ ] Notificação do navegador (Notification API) quando um baú ficar pronto
- [ ] Cronômetro da caixa de correio (o jogo segura baús e entrega depois,
  empilhados — atualização de 10/06/2026)
- [ ] Guia de rota por nível de jogador
- [ ] Deploy no GitHub Pages
