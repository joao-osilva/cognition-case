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

## 2. As Capacidades Que Importam para a Equipe de Engenharia

Os três aplicativos (fila de revisão de KYC, dashboard de reembolsos, painel de
administração de feature flags) dependem de um subconjunto específico da plataforma:

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
6. **Conectores**: ferramentas internas raramente funcionam isoladas. Uma fila de KYC
   lê de provedores de verificação de identidade, um dashboard de reembolsos conversa
   com processadores de pagamento, e um painel de flags pode notificar sistemas de
   chat ou de tickets. O catálogo de conectores mantido pelo fornecedor, mais
   conectores personalizados para APIs internas, é o que mantém essas integrações fora
   da fila da equipe de engenharia.
7. **Plataforma gerenciada**: SSO, hospedagem, atualizações, backups e disponibilidade
   são responsabilidade do fornecedor.

Os três aplicativos seguem o mesmo padrão central: tabela, formulário, ação restrita
por papel, log de auditoria, com integrações nas bordas. Eles não parecem usar os
demais diferenciais da plataforma, como o modo móvel offline ou o AI Builder.

## 3. Onde Está o Valor

O valor da plataforma está no pacote, e não em uma única funcionalidade:

- **Velocidade até a primeira versão**: um aplicativo CRUD funcional em horas ou dias,
  sem engenheiros.
- **Desenvolvimento cidadão**: não engenheiros (operações, compliance) podem criar e
  modificar aplicativos.
- **Governança pronta**: SSO, RBAC, auditoria e certificações de compliance
  (SOC 2, ISO 27001) herdadas da nuvem Microsoft.
- **Um ecossistema de integrações mantido**: mais de 1.000 conectores que o fornecedor
  mantém funcionando conforme as APIs de terceiros mudam, de modo que integrações são
  configuração, e não código que a equipe precisa manter.
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

## 4. Um Alerta Sobre o Gasto Atual: o Preço Pode Não Refletir o Uso

Uma verificação útil antes de qualquer comparação entre construir e comprar: o que uma
equipe paga por uma plataforma hoje costuma refletir como o contrato foi estruturado,
e não como a plataforma é usada. O licenciamento de low-code normalmente mistura
assentos por usuário, complementos de capacidade, conectores premium, licenciamento de
automação, ambientes gerenciados e contratos corporativos que incluem consultoria. O
uso equivalente a três aplicativos pode estar dentro de um contrato precificado para
muito mais.

Como referência, no preço de tabela do Power Apps, 60 engenheiros a US$ 20/usuário/mês
somam cerca de US$ 14,4 mil por ano, uma ordem de magnitude abaixo do gasto informado
de US$ 250 mil. Seja qual for a plataforma, duas implicações se seguem:

1. O primeiro passo deve ser uma auditoria de licenças e de uso. A equipe pode estar
   pagando por capacidade, assentos ou serviços agregados que não usa,
   independentemente da decisão de construir ou comprar.
2. Qualquer alternativa interna deve ser comparada ao preço renegociado da plataforma,
   ou a um concorrente mais barato de US$ 10 a US$ 50/usuário/mês, e não ao contrato
   atual.

## Fontes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes do Power Apps (canvas, baseado em modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, preços do Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guia de Licenciamento da Power Platform (ago. 2025)
- Microsoft, auditoria do Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
