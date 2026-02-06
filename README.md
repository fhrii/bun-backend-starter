# Bun Backend Starter

A modern, opinionated backend starter template built with **Bun**, **TypeScript**, **ESLint**, and **Prettier**.

## ✨ Features

- ⚡ **Bun** - Fast all-in-one JavaScript runtime
- 📘 **TypeScript** - Strict type checking with path aliases (`@/*`)
- 🔍 **ESLint** - Code quality with [eslint-config-sheriff](https://www.eslint-config-sheriff.dev/)
- 💅 **Prettier** - Consistent code formatting
- 🛠️ **VS Code** - Pre-configured settings and extensions

## 📁 Project Structure

```
├── @types/              # Global type declarations
├── src/
│   ├── lib/             # Shared utilities and helpers
│   ├── modules/         # Feature modules
│   └── main.ts          # Application entry point
├── .env.example         # Environment variables template
├── eslint.config.ts     # ESLint flat config
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.8 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/fhrii/bun-backend-starter
cd bun-backend-starter

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
cp .env.example .env.development
```

### Development

```bash
# Start development server with hot reload
bun run dev
```

### Production

```bash
# Start production server
bun run start
```

## 📜 Available Scripts

| Script               | Description                      |
| -------------------- | -------------------------------- |
| `bun run dev`        | Start dev server with hot reload |
| `bun run start`      | Start production server          |
| `bun run lint`       | Lint and auto-fix code           |
| `bun run lint:check` | Lint without auto-fix            |
| `bun run clean`      | Remove dist folder               |

## ⚙️ Configuration

### TypeScript Path Aliases

Use `@/*` to import from the `src` directory:

```typescript
import { myUtil } from '@/lib/my-util';
```

### Environment Variables

Create environment files based on `.env.example`:

- `.env.local` - Local development overrides
- `.env.development` - Development environment
- `.env.production` - Production environment

## 📝 License

MIT
