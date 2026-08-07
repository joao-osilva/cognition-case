# Avaliação

_A avaliação completa (o que o protótipo replicou, o que não conseguiu e o que fechar a
lacuna exigiria em custo de construção, ônus de manutenção, implicações de segurança e
custo de oportunidade) está sendo escrita na próxima fase. Duas partes já estão
prontas: os critérios contra os quais o protótipo foi construído e os custos ocultos
que qualquer substituição precisa precificar._

## O Que o Protótipo Se Propôs a Demonstrar

Para testar se a equipe conseguiria construir isso internamente com o Devin, o
protótipo replica o núcleo de capacidades identificado na pesquisa, aplicado aos três
aplicativos:

- [x] Grade de dados com filtragem e busca para cada aplicativo (fila de KYC,
      reembolsos, flags)
- [x] Formulários com validação para ações que alteram estado (aprovar ou rejeitar
      KYC, processar reembolso, alternar ou criar flag)
- [x] Controle de acesso baseado em papéis (viewer, approver, admin) restringindo
      essas ações, aplicado no servidor
- [x] Um log de auditoria registrando quem fez o quê, quando, com valores antes e
      depois
- [x] Implantado e compartilhável (Vercel)

Fora do escopo de um protótipo de duas horas: SSO real, um banco de dados de produção
com backups, o ecossistema de conectores, desenvolvimento cidadão e certificação de
compliance. Essas exclusões são deliberadas e são precificadas abaixo e na
recomendação.

## Os Custos Ocultos de Substituir a Plataforma

Cinco custos são fáceis de subestimar ao propor uma alternativa interna:

1. **Autenticação e autorização são um compromisso permanente de engenharia.** SSO,
   gestão de sessões e modelos de papéis vêm integrados à plataforma via Entra ID.
   Reconstruí-los e mantê-los com segurança em uma fintech regulada é um trabalho
   contínuo significativo, mesmo com provedores gerenciados (Auth0, Clerk, WorkOS) ou
   bibliotecas.
2. **Conectores são um produto, não uma funcionalidade.** Uma plataforma interna teria
   que construir e manter cada integração manualmente ou adotar uma camada de
   integração (Composio, Merge, Paragon), o que reintroduz uma conta de fornecedor e
   ainda deixa código de cola para manter.
3. **O desenvolvimento cidadão tira custo da equipe de engenharia.** Com a plataforma,
   usuários não técnicos criam e modificam seus próprios aplicativos dentro de limites
   definidos pelos administradores. Uma solução interna transforma cada nova
   ferramenta e cada mudança em um ticket de engenharia. Essa sobrecarga contínua é o
   maior custo oculto de construir.
4. **A previsão de demanda é a variável decisiva.** Se a demanda permanecer em
   aproximadamente esses três aplicativos, ou crescer para cerca de dez aplicativos
   CRUD semelhantes, uma solução interna simples mantida dentro do escopo da equipe
   atual é plausível. Se a demanda continuar crescendo, a plataforma precisa de donos
   dedicados, e um a três engenheiros a mais de US$ 200 mil por ano rapidamente
   ultrapassam o custo atual da licença, antes mesmo de contar o custo de
   oportunidade.
5. **Construir ainda significa comprar ou hospedar as peças.** Replicar as capacidades
   da plataforma envolve motores de workflow (Temporal, Inngest), plataformas de
   integração e autenticação gerenciada, cada um com sua própria conta. O caminho
   open-source (Temporal, Keycloak, n8n auto-hospedados) troca essas assinaturas por
   uma conta de nuvem maior mais as horas de engenharia para operar, corrigir e
   atualizar a infraestrutura. Construir nunca é uma opção com zero fornecedores e
   zero infraestrutura.

Uma avaliação completa também deve comparar plataformas alternativas (Retool, Appsmith,
Budibase, ToolJet) cujos preços podem se ajustar melhor à escala da equipe. Substituir
o fornecedor e construir internamente não são as únicas opções; migrar para um
fornecedor mais barato pode superar ambas.
