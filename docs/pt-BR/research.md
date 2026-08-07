# Pesquisa: O que o Microsoft Power Apps faz e onde está o seu valor

## 1. O que é o Power Apps

O Microsoft Power Apps é uma plataforma de aplicativos low-code, parte da Power Platform
(Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). Ele oferece um ambiente
de desenvolvimento rápido para construir aplicativos de negócios personalizados que se conectam
a dados no Microsoft Dataverse ou em mais de 1.000 fontes externas (SharePoint, SQL Server,
Dynamics 365, Salesforce, entre outras).

Seus blocos de construção principais:

| Componente | O que oferece |
|---|---|
| **Canvas apps** | Construtor de UI drag-and-drop com controle em nível de pixel. "Comece pela experiência do usuário" — formulários, galerias e botões conectados a dados com fórmulas no estilo Excel (Power Fx). |
| **Model-driven apps** | UI gerada automaticamente a partir do modelo de dados. Defina tabelas, relacionamentos, formulários, visualizações e regras de negócio no Dataverse; o aplicativo (grades, formulários de detalhe, dashboards) é produzido para você. Este é o modo mais relevante para ferramentas internas do tipo CRUD. |
| **Microsoft Dataverse** | A plataforma de dados gerenciada: tabelas relacionais, segurança em nível de coluna, regras de negócio, validação no servidor e auditoria de alterações integrada. |
| **Conectores** | Mais de 1.000 conectores prontos para sistemas Microsoft e de terceiros; conectores personalizados para APIs REST internas. |
| **Power Automate** | Motor de workflow/automação — aprovações, notificações, tarefas agendadas — que trabalha em conjunto com os aplicativos. |
| **IA / Copilot** | Geração de aplicativos por linguagem natural e modelos do AI Builder incorporados aos aplicativos. |

## 2. As capacidades que importam para um time de ferramentas internas de uma fintech

Mapeando o valor do Power Apps para os três aplicativos do cliente (fila de revisão KYC,
dashboard de reembolsos, painel administrativo de feature flags), as capacidades que fazem
o trabalho de verdade são:

1. **Tabelas de dados + visualizações** — grades ordenáveis, filtráveis e pesquisáveis sobre
   registros de negócio (casos KYC, solicitações de reembolso, flags). Esta é a espinha dorsal
   de toda ferramenta interna.
2. **Formulários com validação** — criar/editar registros com campos obrigatórios, entradas
   tipadas, dropdowns e validação por regras de negócio.
3. **Controle de acesso baseado em papéis (RBAC)** — papéis de segurança do Dataverse +
   integração com o Microsoft Entra ID (Azure AD). Um analista de KYC pode revisar; apenas um
   líder de compliance pode aprovar; apenas a engenharia pode alternar uma flag de produção.
   Em uma fintech regulada, isso é inegociável.
4. **Trilha de auditoria** — a auditoria do Dataverse registra cada criação/atualização/exclusão
   e acesso de usuário, com histórico de valor antigo → valor novo por registro. Para KYC e
   reembolsos isso é um requisito de compliance, não um luxo.
5. **Workflow / aprovações** — máquinas de estado (pendente → aprovado/rejeitado) com
   notificações e escalonamento via Power Automate.
6. **Plataforma gerenciada** — SSO, hospedagem, atualizações, backups, responsividade mobile
   e disponibilidade são problema da Microsoft, não do time.

Vale notar que os três aplicativos do cliente usam uma fatia pequena da plataforma: todos são
aplicativos do tipo "tabela + formulário + ação restrita por papel + log de auditoria". Eles não
parecem usar os diferenciais de cauda longa (mais de 200 conectores, mobile offline, AI Builder,
citizen development em escala).

## 3. Onde o valor realmente está

**A verdadeira proposta de valor do Power Apps não é nenhuma funcionalidade isolada — é:**

- **Velocidade até a primeira versão**: um aplicativo CRUD funcional em horas/dias sem engenheiros.
- **Citizen development**: não engenheiros (operações, compliance) podem construir e modificar aplicativos.
- **Governança pronta para uso**: SSO, RBAC, auditoria e certificações de compliance
  (SOC 2, ISO 27001, etc.) herdadas da nuvem Microsoft.
- **Zero propriedade de infraestrutura**: sem servidores, sem deploys, sem plantão.

**Suas fraquezas bem documentadas** (relevantes ao avaliar uma substituição):

- **Custo e complexidade de licenciamento**: o Premium custa ~US$ 20/usuário/mês em tabela;
  conectores premium, capacidade do Dataverse e empilhamento por aplicativo tornam os custos
  reais difíceis de prever.
- **Limites de delegação**: consultas que o conector não consegue delegar são avaliadas no
  cliente sobre um conjunto limitado de registros (500–2.000 linhas) — os resultados ficam
  silenciosamente errados em escala.
- **Modelo de dados e UX restritos**: lógica relacional complexa, UX personalizada e qualquer
  coisa além de "formulários sobre dados" fica desajeitada rapidamente.
- **Limites de requisições de API**: limites diários de API por usuário atrelados ao licenciamento.
- **Lock-in de fornecedor**: aplicativos, fórmulas (Power Fx) e dados (Dataverse) não são portáveis.

## 4. Os custos ocultos de substituir a plataforma

O checklist de funcionalidades acima subestima o que "comprar" realmente adquire. Quatro custos
são fáceis de subestimar ao propor uma alternativa interna:

