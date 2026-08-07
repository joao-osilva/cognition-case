# Pesquisa: O Que o Microsoft Power Apps Faz e Onde Está o Seu Valor

## 1. O Que É o Power Apps

O Microsoft Power Apps é uma plataforma de aplicativos low-code dentro da Power Platform
(Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). Ela oferece um
ambiente de desenvolvimento rápido para aplicativos de negócio que se conectam a dados
no Microsoft Dataverse ou em mais de 1.000 fontes externas (SharePoint, SQL Server,
Dynamics 365, Salesforce, entre outras).

Seus blocos de construção principais:

| Componente | O que oferece |
|---|---|
| **Aplicativos de tela (canvas)** | Construtor de UI de arrastar e soltar: formulários, galerias e botões conectados a dados com fórmulas no estilo Excel (Power Fx). |
| **Aplicativos baseados em modelo** | UI gerada a partir do modelo de dados. Defina tabelas, relacionamentos, formulários, exibições e regras de negócio no Dataverse; o aplicativo (grades, formulários de detalhe, dashboards) é produzido automaticamente. Este é o modo mais relevante para ferramentas internas do tipo CRUD. |
| **Microsoft Dataverse** | A plataforma de dados gerenciada: tabelas relacionais, segurança em nível de coluna, regras de negócio, validação no servidor e auditoria de alterações integrada. |
| **Conectores** | Mais de 1.000 conectores prontos para sistemas Microsoft e de terceiros; conectores personalizados para APIs REST internas. |
| **Power Automate** | Mecanismo de fluxo de trabalho e automação (aprovações, notificações, tarefas agendadas) que se integra aos aplicativos. |
| **IA / Copilot** | Geração de aplicativos por linguagem natural e modelos do AI Builder incorporados aos aplicativos. |

## 2. As Capacidades Que Importam para Este Cliente

Os três aplicativos do cliente (fila de revisão de KYC, dashboard de reembolsos, painel
de administração de feature flags) dependem de um subconjunto específico da plataforma:

1. **Tabelas de dados e exibições**: grades ordenáveis, filtráveis e pesquisáveis sobre
   registros de negócio (casos de KYC, solicitações de reembolso, flags).
2. **Formulários com validação**: criação e edição de registros com campos
   obrigatórios, entradas tipadas e validação por regras de negócio.
3. **Controle de acesso baseado em papéis**: papéis de segurança do Dataverse
   integrados ao Microsoft Entra ID. Um analista pode revisar, apenas um líder de
   compliance pode aprovar, apenas a engenharia pode alternar uma flag de produção.
   Em uma fintech regulada, isso é um requisito.
4. **Trilha de auditoria**: a auditoria do Dataverse registra cada criação,
   atualização e exclusão com valores antigos e novos por registro. Para KYC e
   reembolsos, isso é um requisito de compliance.
5. **Fluxos de trabalho e aprovações**: máquinas de estado (de pendente para aprovado
   ou rejeitado) com notificações e escalonamento via Power Automate.
6. **Plataforma gerenciada**: SSO, hospedagem, atualizações, backups e disponibilidade
   são responsabilidade da Microsoft.

Os três aplicativos usam uma fatia pequena da plataforma. Todos seguem o mesmo padrão:
tabela, formulário, ação restrita por papel, log de auditoria. Eles não parecem usar os
diferenciais de cauda longa, como o catálogo de conectores, o modo móvel offline ou o
AI Builder.

## 3. Onde Está o Valor

O valor do Power Apps está no pacote, e não em uma única funcionalidade:

- **Velocidade até a primeira versão**: um aplicativo CRUD funcional em horas ou dias,
  sem engenheiros.
- **Desenvolvimento cidadão**: não engenheiros (operações, compliance) podem criar e
  modificar aplicativos.
- **Governança pronta**: SSO, RBAC, auditoria e certificações de compliance
  (SOC 2, ISO 27001) herdadas da nuvem Microsoft.
- **Zero propriedade de infraestrutura**: sem servidores, deployments ou plantão.

Suas fraquezas documentadas, relevantes ao avaliar uma substituição:

- **Custo e complexidade de licenciamento**: o plano Premium custa cerca de
  US$ 20/usuário/mês em preço de tabela; conectores premium, capacidade do Dataverse e
  empilhamento por aplicativo tornam os custos reais difíceis de prever.
- **Limites de delegação**: consultas que um conector não consegue delegar são
  avaliadas no cliente sobre um conjunto limitado de registros (500 a 2.000 linhas),
  o que produz resultados incorretos em escala.
- **Modelo de dados e UX restritos**: lógica relacional complexa e UX personalizada
  além de formulários sobre dados são difíceis.
- **Limites de requisições de API**: cotas diárias de API por usuário atreladas ao
  licenciamento.
