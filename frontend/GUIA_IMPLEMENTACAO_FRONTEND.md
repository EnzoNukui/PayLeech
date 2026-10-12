# Guia de implementação do frontend PayLeech

Este documento define a direção visual, a arquitetura de componentes, as rotas e a sequência de trabalho do frontend. Ele acompanha a estrutura atual do projeto e serve como referência antes e durante a implementação.

## Estado da implementação

- **Etapa 1 — fundação, rotas e landing page:** concluída. A rota `/` é a entrada pública, `/resumo` recebe a visão geral e os shells público, de autenticação e do app são renderizados separadamente.
- **Etapa 2 — autenticação:** login, cadastro, sessão HTTP e proteção das rotas privadas foram implementados.
- **Próxima etapa — shell da aplicação:** consolidar a navegação lateral no desktop e inferior no mobile.

## 1. Direção do produto

O Copilot Money é a referência visual principal para a apresentação do produto e para a experiência da aplicação. A ideia é aproveitar a clareza, a hierarquia de informações e a narrativa por seções, sem reproduzir sua marca ou copiar suas telas.

A identidade do PayLeech vem do logotipo e dos arquivos em `logos-utilizaveis/`:

- Base em porcelana e creme, com marrom espresso e cacau.
- Dourado claro como cor de destaque, usado com moderação.
- Tipografia de sistema com aparência próxima à Apple.
- Interfaces com dados reais do produto, listas legíveis, gráficos simples e espaço visual suficiente.
- Animações úteis e discretas, sem movimento decorativo excessivo.

O artigo de processo da Monzo serve como referência para o método: manter tokens consistentes, mostrar o produto em vez de apenas descrevê-lo, usar elementos de marca intencionais e aplicar movimento para orientar a atenção.

## 2. Regras de implementação

1. `App.tsx` é o ponto central que seleciona as rotas e o shell visual adequado. As páginas não importam seus próprios headers ou footers globais.
2. A landing tem header e footer próprios. Eles não substituem o header e o footer do app autenticado.
3. Cada componente reutilizável fica em sua própria pasta, com seu arquivo principal dentro dela.
4. Páginas compõem componentes e organizam conteúdo; não concentram componentes visuais grandes ou lógica de chamadas HTTP.
5. Tokens globais de cor, tipografia, raio e sombra ficam em `globals.css`. Componentes usam esses tokens, evitando cores soltas repetidas.
6. Tailwind é usado para composição e estilos. React Icons é usado para ícones de interface; Iconify é a fonte planejada para logos coloridos de serviços.
7. Motion é usado para transições entre páginas e interações de scroll/mouse. Todos os efeitos respeitam a preferência de movimento reduzido.
8. A área autenticada permanece responsiva: navegação lateral no desktop e navegação inferior no mobile.

## 3. Rotas previstas

| Rota | Área | Conteúdo |
| --- | --- | --- |
| `/` | Pública | Landing page do PayLeech |
| `/login` | Pública | Login por e-mail e senha |
| `/cadastro` | Pública | Criação de conta |
| `/resumo` | Autenticada | Visão geral dos gastos e próximas cobranças |
| `/assinaturas` | Autenticada | Lista, CRUD, filtros e categorias |
| `/gastos` | Autenticada | Histórico e gráfico anual de cobranças |
| `/404` | Pública | Página de rota inexistente |

O roteamento já usa `/` para a landing e `/resumo` para a visão geral atual (`Home`). Há também uma página `Resumo` ainda não registrada nas rotas; durante a implementação da aplicação, devemos consolidar `Home` e `Resumo` em uma única página de visão geral para evitar duas telas com a mesma responsabilidade.

O link central **Visão geral** no header da landing leva à seção de apresentação do produto na própria página. O botão **Login** abre `/login`; os CTAs de criação de conta abrem `/cadastro`.

## 4. Shells e organização de componentes

O `App.tsx` decide qual shell montar. O shell público, o shell de autenticação e o shell do app são independentes:

```text
frontend/src/
├── App.tsx
├── routes/
│   └── AppRoutes.tsx
├── pages/
│   ├── Landing/
│   │   └── index.tsx
│   ├── Resumo/
│   │   └── index.tsx
│   ├── Assinaturas/
│   │   └── index.tsx
│   ├── Gastos/
│   │   └── index.tsx
│   ├── Login/
│   ├── Cadastro/
│   └── Error/
├── components/
│   ├── auth/
│   │   ├── AuthHeader/
│   │   ├── AuthFooter/
│   │   ├── AuthPageLayout/
│   │   ├── AuthShowcase/
│   │   ├── LoginShowcase/
│   │   ├── LoginMagneticCard/
│   │   ├── RegistrationShowcase/
│   │   ├── AuthMessage/
│   │   ├── PasswordField/
│   │   └── RouteGuards/
│   ├── landing/
│   │   ├── LandingHeader/
│   │   ├── LandingFooter/
│   │   ├── LandingHero/
│   │   ├── SubscriptionShowcase/
│   │   ├── UpcomingChargesSection/
│   │   ├── AnnualSpendingSection/
│   │   ├── CategorySection/
│   │   ├── LandingCallToAction/
│   │   ├── ScrollReveal/
│   │   ├── SubscriptionBrandIcon/
│   │   └── InteractiveSpendingChart/
│   ├── Header/                 # Navegação do app atual
│   ├── Footer/                 # Footer do app autenticado
│   ├── layout/
│   │   ├── Sidebar/
│   │   ├── MobileNavigation/
│   │   └── PageTransition/
│   └── ui/
│       ├── Button/
│       ├── Dialog/
│       ├── EmptyState/
│       ├── LoadingState/
│       ├── PageTitle/
│       ├── Select/
│       └── TextField/
├── service/
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── assinaturaService.ts
│   ├── categoriaService.ts
│   ├── cobrancaService.ts
│   └── resumoService.ts
├── types/
│   ├── auth.ts
│   ├── assinatura.ts
│   ├── categoria.ts
│   ├── cobranca.ts
│   └── resumo.ts
└── globals.css
```

Cada pasta de componente receberá seu arquivo `.tsx`; estilos específicos só serão criados quando os tokens e classes Tailwind não forem suficientes. Componentes de landing ficam isolados dos componentes de navegação autenticada.

## 5. Estrutura visual da landing

### Cabeçalho

- Logotipo alinhado à esquerda.
- Link **Visão geral** centralizado na janela, sem depender do espaço ocupado pelo logo.
- Botão **Login** à direita.
- Sem sidebar do app e sem links adicionais no topo.

### Narrativa de scroll

1. **Abertura marrom:** apresenta o PayLeech, sua proposta e um CTA de cadastro. Um pequeno conjunto de logos de serviços e uma prévia compacta do produto introduzem o funcionamento.
2. **Próximas cobranças:** lista curta e legível com datas, serviços e valores.
3. **Gastos ao longo do ano:** gráfico anual simples para explicar o histórico de cobranças.
4. **Categorias:** distribuição dos gastos recorrentes por categoria.
5. **CTA final claro:** convite para criar uma conta.
6. **Footer marrom:** mesma família de cor da abertura, com links institucionais e navegação básica.

O fundo muda gradualmente conforme a rolagem: marrom no início, passando por tons de areia e creme, até porcelana no final. O footer retorna ao marrom como fechamento visual.

O Motion deve animar a entrada das seções, a progressão do gráfico e a aparição/alinhamento de logos conforme o scroll. Interações com mouse podem dar respostas pequenas aos logos e ao gráfico, sem deslocamentos grandes nem perspectiva 3D. Conteúdo e dados permanecem legíveis sem animação, e `prefers-reduced-motion` reduz ou remove os efeitos.

## 6. Área autenticada

### Visão geral (`/resumo`)

- Resumo mensal e anual.
- Próximas cobranças em destaque.
- Distribuição por categoria e tendências ao longo dos meses.
- Ações rápidas para abrir assinaturas ou registrar pagamento.

### Assinaturas (`/assinaturas`)

- Lista de assinaturas com logo, nome, preço, periodicidade, categoria, próxima cobrança e status.
- Busca e filtros por status e categoria dentro da mesma página.
- Criar, editar e excluir usando componentes compartilhados, como diálogo e campos.
- Categorias são gerenciadas nessa área, sem uma página exclusiva.

### Gastos (`/gastos`)

- Histórico das cobranças e gráfico anual.
- Filtros por período, status e assinatura quando suportados pelos dados.
- Confirmação de pagamento de cobranças previstas.

Não será criada uma página isolada de cobranças. Elas aparecem na visão geral, nos detalhes das assinaturas e na página de gastos/histórico.

## 7. Serviços, tipos e integração com o backend

Chamadas HTTP ficam em `services/`; páginas e componentes não constroem URLs nem repetem configuração de sessão. `apiClient.ts` centraliza a URL base, `credentials: 'include'`, leitura/armazenamento temporário do CSRF e tratamento comum de erros. Tipos TypeScript refletem os DTOs Java, sem usar entidades JPA como contrato direto.

Endpoints existentes identificados no backend:

