---
name: create-new-feat
description: Crea una nueva funcionalidad (feature) completa dentro de src/features/<feature> siguiendo la arquitectura estándar del proyecto (domain, infrastructure, di y ui con TanStack Query, CustomError, mappers con type guards y reglas estrictas de ESLint/ls-lint). Usar cuando el usuario pida crear un nuevo módulo, CRUD o feature.
---

# Crear un Nuevo Feature (`src/features/<feature>`)

Esta guía define el flujo obligatorio paso a paso para implementar un nuevo feature completo en este proyecto, tomando como referencia canónica `src/features/demo/`.

Antes de escribir código, respeta siempre todas las reglas de `.agents/AGENTS.md`, `eslint.config.js` y `.ls-lint.yml`.

---

## Estructura objetivo

```text
src/features/<feature>/
├── domain/
│   ├── dtos/
│   │   ├── create-<entity>.dto.ts
│   │   └── update-<entity>.dto.ts
│   ├── entities/
│   │   └── <entity>.entity.ts
│   ├── enums/
│   │   └── <name>.enum.ts
│   ├── repositories/
│   │   └── <entity>.repository.ts          # Clase abstracta (contrato de persistencia)
│   └── services/
│       └── <entity>.services.ts            # Clase abstracta (contrato de casos de uso/CRUD)
├── infrastructure/
│   ├── mappers/
│   │   └── <entity>.mapper.ts              # Contrato + implementación (sin casteos manuales)
│   ├── repositories/
│   │   └── <entity>-<source>.repository.ts # Implementación concreta (async/await)
│   └── services/
│       └── <entity>-<use>.services.ts      # Implementación concreta (DI + SRP + CustomError)
├── di/
│   └── <entity>.dependency.ts              # Instanciación y exportación solo de actions (.bind)
└── ui/
    ├── components/
    │   └── <component-name>.tsx            # Subcomponentes reutilizables del feature
    ├── hooks/
    │   ├── actions/                        # Hooks de TanStack Query (1 por action del servicio)
    │   │   ├── use-get-<entities>.hook.ts
    │   │   ├── use-create-<entity>.hook.ts
    │   │   ├── use-update-<entity>.hook.ts
    │   │   └── use-delete-<entity>.hook.ts
    │   └── logic/                          # Hooks con la lógica de estado/handlers de páginas y componentes
    │       └── use-<feature>-page.hook.ts
    └── pages/
        └── <feature>.page.tsx              # Vista declarativa que consume hooks/logic/use-<feature>-page.hook.ts
```

> **Cuidado con `.ls-lint.yml`:**
>
> - En `services/` el sufijo obligatorio es **plural**: `*.services.ts`.
> - En `hooks/` solo deben existir archivos `*.hook.ts`.
> - En `pages/` el sufijo obligatorio es `*.page.tsx`.
> - Nunca crear archivos `index.ts` (barrel files prohibidos).
> - Todos los imports internos usan rutas absolutas `@/...`.

---

## Flujo paso a paso

### Paso 1: Capa `domain/` (modelos y contratos)

1. **Entidad (`domain/entities/<entity>.entity.ts`):** define la interfaz principal del dominio en `PascalCase`.
2. **Enums (`domain/enums/<name>.enum.ts`, si aplica):** prohibido `enum` nativo de TypeScript. Usa un POJO con `as const`, nombre exportado en `UPPER_CASE`, claves en `UPPER_SNAKE_CASE` y tipo derivado:
    ```ts
    export const COUNTER_OPERATION = {
        INCREMENT: "increment",
        DECREMENT: "decrement",
        RESET: "reset",
    } as const;

    export type CounterOperation = (typeof COUNTER_OPERATION)[keyof typeof COUNTER_OPERATION];
    ```
3. **DTOs (`domain/dtos/*.dto.ts`):** contratos de entrada tipados para cada operación (`Create*Dto`, `Update*Dto`, etc.).
4. **Repositorio abstracto (`domain/repositories/<entity>.repository.ts`):** `abstract class` con métodos `public abstract` asíncronos (`Promise<...>`) que definan cómo se leen y persisten los datos crudos.
5. **Servicio abstracto (`domain/services/<entity>.services.ts`):** `abstract class` con los métodos `public abstract` del CRUD/operaciones de negocio que devolverán entidades del dominio (`Promise<Entity>` / `Promise<Entity[]>` / `Promise<void>`).

---

### Paso 2: Capa `infrastructure/` (implementaciones concretas)

1. **Mapper (`infrastructure/mappers/<entity>.mapper.ts`):**
    - Define el contrato abstracto (`abstract class <Entity>Mapper`) y su implementación concreta.
    - Convierte datos crudos (`unknown`) desde almacenamiento/API hacia entidades del dominio y viceversa.
    - **Prohibido usar casteos manuales o forzosos (`as Tipo`, `as unknown as Tipo`).** Valida la estructura con type guards en runtime (`typeof`, `Array.isArray`, `Number.isNaN`, etc.).
    - Si los datos crudos son inválidos o corruptos, lanza `CustomError` (`@/core/domain/errors/custom.error`).

