
Objetivo
- Sim, entendido. A partir de agora você vai enviar as páginas em HTML nessa sequência, e eu vou transformar cada HTML na página equivalente em React (Vite + TS + Tailwind), mantendo o padrão visual já criado na Home, extraindo componentes reutilizáveis e integrando tudo via rotas.
- Vou seguir a metodologia “HTML como fonte da verdade”: o HTML mais recente manda quando houver conflito de layout/estilo.

Como vamos trabalhar (processo por arquivo HTML)
1) Você envia o HTML da próxima página (ex.: “2 - New Details”) e, se houver, os assets (imagens, ícones, fontes) usados nele.
2) Eu:
   - Recrio a página fiel ao HTML no frontend (estrutura, espaçamento, tipografia, responsividade).
   - Identifico blocos repetíveis e extraio componentes reutilizáveis (ex.: CardNoticia, ListaNoticias, Breadcrumb, BlocoRelacionadas, etc.).
   - Integro a página na navegação (react-router-dom) e atualizo links do header/menu/rodapé para as rotas corretas.
   - Mantenho o tema (cores, fontes, sombras, bordas) consistente com a Home.
3) Validamos visualmente no preview e ajustamos detalhes (principalmente mobile).

Sequência de implementação (mapeamento para rotas)
- 2) New Details  -> /noticia/:slug  (detalhe da notícia)
- 3) Esportes     -> /categoria/esportes (ou /categoria/:slug com slug=esportes)
- 4) Emprego      -> /vagas
- 5) Points       -> preciso ver o HTML para definir a rota (ex.: /points ou /pontos)
- 6) Fale Conosco -> /contato
- 7) Sobre Nós    -> /quem-somos
- 8) Resultados da Busca -> /busca?q=...
- 9) Política de Privacidade -> /politica-de-privacidade
- 10) Termos de Uso -> /termos-de-uso
- 11) Agenda -> /agenda
- 12) Galeria -> /galeria
- 13) Classificados -> /classificados
- 14) Serviços Públicos -> /servicos-publicos
- 15) Horóscopo -> /horoscopo
- 16) Área Administrativa -> /admin (subrotas: /admin/noticias, /admin/categorias, /admin/vagas, etc.)

Dados e backend (como vamos encaixar o Supabase sem travar o layout)
- Enquanto você envia os HTMLs, as páginas podem iniciar com “mock data” para ficar tudo navegável e visualmente perfeito.
- Em paralelo (ou após as primeiras páginas críticas), eu conecto os dados reais via Supabase:
  - Tabelas planejadas: profiles, user_roles, categorias, noticias, vagas, patrocinadores/anuncios (conforme necessidade).
  - RLS obrigatório.
  - Admin: login email/senha + roles via tabela user_roles, com checagem segura (server-side/RLS + função has_role security definer).

Ponto importante de segurança/qualidade já identificado
- Existe um arquivo .env recente com variáveis VITE_*; neste projeto isso não deve ser usado. O frontend já possui o client Supabase com URL e anon key fixos em src/integrations/supabase/client.ts. Quando voltarmos a implementar (modo edição), vou remover/ignorar esse .env para evitar inconsistências e seguir a regra do projeto.

O que eu preciso de você agora (para começar a etapa 2)
- Envie o HTML da página “2 - New Details”.
- Se essa página depender de:
  - CSS externo, JS externo, imagens (logos/banners), ou fontes,
  envie também os arquivos ou links usados (ou um .zip com assets), e me diga se eu devo baixar/substituir por placeholders quando não houver o asset.

Critérios de pronto (para cada página)
- Layout fiel ao HTML
- Responsivo (mobile primeiro)
- Links do header/menu/rodapé funcionando
- Componentes reutilizáveis extraídos quando fizer sentido
- Sem regressões na Home

Próxima execução
- Assim que você mandar o HTML “2 - New Details”, eu implemento /noticia/:slug e ajusto a navegação para apontar para essa rota.