1. **Autenticação não é trivial.** SSO, gerenciamento de sessão, modelos de papéis/permissões e
   sua manutenção contínua (patches de segurança, revisões de acesso, offboarding) vêm integrados
   e prontos no Power Apps via Entra ID. Reconstruir isso do zero — e mantê-lo seguro em uma
   fintech regulada — é um compromisso de engenharia significativo e permanente, mesmo com
   bibliotecas como NextAuth/Auth.js ou provedores gerenciados (Auth0, Clerk, WorkOS).
2. **Conectores são um produto, não uma funcionalidade.** O Power Apps entrega mais de 1.000
   conectores mantidos. Uma plataforma interna teria que construir e manter cada integração
   manualmente ou adotar uma camada de integração (ex.: Composio, Merge, Paragon) — o que
   reintroduz uma conta de fornecedor e ainda deixa código de cola para manter. Se as ferramentas
   do cliente precisarem de muitas integrações de terceiros, só isso já torna difícil justificar
   a reconstrução.
3. **Citizen development tira o TCO do time de engenharia.** Usuários não técnicos construindo/
   modificando seus próprios aplicativos — dentro de guardrails e limites definidos pelos
   administradores para toda a empresa — significa que ferramentas internas não entram na fila
   atrás do trabalho de produto. Uma solução interna transforma cada nova ferramenta e cada
   mudança em um ticket de engenharia; esse overhead contínuo é o maior custo oculto do "construir".
4. **A previsão de demanda é a variável decisiva.** Se esses 3 aplicativos são praticamente tudo
   (ou um crescimento até ~10 aplicativos CRUD semelhantes), uma solução interna simples mantida
   dentro do escopo do time existente é plausível. Se a demanda por novos aplicativos internos
   tende a continuar crescendo, a plataforma precisa de donos dedicados — e 1–3 FTEs a US$ 200 mil+/ano
   cada rapidamente excedem o custo atual da licença, antes mesmo de contar o custo de oportunidade.
5. **"Construir" ainda significa comprar (ou hospedar) as peças.** Replicar as capacidades do
   Power Apps internamente quase inevitavelmente puxa outras plataformas — motores de workflow
   duráveis (ex.: Temporal, Inngest), plataformas de conectores/integração (ex.: Composio),
   authn/authz gerenciados (ex.: Auth0, Clerk, WorkOS) — cada uma com sua própria conta que deve
   ser descontada da economia de licença. A rota open-source (Temporal auto-hospedado, Keycloak,
   n8n, etc.) troca essas assinaturas por uma conta de nuvem maior mais as horas de engenharia
   para montar a infraestrutura e mantê-la atualizada, monitorada e com patches. De qualquer
   forma, "construir" nunca é uma opção com zero fornecedores e zero infraestrutura.

Uma avaliação completa também deve comparar **plataformas alternativas** (Retool, Appsmith,
Budibase, ToolJet, etc.) cujos preços podem se alinhar melhor à escala e ao uso do cliente —
"substituir o fornecedor" e "construir internamente" não são as únicas duas opções; "migrar para
um fornecedor mais barato" pode superar ambas.

## 5. A questão dos US$ 250 mil/ano

Em preço de tabela, 60 engenheiros × US$ 20/usuário/mês ≈ **US$ 14,4 mil/ano** — nem perto de
US$ 250 mil. Um gasto anual de US$ 250 mil implica alguma combinação de: licenciamento para toda
a organização (todos os funcionários, não apenas engenheiros), add-ons de armazenamento/capacidade
do Dataverse, conectores premium, licenciamento do Power Automate, ambientes gerenciados e/ou um
contrato enterprise que inclui consultoria. Duas implicações:

1. A oportunidade de economia é real, mas a primeira pergunta ao cliente deve ser uma auditoria
   de licenças — eles podem estar superlicenciados para três aplicativos internos, independentemente
   de construir ou comprar.
2. Qualquer alternativa interna deve ser comparada com o preço *renegociado* do Power Apps
   (ou um concorrente mais barato como o Retool a ~US$ 10–50/usuário/mês), não com os atuais US$ 250 mil.

## 6. O que um protótipo precisa demonstrar

Para testar com credibilidade "poderíamos construir isso internamente com o Devin?", o protótipo
deve replicar o núcleo de capacidades identificado no §2, aplicado aos três aplicativos reais do cliente:

- [ ] Grade de dados com filtro/busca para cada aplicativo (fila KYC, reembolsos, flags)
- [ ] Formulários com validação para ações que mudam estado (aprovar/rejeitar KYC, processar
      reembolso, alternar/criar flag)
- [ ] Controle de acesso baseado em papéis (visualizador / aprovador / admin) restringindo essas ações
- [ ] Um log de auditoria capturando quem fez o quê, quando, com valores antes/depois
- [ ] Implantado e compartilhável (Vercel), demonstrando que a história de "zero infra" é alcançável

Fora do escopo para um protótipo de 2 horas (e sinalizado honestamente na avaliação): SSO real
(Entra ID/Okta), um banco de dados de produção com backups, o ecossistema de conectores, citizen
development (não engenheiros modificando aplicativos) e certificação de compliance.

## Fontes

- Microsoft, "What is Power Apps?" — learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) — learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing — microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (ago 2025)
- Microsoft, Dataverse auditing — learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