- **Dependência do fornecedor**: aplicativos, fórmulas Power Fx e dados do Dataverse
  não são portáveis.

## 4. Os Custos Ocultos de Substituir a Plataforma

Cinco custos são fáceis de subestimar ao propor uma alternativa interna:

1. **Autenticação e autorização são um compromisso permanente de engenharia.** SSO,
   gestão de sessões e modelos de papéis vêm integrados ao Power Apps via Entra ID.
   Reconstruí-los e mantê-los seguros em uma fintech regulada é um trabalho contínuo
   significativo, mesmo com provedores gerenciados (Auth0, Clerk, WorkOS) ou
   bibliotecas.
2. **Conectores são um produto, não uma funcionalidade.** Uma plataforma interna teria
   de construir e manter cada integração manualmente ou adotar uma camada de
   integração (Composio, Merge, Paragon), o que reintroduz uma fatura de fornecedor e
   ainda deixa código de integração para manter.
3. **O desenvolvimento cidadão desloca custo para fora da equipe de engenharia.** Com
   o Power Apps, usuários não técnicos criam e modificam seus próprios aplicativos
   dentro de limites definidos pelos administradores. Uma solução interna transforma
   cada nova ferramenta e cada alteração em um chamado de engenharia. Essa sobrecarga
   contínua é o maior custo oculto de construir.
4. **A previsão de demanda é a variável decisiva.** Se a demanda permanecer em
   aproximadamente esses três aplicativos, ou crescer para cerca de dez aplicativos
   CRUD semelhantes, uma solução interna simples mantida dentro do escopo da equipe
   atual é plausível. Se a demanda continuar crescendo, a plataforma precisará de
   responsáveis dedicados, e um a três engenheiros a mais de US$ 200 mil por ano cada
   rapidamente excedem o custo atual da licença, antes de contar o custo de
   oportunidade.
5. **Construir ainda significa comprar ou hospedar as peças.** Replicar as capacidades
   da plataforma exige mecanismos de workflow (Temporal, Inngest), plataformas de
   integração e autenticação gerenciada, cada um com sua própria fatura. A rota de
   código aberto (Temporal, Keycloak, n8n auto-hospedados) troca essas assinaturas por
   uma conta de nuvem maior, além das horas de engenharia para operar, atualizar e
   corrigir a infraestrutura. Construir nunca é uma opção com zero fornecedores e zero
   infraestrutura.

Uma avaliação completa também deve comparar plataformas alternativas (Retool, Appsmith,
Budibase, ToolJet), cujos preços podem se adequar melhor à escala do cliente. Substituir
o fornecedor e construir internamente não são as únicas opções; migrar para um
fornecedor mais barato pode superar ambas.

## 5. Interpretando o Gasto Anual de US$ 250 Mil

Em preço de tabela, 60 engenheiros a US$ 20/usuário/mês somam cerca de US$ 14,4 mil por
ano, muito abaixo de US$ 250 mil. Um gasto de US$ 250 mil implica alguma combinação de
licenciamento para toda a organização, complementos de capacidade do Dataverse,
conectores premium, licenciamento do Power Automate, ambientes gerenciados ou um
contrato corporativo que inclui consultoria. Duas implicações:

1. A primeira pergunta ao cliente deve ser uma auditoria de licenças. Eles podem estar
   com licenças em excesso para três aplicativos internos, independentemente da decisão
   de construir ou comprar.
2. Qualquer alternativa interna deve ser comparada ao preço renegociado do Power Apps,
   ou a um concorrente mais barato de US$ 10 a US$ 50/usuário/mês, e não aos atuais
   US$ 250 mil.

## 6. O Que um Protótipo Deve Demonstrar

Para testar se a equipe conseguiria construir isso internamente com o Devin, o protótipo
deve replicar o núcleo de capacidades da seção 2, aplicado aos três aplicativos do
cliente:

- [ ] Grade de dados com filtro e busca para cada aplicativo (fila de KYC, reembolsos, flags)
- [ ] Formulários com validação para ações que alteram estado (aprovar ou rejeitar KYC,
      processar reembolso, alternar ou criar flag)
- [ ] Controle de acesso baseado em papéis (visualizador, aprovador, admin) restringindo
      essas ações
- [ ] Um log de auditoria registrando quem fez o quê, quando, com valores antes e depois
- [ ] Publicado e compartilhável (Vercel)

Fora do escopo de um protótipo de duas horas, e sinalizado na análise: SSO real, um
banco de dados de produção com backups, o ecossistema de conectores, desenvolvimento
cidadão e certificação de compliance.

## Fontes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes do Power Apps (canvas, baseado em modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, preços do Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guia de Licenciamento da Power Platform (ago. 2025)
- Microsoft, auditoria do Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
