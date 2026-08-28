# PUB Prototype Persistent Repository

Este repositório armazena o histórico persistente das sessões do PUB Prototype.

## Estrutura de Branches

Cada sessão do PUB Prototype possui uma branch dedicada:

\`\`\`
prototype/<sessionId>
\`\`\`

Exemplo:
- \`prototype/bdfcf112-f632-4adf-9424-8c67d748f44b\`
- \`prototype/0b1cdb49-3349-4381-9245-409cb68d4855\`

## Acesso

Este repositório é **privado** e utilizado exclusivamente pelo PUB Prototype Worker.

Commits são feitos automaticamente pelo worker após cada task concluída, usando GitHub App authentication.

## Não editar manualmente

Este repositório é gerenciado pelo sistema. Edições manuais podem quebrar o preview recovery.
