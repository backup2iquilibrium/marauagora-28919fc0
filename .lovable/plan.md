
## Plano de implementação — Portal de Notícias “Marau Agora” (Lovable)

### 1) Alinhamento rápido (o que falta você confirmar)
Para eu executar com segurança sem retrabalho, preciso só destas definições (pode responder em texto mesmo):
- **MVP começa só com layout + dados de exemplo**, ou **já com backend** para cadastrar notícias/vagas/anúncios?
- Você quer **área administrativa agora** (simples) ou **deixar para uma fase 2**?
- As primeiras páginas além da Home serão quais: **Notícia (detalhe)**, **Categoria**, **Vagas**, **Ao Vivo**?

> Se você ainda não decidiu, o plano abaixo já prevê começar com layout + conteúdo “mock” e depois ligar o backend.

---

### 2) Fase 1 — “Home” fiel ao HTML (fonte da verdade)
Objetivo: recriar a Home do HTML enviado com o mesmo visual/estrutura e comportamento responsivo.

**Entregas na Home**
- **Top Bar** com data e indicadores (USD/Soja/Milho) em formato de “chips”.
- **Header** com logomarca, ícones sociais e **busca**.
- **Menu de navegação** com as categorias e item “Ao Vivo” destacado.
- **Bloco clima/tempo** (banner superior) com dados estáticos no MVP.
- **Destaque principal** com carrossel (3 slides), com título, resumo e categoria.
- **Cards secundários** (2 cards à direita do carrossel).
- **Últimas Notícias** (lista de cards com imagem + categoria + tempo + título + resumo).
- **Espaço publicitário** (placeholder bem identificado).
- **Vagas de Emprego** (grid de cards com cargo/empresa/local/tipo + link “Detalhes”).
- **Guia da Cidade** (atalhos circulares com imagem).
- **Sidebar** com patrocinadores/“Anuncie aqui”, Telefones Úteis, Mais Lidas, Newsletter.
- **Rodapé** com colunas (Sobre, Editorial, Institucional, Contato).

**Regra de ouro aplicada**
- Este HTML vira o **padrão visual global**: cores, tipografia, espaçamentos, cartões, estilos de botão e hierarquia.

---

### 3) Fase 2 — Componentização (para escalar rápido)
Objetivo: transformar blocos em componentes reutilizáveis, mantendo o padrão.

**Componentes principais**
- Card de notícia (variações: destaque, lista, “mais lidas”)
- Carrossel de destaque
- Card de vaga
- Card de patrocinador + bloco “Anuncie Aqui”
- Barra de busca
- Bloco newsletter
- Seções (título + “ver todas”) para padronizar

Resultado: quando você mandar o próximo HTML, a gente reaproveita e adapta sem “quebrar” o estilo.

---

### 4) Fase 3 — Páginas e navegação (estrutura do portal)
Objetivo: sair de “uma página” e virar portal navegável.

**Rotas/páginas sugeridas para o MVP**
- **/ (Home)**
- **/categoria/:slug** (lista de notícias por editoria)
- **/noticia/:slug** (página individual da notícia)
- **/vagas** (lista)
- **/vagas/:id** (detalhe)
- **/ao-vivo** (página simples inicial, pronta para evoluir)
- **/contato**, **/politica-de-privacidade**, **/quem-somos** (páginas institucionais básicas)

---

### 5) Fase 4 — Conteúdo (mock agora, backend depois)
Objetivo: o site funcionar com conteúdo realista desde o início.

**Opção A (recomendada para começar): Mock**
- Popular notícias/vagas/patrocinadores com dados de exemplo.
- Busca filtra esses itens localmente (boa para validar UX).

**Opção B: Backend já no MVP**
- Cadastrar notícias, categorias, vagas, patrocinadores e anúncios em uma base.
- Exibir na Home com ordenação e destaque manual.

---

### 6) Fase 5 — Monetização (anúncios) e governança editorial
Objetivo: manter espaços publicitários controláveis.

**MVP**
- Zonas de anúncio com placeholders e rótulo “Publicidade”.
- Estrutura pronta para trocar por imagens/links reais depois.

**Evolução**
- Patrocínios fixos e rotativos
- Regras simples: “master”, “apoio local”, “sidebar slots”

---

### 7) Fase 6 — Qualidade (responsividade, dark mode e performance)
Objetivo: experiência consistente em mobile/desktop e carregamento rápido.

- Ajustes finos de responsividade (colunas → empilhado no mobile; menu com rolagem horizontal)
- Dark mode consistente com o padrão do HTML
- Otimizações básicas de imagens e hierarquia de leitura

---

### 8) Como trabalharemos com os próximos HTMLs (seu processo guiado)
Para cada novo arquivo HTML que você enviar:
1) analisar a página/bloco novo  
2) reproduzir fielmente  
3) extrair componentes reutilizáveis  
4) integrar na navegação e manter padrão global  

---

## Próximo passo prático
Você me responde 3 coisas (bem curto):
1) **Layout apenas ou já com backend?**  
2) **Admin agora ou depois?**  
3) **Quais páginas entram no MVP além da Home?**  

Com isso, eu fecho o escopo do MVP e a ordem exata de implementação (sem desperdício).