| Endpoint | Uso no frontend |
| --- | --- |
| `GET /auth/csrf` | Obter token e iniciar sessão/cookie CSRF |
| `POST /auth/cadastro` | Criar conta |
| `POST /auth/login` | Iniciar sessão |
| `GET /auth/me` | Recuperar usuário da sessão atual |
| `POST /auth/logout` | Encerrar sessão (enviar CSRF) |
| `GET /categorias` | Listar categorias do usuário |
| `POST /categorias` | Criar categoria |
| `GET /assinaturas` | Listar, com filtros opcionais `status` e `categoriaId` |
| `POST /assinaturas` | Criar assinatura |
| `GET /assinaturas/{id}` | Consultar uma assinatura |
| `PUT /assinaturas/{id}` | Atualizar assinatura |
| `DELETE /assinaturas/{id}` | Excluir assinatura |
| `GET /assinaturas/proximas-cobrancas` | Consultar próximas cobranças |
| `GET /resumo` | Obter resumo financeiro |
| `GET /cobrancas` | Listar cobranças, com filtro opcional `status` |
| `PATCH /cobrancas/{id}/pagar` | Confirmar pagamento |

O backend usa sessão HTTP. O frontend deve preservar o cookie `JSESSIONID` usando credenciais incluídas nas requisições; operações de escrita também enviam o cabeçalho CSRF indicado por `GET /auth/csrf`. Depois do login, a sessão/token devem ser atualizados conforme o contrato do backend. Não guardar senha nem tratar o token CSRF como credencial de login.

## 8. Sequência definitiva de implementação

### Etapa 1 — Fundação e rotas (implementada)

- Confirmar tokens em `globals.css` a partir da paleta aprovada e dos logos disponíveis.
- Separar visualmente shells público, de autenticação e autenticado sem duplicar os componentes globais.
- Definir `/` como landing e resolver a migração da Home atual para `/resumo`.

### Etapa 1 — Landing page (implementada)

- Montar `LandingHeader`, hero, seções em scroll, CTA e `LandingFooter`.
- Implementar progressão de fundo marrom para claro vinculada ao scroll.
- Adicionar motion de entrada, gráfico e logos.
- Conferir visual em desktop e mobile, incluindo acesso por teclado e movimento reduzido.

### Etapa 2 — Login, cadastro e sessão (implementada)

- Conectar os formulários aos endpoints de autenticação.
- Tratar validação, carregamento, erro de credenciais e conta existente.
- Consultar `/auth/me` ao carregar a aplicação e proteger rotas autenticadas.

Implementação atual: formulários responsivos com transição de layout e cartões interativos, validação alinhada aos DTOs Java, cliente HTTP com cookies e CSRF, consulta da sessão atual e guards para rotas autenticadas e públicas. O cadastro retorna ao login porque o backend não inicia sessão automaticamente ao criar a conta.

### Etapa 3 — Shell da aplicação

- Finalizar sidebar desktop e navegação inferior mobile.
- Ligar os itens do menu às rotas finais.
- Consolidar as páginas `Home` e `Resumo` numa única visão geral.

### Etapa 4 — Dados da visão geral

- Criar serviços e tipos para resumo, cobranças e categorias.
- Trocar os estados vazios atuais por dados do backend, mantendo loading, erro e ausência de dados.

### Etapa 5 — Assinaturas e categorias

- Implementar listagem, busca/filtros, CRUD e diálogos.
- Exibir logos de serviços por Iconify e fallback visual para serviços sem logo.
- Carregar categorias do usuário e permitir sua gestão dentro da página de assinaturas.

### Etapa 6 — Gastos e cobranças

- Montar histórico e gráfico anual a partir das cobranças persistidas.
- Adicionar filtros disponíveis e confirmação de pagamento.
- Manter valores e datas consistentes com os DTOs recebidos.

### Etapa 7 — Acabamento integrado

- Revisar estados de carregamento, vazios, erro e sucesso.
- Conferir responsividade, foco, contraste, navegação por teclado e `prefers-reduced-motion`.
- Verificar manualmente o fluxo landing → cadastro/login → resumo → assinaturas → gastos → logout.

## 9. Critérios para manter consistência

- Não acrescentar um componente reutilizado diretamente dentro de uma página; criar uma pasta própria para ele.
- Não importar `LandingHeader` ou `LandingFooter` nas páginas internas, nem o shell interno na landing.
- Não usar dados fictícios como se fossem dados reais; exemplos visuais ficam identificados como demonstração.
- Não adicionar animação que atrapalhe leitura, foco, clique ou navegação.
- Não espalhar URLs, tokens de cor ou regras de sessão entre componentes.
- Seguir os DTOs e as rotas existentes do backend; mudanças de contrato precisam ser alinhadas antes de consumir.
