---
name: module-adder
description: Scaffolds a new DDD and CQRS-based module for the backend. Make sure to use this skill whenever the user asks to add a new entity, build a new feature, create a new API endpoint, or scaffold boilerplate components like Domains, Queries, Commands, Repositories, DTOs, Mappers, or Routers.
---

# Module Adder

A skill for scaffolding a new module in this DDD and CQRS-based project.

This project strictly follows Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns, using Hono for the HTTP layer and TSyringe for Dependency Injection.

When asked to create a new module (e.g., `user`, `order`), you MUST generate the appropriate directory structure and boilerplate files inside `src/modules/<module-name>/`. You can use the `src/modules/book` folder as a reference.

## Directory Structure

A complete module consists of the following structure:

```
src/modules/<module-name>/
├── domain/
│   ├── entity/
│   │   └── <module-name>.entity.ts
│   └── value-object/
│       └── <value-object-name>.value-object.ts
│   ├── <module-name>.error.ts
│   └── <module-name>.type.ts
├── repository/
│   ├── <module-name>.repository.port.ts
│   └── <module-name>.repository.ts
├── command/
│   └── create-<module-name>/
│       ├── create-<module-name>.command.ts
│       ├── create-<module-name>.command-handler.ts
│       ├── create-<module-name>.http-handler.ts
│       └── create-<module-name>.request.dto.ts
├── query/
│   └── get-<module-name>/
│       ├── get-<module-name>.query.ts
│       ├── get-<module-name>.query-handler.ts
│       ├── get-<module-name>.http-handler.ts
│       └── get-<module-name>.request.dto.ts
├── dto/
│   └── <module-name>.response.dto.ts
├── <module-name>.mapper.ts
├── <module-name>.router.ts
├── <module-name>.module.ts
├── <module-name>.token.ts
└── index.ts
```

## Step-by-Step Implementation Guide

Follow these rules when generating files for a new module.

### 1. Token & Module Registration
- **`<module-name>.token.ts`**: Define the injection token for the repository.
- **`<module-name>.module.ts`**: Create a module class. Register dependencies via TSyringe's `container.register`. Register all Commands and Queries under their respective arrays.

### 2. Domain
- **`domain/entity/<module-name>.entity.ts`**: Create a domain entity extending `Entity<Props>` or `AggregateRoot<Props>` from `@/lib/ddd`.
- **`domain/value-object/`**: Create value objects extending `ValueObject<Props>` from `@/lib/ddd` in this folder when needed.
- **`domain/<module-name>.type.ts`**: Store module-specific TypeScript types and interfaces here.
- **`domain/<module-name>.error.ts`**: Store module-specific custom error classes or exceptions here.
- Define properties and domain logic (invariants). Return `Result` types using `oxide.ts` for operations that can fail.

### 3. Repository
- **`repository/<module-name>.repository.port.ts`**: Define the repository interface.
- **`repository/<module-name>.repository.ts`**: Implement the port interface. Annotate with `@injectable()`.

### 4. DTOs and Mapper
- **`dto/<module-name>.response.dto.ts`**: Define Zod schemas and TypeScript types for the response.
- **`<module-name>.mapper.ts`**: Implement the `Mapper` interface. Transform domain entities to response DTOs. Annotate with `@singleton()`.

### 5. CQRS: Commands and Queries
For each use case, create an isolated folder (e.g., `command/create-<module-name>/`).
**Strict Co-location Requirement:** You MUST place exactly these 4 files in the folder:
1. **`.command.ts` / `.query.ts`**: Inherit from `Command<ResultType>` or `Query`.
2. **`.command-handler.ts` / `.query-handler.ts`**: Implement `ICommandHandler` / `IQueryHandler`. Annotate with `@injectable()`. Inject the repository port using `@inject(<MODULE_NAME>_REPOSITORY_TOKEN)`.
3. **`.http-handler.ts`**: Define HTTP route using `appFactory.createHandlers`. Use `inputValidator` for request validation. Use `useDependency` to resolve `commandBus` or `queryBus`.
4. **`.request.dto.ts`**: Define Zod schema and TypeScript type for the request body/params/query.

### 6. Router and Entrypoint
- **`<module-name>.router.ts`**: Aggregate HTTP handlers into a Hono router (`new Hono()`).
- **`index.ts`**: Export the module class and router.



## Constraints & Rules
- **No Direct DB Access**: Handlers must go through repositories.
- **Inversion of Control**: Do NOT instantiate classes manually; always use `@injectable()` and TSyringe.
- **Error Handling**: Use `oxide.ts` `Result<T, E>`. Throw HTTP Exceptions ONLY in the `http-handler.ts`.
- **Validation**: All input must be validated with Zod in the `.request.dto.ts` and used via `inputValidator`.
