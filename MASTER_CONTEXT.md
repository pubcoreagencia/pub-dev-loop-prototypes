# MASTER_CONTEXT — Atelie Rogerio Paes

Este é o **contexto mestre** do projeto digital da **Atelie Rogerio Paes**. Ele define o que deve estar versionado no Git para garantir continuidade total do trabalho entre diferentes sessões, agentes e desenvolvedores.

## Identidade do projeto
- **Marca:** Atelie Rogerio Paes
- **Tagline (sugerida):** *Marcenaria artesanal com mais de 30 anos de tradição.*
- **Responsável:** Rogério Paes — marceneiro mestre, fundador.
- **Tempo de atuação:** mais de 30 anos no mercado de marcenaria.
- **Atuação:** móveis sob medida, projetos residenciais e corporativos, restauração, acabamento artesanal em madeira maciça e MDF.

## Repositório
- **Branch primária:** `main`
- **Branch de prototipação atual:** `prototype/atelie-rogerio-paes/<id-da-sessao>`
- **Estratégia de checkpoint:** executar `./devloop-checkpoint.sh` ao final de cada evolução significativa.
- **Estratégia de resume:** `./devloop-resume.sh` reconstrói o estado a partir de `.agent/CHECKPOINT.json`.
- **Propriedade:** Rogério Paes / Atelie Rogerio Paes.

## Posicionamento de marca
- **Artesanal vs. industrial:** valoriza o trabalho manual, a escolha da madeira, o acabamento peça a peça.
- **Autoridade:** os 30+ anos de carreira do mestre marceneiro são o principal ativo de credibilidade.
- **Atendimento:** direto com o Rogério — do orçamento à entrega.
- **Tom de voz:** sério, técnico quando preciso, acolhedor e próximo; sem promessas industrializadas.

## Princípios de comunicação
1. Mostrar o ofício: fotos de ateliê, ferramentas, mãos na madeira.
2. Valorizar a experiência: 30 anos não é só número, é portfólio.
3. Personalização: cada peça é única, sob medida para o cliente.
4. Transparência: do projeto ao orçamento, sem letras miúdas.

## Continuidade (Persistence-First)
O repositório é a fonte durável da verdade. Nenhuma conversa, sessão de IA, conta, estação de trabalho ou workspace local pode ser o único lugar onde o conhecimento crítico do projeto exista.

Todo agente / desenvolvedor que atuar neste repositório deve, quando houver acesso de escrita:

1. Ler o contexto atual antes de alterar.
2. Materializar a evolução no Git: código, testes, decisões, requisitos, status, bloqueios, handoff.
3. Validar (`./devloop-validate.sh`).
4. Atualizar a documentação de contexto e handoff.
5. Commitar a mudança (a infraestrutura do worker faz isso automaticamente — não use `git commit` direto).
6. Confirmar que o estado necessário para continuação está persistido.

Se a persistência for bloqueada por permissão ou conectividade, registrar o bloqueio explicitamente. Nunca declarar uma evolução como persistida quando ela não foi.

## Conteúdo personalizado
Os placeholders genéricos do template foram substituídos por conteúdo próprio da Atelie Rogerio Paes. Qualquer texto que ainda pareça genérico (lorem ipsum, "placeholder", "TODO") deve ser considerado mock e removido/substituído por conteúdo real.
