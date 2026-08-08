# Recomendação

**Renegocie ou substitua o contrato primeiro. Construa apenas se isso falhar, ou quando
a demanda por ferramentas internas superar três aplicativos.**

## 1. Situação

A equipe de engenharia paga US$ 250 mil/ano por uma plataforma que roda três aplicativos
CRUD. No preço de tabela, 60 usuários custam cerca de US$ 14,4 mil/ano. O protótipo
prova que o núcleo de capacidades é replicável em horas. O custo real de construir é a
propriedade: SSO, banco de dados, manutenção de conectores, compliance e a perda do
desenvolvimento cidadão.

## 2. As Opções

| Opção | Custo anual | Esforço de engenharia | Risco | Customização |
|---|---|---|---|---|
| Renegociar o contrato | Bom: o preço de tabela é ~US$ 14,4 mil; mesmo 3x isso fica muito abaixo do valor atual | Bom: nenhum | Bom: nada muda operacionalmente | Ruim: as restrições permanecem |
| Migrar para um fornecedor mais barato (Retool, Appsmith, Budibase) | Bom: faixa de US$ 20-40 mil/ano para este porte | Razoável: semanas de migração para três aplicativos pequenos | Razoável: novo lock-in, melhores condições de saída | Razoável: mais flexível, ainda uma plataforma |
| Construir internamente | Razoável: assinaturas de ferramentas agora; US$ 200 mil+ por engenheiro dedicado se a demanda crescer | Ruim: semanas de robustecimento, depois manutenção permanente | Razoável: segurança e compliance passam a ser problema da equipe | Bom: controle total |

## 3. Raciocínio

- Teste de commodity: ferramentas internas CRUD não diferenciam o negócio. Capacidade
  commodity tende a compra.
- TCO honesto: estimativas de construção de ferramentas internas estouram de 2,5 a 3x.
  Compare o custo de três anos de construção com o preço corrigido da licença, não com
  o contrato atual. Construir só vence contra o número inflado.
- Não existe construção pura: auth, banco de dados e camadas de integração ainda seriam
  comprados. A escolha real é qual conjunto de fornecedores possuir.
- O desenvolvimento cidadão se perde: hoje operações e compliance entregam suas
  próprias mudanças; internamente, cada mudança vira um ticket de engenharia.
- Onde o Devin entra: o protótipo levou duas horas, e o trabalho seguinte tem o mesmo
  formato de tarefa bem delimitada. Construir fica mais barato, mas os custos de
  propriedade permanecem.

## 4. O Que Mudaria a Decisão

- A auditoria falha: o gasto não consegue se aproximar do preço de tabela.
- A demanda cresce: um roadmap de dez ou mais ferramentas internas justifica a
  propriedade dedicada.
- A customização vira restrição: limites de delegação ou tetos de UX bloqueiam os
  fluxos de trabalho.
- Compliance exige controle dos dados que o fornecedor não consegue oferecer.

## 5. Próximos Passos

1. Auditoria de licenças e uso: uma semana, financeiro mais um engenheiro.
2. Cotações de duas plataformas concorrentes, na mesma semana.
3. Ponto de decisão: total renegociado abaixo de cerca de US$ 50 mil/ano significa
   comprar, e a questão se encerra por um ano.
4. Caso contrário, um piloto de construção de quatro semanas com Devin: robustecer o
   aplicativo de KYC de ponta a ponta, incluindo SSO e persistência, e remedir a linha
   de custo antes de se comprometer com os outros dois.
