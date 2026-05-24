# Base Viewer Unturned

Planejador 3D de bases pro jogo Unturned. Tudo roda no client (GPU do navegador). Salvar/carregar é via exportação/importação de JSON local — sem backend nem banco.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript estrito
- Tailwind v4
- three + @react-three/fiber + @react-three/drei
- Zustand (estado global)
- lucide-react (ícones)

## Funcionalidades

- 5 tipos base de peça: floor, triangle_floor (prisma triangular), wall, doorway, window
- Anexos: standard_door, double_door, garage_door, garage_frame
- Multi-andar (PageUp/PageDown navega entre andares com Y dinâmico)
- Snap em grid 4×4 + edge-snap (encaixe na borda de peças existentes, inclusive triângulos)
- Holograma verde de preview enquanto coloca
- Modo Selecionar (S): marquee 3D no chão pra seleção em lote
- Painel de seleção: muda cor, edita comentário, move, copia, cola e deleta em batch
- Undo (Ctrl+Z) com histórico de 50 ações cobrindo add/remove/move/paste
- Comentário flutuante em cada peça (visível sem clicar)
- Export/Import JSON com nome customizável

## Desenvolvimento

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

Scripts úteis:

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de dev (Next.js) |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build em produção |
| `npm run lint` | ESLint (config do Next 15) |
| `npm run typecheck` | `tsc --noEmit` |

## Estrutura

```
src/
├── app/                  Layout, page, globals.css
├── components/           Componentes React (3D + UI)
├── store/                Zustand (useBaseStore)
├── utils/                Export/import JSON
├── constants/            Dimensões, cores default, geometrias
└── types/                ItemType, BuildItem, HistoryAction, etc
```

## Atalhos

| Tecla | Ação |
|---|---|
| `S` | Toggla Modo Selecionar |
| `E` | (removido — antigo Modo Apagar) |
| `PageUp` / `PageDown` | Subir / Descer andar |
| `Ctrl+Z` | Desfazer |
| `Delete` / `Backspace` | Deletar peças selecionadas |
| `Esc` | Cancelar ferramenta / limpar seleção |
| `Shift+click` | Adicionar/remover peça da seleção |

## CI

GitHub Actions rodam em cada push e PR pra `main`:
- `npm run lint` (ESLint do Next)
- `npm run typecheck` (TypeScript strict)
- `npm run build` (Next build de produção)

Workflow em [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Deploy na Vercel

Free tier (Hobby) cobre essa app sem complicação:

1. Acessa [vercel.com/new](https://vercel.com/new) e faz login com GitHub.
2. Clica em **Import** ao lado do repo `base-viewer-unturned`.
3. Vercel detecta Next.js automaticamente — não precisa configurar nada.
4. Clica **Deploy**.

Cada push pra `main` dispara um deploy de produção. Cada PR ganha uma URL de preview automática.

Variáveis de ambiente: nenhuma (tudo client-side).
