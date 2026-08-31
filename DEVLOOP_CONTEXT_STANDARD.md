# DEVLOOP_CONTEXT_STANDARD — Atelie Rogerio Paes

Este repositório segue o **contrato padrão de continuidade** do PUB DEV LOOP, instanciado para o projeto da **Atelie Rogerio Paes**.

### Arquivos obrigatórios
- `README_FOR_AGENTS.md`
- `MASTER_CONTEXT.md`
- `DEVLOOP_CONTEXT_STANDARD.md` (este arquivo)
- `PROJECT_HANDOFF.md`
- `PROJECT_STATE.md`
- `.agent/CURRENT_STATE.md`
- `.agent/TASKS.md`
- `.agent/HANDOFF.md`
- `devloop-validate.sh`
- `devloop-checkpoint.sh`
- `devloop-resume.sh`

### Convenções dos scripts
Todos os scripts `devloop:*` devem:
1. Detectar o gerenciador de pacotes (npm, pnpm, yarn) pelos lockfiles.
2. Se o script correspondente existir no `package.json` (ex.: `npm run devloop:validate`), invocá-lo.
3. Se nenhum gerenciador for detectado ou o script não existir, retornar `NOT_APPLICABLE`.

Cada script deve sair com código 0 em sucesso, não-zero em falha.

### Observação específica do projeto
Como este repositório é a **base de continuidade da Atelie Rogerio Paes** (e não necessariamente um app compilável), `devloop-validate` é esperado retornar `NOT_APPLICABLE` para build/test/typecheck enquanto não houver um `package.json` com essas definições. Isso é o comportamento correto do template e **não** indica falha.
