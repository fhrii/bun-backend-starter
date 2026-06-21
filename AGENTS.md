# AGENTS.md

This file provides operational guidance, development workflows, and architectural rules for AI coding agents working on the **Bun Backend Starter** project.

## 🚀 Setup & Development Commands

Use the following commands to manage and develop the project:

- **Install dependencies:** `bun install`
- **Start development server:** `bun run dev` (starts the server with hot reload, loading `.env.local` and `.env.development`)
- **Start production server:** `bun run start` (runs the compiled app using `.env.production`)
- **Lint and auto-fix code:** `bun run lint`
- **Lint check only:** `bun run lint:check`
- **Clean build artifacts:** `bun run clean` (deletes `./dist` directory)

---

## 🏗️ Architecture & Conventions

This project is structured as a **CQRS (Command Query Responsibility Segregation)** and **DDD (Domain-Driven Design)** backend boilerplate, powered by **Hono** and **TSyringe** (Inversion of Control).

### 1. Inversion of Control (IoC) with TSyringe
- Use class-based decorators for DI: `@injectable()` for dependencies and `@singleton()` for singletons.
- Injection tokens should be declared in `<module>.token.ts` file (e.g., `BOOK_REPOSITORY_TOKEN`).
- Inject repository implementations in handlers/services using `@inject(TOKEN)`.
- Register dependencies using Hono context dependency injection via `useDependency('Name', Token)` middleware.

### 2. CQRS Pattern & Feature Structure
- **Commands:** Used for state-mutating operations. Inherit from `Command<ResultType>` (from `@/lib/cqrs`). The `ResultType` MUST be an `oxide.ts` `Result` (e.g., `Result<Entity, Exception>`). Pass input via `constructor(public readonly payload: DtoType)`.
- **Command Handlers:** Implement `ICommandHandler<CommandType>` and annotate with `@injectable()`. Inside `execute()`, instantiate Domain Entities, enforce invariants, and call the injected Repository port.
- **Queries:** Used for read-only operations. Inherit from `Query` (from `@/lib/cqrs`).
- **Query Handlers:** Implement `IQueryHandler<QueryType>` and annotate with `@injectable()`.
- **Registration:** Register all Commands and Queries inside their respective `Module` classes under the `commands` and `queries` arrays.
- **Strict Folder Co-location:** Each Command and Query MUST have its own isolated folder (e.g., `command/create-book/`). This isolated folder MUST co-locate 4 specific files:
  1. `[name].command.ts` / `[name].query.ts`
  2. `[name].command-handler.ts` / `[name].query-handler.ts`
  3. `[name].http-handler.ts` (where the Hono `appFactory.createHandlers` is defined)
  4. `[name].request.dto.ts` (where the Zod input schema is defined)

### 3. HTTP Layer (Hono)
- Use `appFactory.createHandlers(...)` (from `@/lib/http`) to declare HTTP route handlers.
- Use `inputValidator('json' | 'query' | 'param', Schema)` middleware for input validation with Zod schemas.
- Use `useDependency('Name', Token)` middleware to inject Command/Query buses or Mappers into the Hono context.
- Execute commands/queries in route handlers via the command/query bus: `await commandBus.execute(new MyCommand(payload))`.

### 4. Error Handling
- Use the `oxide.ts` functional error handling pattern (`Result<T, E>`, `Ok`, `Err`, `match`).
- Prefer returning `Result` types from domain entities, commands, and repositories instead of throwing exceptions.
- Throw HTTP/Client exceptions (from `@/lib/exceptions`) in route handlers or when a catastrophic error occurs.

### 5. Domain-Driven Design (DDD)
- **Entities:** Inherit from `Entity<Props>` or `AggregateRoot<Props>` (from `@/lib/ddd`).
- **Value Objects:** Inherit from `ValueObject<Props>` (from `@/lib/ddd`).
- **Mappers:** Implement `Mapper` interface to transform database models to domain entities and domain entities to responses/DTOs.
- **Repository Ports:** Define repository interfaces in a `repository` subfolder, and implement them using dependency injection.

---

## 💅 Code Style & Formatting

- **TypeScript:** Strict mode enabled.
- **Formatting:** Prettier is used. Rules include single quotes, no semicolons, and trailing commas.
- **Linting:** Configured with `eslint-config-sheriff` (flat ESLint config).
- **Import Path Aliases:** Always use `@/*` to reference files inside the `src` directory (e.g., `import { Config } from '@/lib/config'`), except when resolving sibling files in the same feature module.

---

## 🚫 Boundaries & Constraints

- **Never bypass validation:** All HTTP request bodies, queries, and params must be validated with Zod schemas.
- **No manual instantiation:** Do not manually instantiate repositories or buses. Always resolve them from TSyringe's `container` or Hono context via `useDependency`.
- **Environment variables:** Do not add secrets to `.env.development` or `.env.local`. Document any new environment variables in `.env.example`.
- **Package Manager:** Always use `bun` as the package manager and execution runtime. Do not install packages using `npm` or `pnpm` to avoid lockfile mismatches.
- **No direct db access in controllers:** All database access must go through repository classes matching the defined interface port.