2. **Repositorio concreto (`infrastructure/repositories/<entity>-<source>.repository.ts`):**
    - Extiende la clase abstracta del repositorio.
    - Todos los métodos `async` deben usar `await` (si la fuente es síncrona como `localStorage`, envolver con `await Promise.resolve(...)`).
    - Captura cualquier error de I/O y relanza usando `CustomError` (nunca `new Error(...)`).
    - Si requiere una librería externa (ej. cliente HTTP, `uuid`, etc.), encapsularla en una clase dedicada en `core/` o `shared/`.

3. **Servicio concreto (`infrastructure/services/<entity>-<use>.services.ts`):**
    - Extiende la clase abstracta del servicio.
    - Recibe el repositorio y el mapper por constructor (inyección de dependencias, cero acople directo a implementaciones concretas).
    - **Aplica SRP estrictamente:** cada método público es un orquestador limpio; toda validación de negocio o transformación se extrae a métodos `private` en `camelCase` (`validateLabel`, `findOrThrow`, `persistItems`, etc.).
    - Declara modificadores de acceso explícitos (`public`/`private`), tipos de retorno explícitos y constantes nombradas en `UPPER_SNAKE_CASE` (sin magic numbers fuera de `-1`, `0`, `1`).
    - Lanza únicamente `CustomError` (`badRequest`, `notFound`, `conflict`, `internalServer`, etc.).

---

### Paso 3: Capa `di/` (inyección de dependencias)

Crea `di/<entity>.dependency.ts`:

- Instancia el repositorio, el mapper y el servicio concreto (tipados contra sus clases abstractas).
- **Exporta únicamente las acciones enlazadas con `.bind(service)`** en `PascalCase`, nunca la instancia completa ni detalles de infraestructura:

```ts
const repository: CounterRepository = new CounterLocalStorageRepository();
const mapper: CounterMapper = new CounterLocalStorageMapper();
const service: CounterService = new CounterCrudService(repository, mapper);

export const GetCountersService = service.getCounters.bind(service);
export const CreateCounterService = service.createCounter.bind(service);
export const UpdateCounterService = service.updateCounter.bind(service);
export const DeleteCounterService = service.deleteCounter.bind(service);
```

---

### Paso 4: Capa `ui/` (custom hooks, componentes y página)

1. **Custom Hooks de acciones (`ui/hooks/actions/use-*.hook.ts`):**
    - Encapsula **una acción del servicio por hook** usando `@tanstack/react-query` (`useQuery` o `useMutation`).
    - Retorna siempre las interfaces estandarizadas `QueryResult<TData, CustomError>` o `MutationResult<TData, CustomError, TVariables>` de `@/core/presentation/interfaces/tan-stack.interface`.
    - Define la `queryKey` como constante (`as const`) en el hook de consulta y úsala en `queryClient.invalidateQueries({ queryKey })` dentro de `onSuccess` en cada mutación.
    - No realices casteos manuales sobre los resultados; si hay desajuste de tipos, corrige el contrato del servicio o del mapper.

2. **Custom Hooks de lógica de vista (`ui/hooks/logic/use-*.hook.ts`):**
    - Mueve toda la lógica de estado local (`useState`), estados derivados (`isBusy`, `activeError`), orquestación de los hooks de `hooks/actions/` y handlers de eventos (`handle*`) a un custom hook dedicado para cada página o componente complejo.
    - Así los archivos `.tsx` de `pages/` y `components/` quedan puramente declarativos y fáciles de leer.

3. **Componentes (`ui/components/*.tsx`):**
    - Extrae subcomponentes (ej. tarjetas de ítem, formularios) para mantener la página limpia y evitar funciones flecha inline en props de eventos JSX (`react/jsx-handler-names` con `checkInlineFunction: true`).
    - Marca como `readonly` todas las propiedades de las interfaces de props en archivos `.tsx` cuando no se reasignen (ej. `readonly counter: CounterEntity;`).
    - Nombra las props de callback con prefijo `on*` y las funciones manejadoras con prefijo `handle*`.
    - Maqueta con Tailwind CSS (`flex`/`grid`), sin `!important`, sin saltos de layout en estados interactivos y con etiquetas accesibles (`<label>`, `aria-label`, `alt`).

4. **Página (`ui/pages/<feature>.page.tsx`):**
    - Consume **únicamente el custom hook de la vista** (`use-<feature>-page.hook.ts`) y nunca importa repositorios, mappers ni implementaciones de `infrastructure/`.
    - Maneja estados de carga (`isLoading`), vacío, mutación (`isCreating`/`isBusy`) y error (`activeError` de `CustomError`) sin usar ternarios anidados.

---

### Paso 5: Registro en el Router

Registra la nueva página en `src/core/presentation/routers/router.tsx` dentro del layout correspondiente (`<Route path="/<ruta>" element={<FeaturePage />} />`).

---

### Paso 6: Verificación obligatoria

Ejecuta y asegura **0 errores y 0 advertencias** antes de entregar:

```bash
pnpm run ls-lint
pnpm run lint
pnpm run typecheck
pnpm run build
```

---

## Referencia en el repositorio

Consulta `src/features/demo/` para ver un ejemplo funcional completo (CRUD de contadores en `localStorage`) que implementa cada paso de esta skill.
