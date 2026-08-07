# Avaliação

## 1. Contexto

O protótipo foi construído em cerca de duas horas com o Devin. Objetivo: replicar o
núcleo de capacidades que os três aplicativos usam na plataforma (grades, formulários
validados, RBAC, trilha de auditoria), não um sistema de produção. Está implantado na
Vercel e é compartilhável.

## 2. O Que Foi Replicado, o Que Não Foi, e a Lacuna

Replicado:

- Grades de dados com filtragem e busca (fila de KYC, reembolsos, flags)
- Formulários validados para ações que alteram estado
- RBAC (viewer, approver, admin), aplicado no servidor
- Log de auditoria: quem fez o quê, quando, com valores antes e depois
- Implantado e compartilhável

Não replicado, e o que fechar cada lacuna exigiria:

| Lacuna | O que exige |
|---|---|
| **SSO real** | Provedor gerenciado (Auth0, Clerk, WorkOS). Dias para integrar, dependência permanente. |
| **Banco de dados persistente** | Postgres mais migrações, backups, retenção. Dias para configurar, operação contínua. |
| **Conectores** | Integrações feitas à mão ou uma camada de integração (Composio, Merge, Paragon). A lacuna mais difícil: trabalho contínuo de qualquer forma. |
| **Desenvolvimento cidadão** | Não há como fechar. Cada nova ferramenta e cada mudança vira um ticket de engenharia. |
| **Certificação de compliance** | Herdada das escolhas de infraestrutura; meses de auditoria se a certificação for exigida. |

## 3. Dimensões de Avaliação

**Custo de construção.** Horas de engenharia primeiro: transformar o protótipo em um
sistema de produção (SSO, banco de dados, integrações, testes) leva semanas de tempo
sênior, não horas. E construir ainda significa comprar: motores de workflow (Temporal,
Inngest), autenticação gerenciada e camadas de integração têm cada um sua conta.
Auto-hospedar os equivalentes open-source (Temporal, Keycloak, n8n) troca assinaturas
por gasto de nuvem. Não existe opção com zero fornecedores.

**Ônus de manutenção.** Conectores são um produto, não uma funcionalidade; alguém
precisa manter cada integração funcionando conforme as APIs de terceiros mudam.
Infraestrutura auto-hospedada adiciona patches, upgrades e plantão.

**Implicações de segurança.** Autenticação e autorização são um compromisso
permanente. Autenticação (SSO, sessões, MFA) e autorização (modelos de papéis,
verificações de permissão em cada ação) vêm com a plataforma hoje e passariam a ser
responsabilidade da equipe. Em uma fintech regulada, o mesmo vale para obrigações de
auditoria e compliance.

**Custo de oportunidade.** O desenvolvimento cidadão desaparece: operações e
compliance param de construir seus próprios aplicativos e abrem tickets. A previsão de
demanda define a escala: de três a dez aplicativos CRUD, a equipe atual absorve; além
disso, um a três engenheiros dedicados a US$ 200 mil+ superam o custo da licença antes
mesmo do custo de oportunidade.

## 4. Capex vs. Opex

Como as dimensões se distribuem entre custo único e recorrente:

| Dimensão | Capex (único) | Opex (recorrente) |
|---|---|---|
| **Custo de construção** | Construção inicial: semanas de engenharia sênior para endurecer o protótipo | Assinaturas de ferramentas ou gasto de nuvem para equivalentes auto-hospedados |
| **Ônus de manutenção** | - | Manutenção de integrações, patches, upgrades, plantão |
| **Segurança** | Integração de SSO e autorização | Revisões de acesso, patches de dependências, trabalho de auditoria e compliance |
| **Custo de oportunidade** | Funcionalidades não entregues durante a construção inicial | Cada mudança de ferramenta como ticket de engenharia; 1 a 3 engenheiros dedicados (US$ 200 mil+ cada) se a demanda crescer |

Comprar inverte o perfil: capex quase zero, uma única linha de opex (a licença), e o
fornecedor carrega manutenção e segurança.
