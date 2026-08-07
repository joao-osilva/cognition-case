# Pesquisa: O Que o Microsoft Power Apps Faz e Onde Está o Seu Valor

## 1. O Que É o Power Apps

Uma plataforma low-code, parte da Power Platform da Microsoft. Constrói aplicativos de
negócio sobre o Dataverse ou mais de 1.000 fontes de dados externas.

| Componente | O que oferece |
|---|---|
| **Aplicativos de tela (canvas)** | Construtor de UI de arrastar e soltar com fórmulas no estilo Excel (Power Fx). |
| **Aplicativos baseados em modelo** | UI gerada a partir do modelo de dados: defina tabelas e regras, receba grades, formulários e dashboards. O modo usado para ferramentas internas CRUD. |
| **Microsoft Dataverse** | Plataforma de dados gerenciada: tabelas relacionais, segurança por coluna, validação, auditoria de alterações. |
| **Conectores** | Mais de 1.000 integrações prontas; conectores personalizados para APIs internas. |
| **Power Automate** | Fluxos de trabalho: aprovações, notificações, tarefas agendadas. |
| **IA / Copilot** | Geração de aplicativos por linguagem natural, modelos do AI Builder. |

## 2. As Capacidades Que os Três Aplicativos Usam

1. **Grades de dados**: visões ordenáveis e filtráveis sobre casos de KYC, reembolsos, flags.
2. **Formulários validados**: campos obrigatórios, entradas tipadas, regras de negócio.
3. **RBAC**: analistas revisam, líderes de compliance aprovam, engenharia alterna
   flags. Obrigatório em uma fintech regulada.
4. **Trilha de auditoria**: cada alteração registrada com valores antigos e novos.
   Obrigatório para KYC e reembolsos.
5. **Aprovações**: máquinas de estado pendente / aprovado / rejeitado com notificações.
6. **Conectores**: integrações (provedores de identidade, processadores de pagamento)
   que a equipe não mantém.
7. **Plataforma gerenciada**: SSO, hospedagem, patches e backups são problema do
   fornecedor.

Mesmo padrão nos três aplicativos: tabela, formulário, ação restrita por papel, log de
auditoria. Modo móvel offline, AI Builder e o resto da plataforma ficam sem uso.

## 3. Onde Está o Valor

O valor está no pacote, não em uma única funcionalidade:

- **Velocidade**: um aplicativo CRUD funcional em horas ou dias, sem engenheiros.
- **Desenvolvimento cidadão**: operações e compliance constroem seus próprios aplicativos.
- **Governança**: SSO, RBAC, auditoria, SOC 2 / ISO 27001 herdados da Microsoft.
- **Integrações mantidas**: conectores são configuração, não código para manter.
- **Sem infraestrutura**: sem servidores, deployments ou plantão.

As fraquezas documentadas:

- **Licenciamento**: ~US$ 20/usuário/mês de tabela, mas conectores premium, capacidade
  do Dataverse e empilhamento por aplicativo tornam os custos reais difíceis de prever.
- **Limites de delegação**: consultas não delegáveis rodam no cliente sobre 500 a
  2.000 linhas e retornam resultados errados em escala.
- **UX restrita**: difícil ir além de formulários sobre dados.
- **Cotas de API**: limites diários de requisições por usuário.
- **Lock-in**: aplicativos, Power Fx e dados do Dataverse não são portáveis.

## 4. Alerta: o Preço Pode Não Refletir o Uso

O gasto com a plataforma costuma refletir a estrutura do contrato, não o uso. No preço
de tabela, 60 usuários custam cerca de US$ 14,4 mil/ano, bem abaixo dos US$ 250 mil
informados. Comece com uma auditoria de licenças. Compare construir com o preço
renegociado ou um concorrente mais barato, não com o contrato atual.

## Fontes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes do Power Apps (canvas, baseado em modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, preços do Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guia de Licenciamento da Power Platform (ago. 2025)
- Microsoft, auditoria do Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
