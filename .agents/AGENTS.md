# Guía de Código Limpio y Estándares para Agentes

Este documento define las reglas obligatorias que todo agente y desarrollador debe seguir al escribir, modificar o crear archivos en este proyecto. Todas las indicaciones están alineadas con [eslint.config.js](../eslint.config.js), [.ls-lint.yml](../.ls-lint.yml), [prettier.config.mjs](../prettier.config.mjs), [tsconfig.app.json](../tsconfig.app.json) y los criterios de calidad de [.docs/quality-criteria.md](../.docs/quality-criteria.md).

---

## 1. Entorno, Stack y Dependencias

- **Gestor de paquetes obligatorio:** `pnpm` (`>=11.9.0`). Está prohibido usar `npm` o `yarn` (`preinstall` los bloquea).
- **Node.js:** `>=22.23.1`.
- **Versiones exactas (B32):** en `package.json` no se permiten prefijos `^`, `~` ni `*`. `.npmrc` aplica `save-exact=true` y `engine-strict=true`.
- **Sin dependencias muertas (B33):** no instalar ni conservar librerías que no se utilicen.
- **Stack principal:** React 19 (`<StrictMode>`), Vite 8, TypeScript 6 (`strict: true`), Tailwind CSS v4, React Router DOM y TanStack React Query.

---

## 2. Arquitectura y Fronteras de Dependencias

Estructura base dentro de `src/`:

```text
src/
├── core/
│   ├── domain/         # Lógica de dominio transversal (errores, datos base, contratos)
│   └── presentation/   # Layouts, routers, configuración de providers/UI base
├── features/
│   └── <feature>/
│       ├── di/             # Instanciación e inyección de dependencias (expone solo actions enlazadas)
│       ├── domain/         # Entidades, DTOs, enums, mappers y contratos abstractos (repositories/services)
│       ├── infrastructure/ # Implementaciones concretas de repositories y services
│       └── ui/             # Custom hooks (TanStack Query), componentes y páginas
├── shared/             # Componentes, hooks, páginas y utilidades compartidas
├── index.css
└── main.tsx
```

### Reglas de dependencias e imports

1. **Rutas absolutas obligatorias:** está prohibido usar rutas relativas (`./`, `../`). Todo import interno debe comenzar con `@/`.
2. **Flujo unidireccional:**
    - `src/core/domain/**` **no** puede importar desde `presentation`/`ui` ni desde `@/features/**`.
    - `src/core/presentation/**` **no** puede importar desde `@/features/**`.
    - `src/shared/**` **no** puede importar desde `@/features/**`.
3. **Sin barrel files (B39):** no crear archivos `index.ts` / `index.tsx` para re-exportar módulos. Solo existe el punto de entrada de la aplicación (`src/main.tsx`).
4. **Orden obligatorio de imports (`simple-import-sort/imports`):**
    1. Librerías externas (`react` primero, luego paquetes `@scope/*` y externos)
    2. `@/core/domain/`
    3. `@/core/presentation/`
    4. `@/core/`
    5. `@/shared/`
    6. `@/features/`
    7. Resto de `@/`
    8. Archivos de estilos (`*.css`)

---

## 3. Nomenclatura de Archivos y Carpetas (`.ls-lint.yml`)

- Todas las carpetas y archivos dentro de `src/**` usan **`kebab-case`** en inglés (B24), sin transliteración (B25), y el nombre del archivo debe reflejar exactamente su contenido (B38).
- Respeta estrictamente los sufijos obligatorios por carpeta:

| Carpeta                  | Extensión             | Patrón obligatorio | Ejemplo válido                 |
| :----------------------- | :-------------------- | :----------------- | :----------------------------- |
| `src/**/dtos/**`         | `.ts`                 | `*.dto.ts`         | `create-user.dto.ts`           |
| `src/**/models/**`       | `.ts`                 | `*.model.ts`       | `user.model.ts`                |
| `src/**/interfaces/**`   | `.ts`                 | `*.interface.ts`   | `tan-stack.interface.ts`       |
| `src/**/repositories/**` | `.ts`                 | `*.repository.ts`  | `user.repository.ts`           |
| `src/**/services/**`     | `.ts`                 | `*.services.ts`    | `auth.services.ts`             |
| `src/**/errors/**`       | `.ts`                 | `*.error.ts`       | `http.error.ts`                |
| `src/**/mappers/**`      | `.ts`                 | `*.mapper.ts`      | `user.mapper.ts`               |
| `src/**/pages/**`        | `.tsx`                | `*.page.tsx`       | `default.page.tsx`             |
| `src/**/hooks/**`        | `.ts`                 | `*.hook.ts`        | `use-auth.hook.ts`             |
| `src/**/context/**`      | `.ts` / `.tsx`        | `*.context.ts(x)`  | `theme.context.tsx`            |
| `src/**/stores/**`       | `.ts`                 | `*.store.ts`       | `session.store.ts`             |
| `src/**/reducers/**`     | `.ts`                 | `*.reducer.ts`     | `cart.reducer.ts`              |
| `src/**/config/**`       | `.ts`                 | `*.config.ts`      | `query-client.config.ts`       |
| Resto de `src/**`        | `.dir`, `.ts`, `.tsx` | `kebab-case`       | `app.layout.tsx`, `footer.tsx` |

---

## 4. Reglas Estrictas de TypeScript y ESLint

- **Prohibido deshabilitar ESLint (B26):** nunca usar comentarios como `// eslint-disable`, `// eslint-disable-next-line`, `/* eslint-disable */` ni `// eslint-ignore`. Están bloqueados por `noInlineConfig: true` y `no-warning-comments`. Si una regla falla, corrige el código.
- **Prohibido `any` (A14):** usa tipos concretos, genéricos o `unknown` con type guards.
- **Prohibido doble casteo `as unknown as <Tipo>`:** rompe el tipado estricto y está bloqueado como error en `no-restricted-syntax`. Usa validación en runtime o type guards.
- **Prohibido `enum` nativo de TypeScript (B23, B29):** agrupa constantes relacionadas en objetos planos (`POJO`) con `as const` en archivos `*.enum.ts` con el identificador exportado en `UPPER_CASE`, las claves en `UPPER_SNAKE_CASE` y el tipo derivado mediante `(typeof ...)[keyof typeof ...]`:

```ts
export const TRANSACTION_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
```

- **Tipo de retorno explícito:** todas las funciones en archivos `.ts` deben declarar su tipo de retorno (`@typescript-eslint/explicit-function-return-type`).
- **Accesibilidad explícita en clases (B30):** todas las propiedades, constructores y métodos deben declarar `public`, `private` o `protected`.
- **Sin números mágicos (B22, B31):** fuera de `-1`, `0` y `1`, extrae todo valor numérico a constantes nombradas en `UPPER_SNAKE_CASE`.
- **Llaves obligatorias (B27):** usa `{ ... }` siempre en `if`, `else`, `for`, `while` y `switch` (incluyendo bloques en `case`), incluso para una sola línea. Única excepción: arrow functions de una línea sin bloque.
- **Variables sin usar:** no dejes imports, variables o parámetros sin usar (prefijo `_` únicamente cuando un parámetro es requerido por firma pero intencionalmente no se usa).
- **Sin código muerto ni comentado (B34):** elimina bloques comentados, archivos huérfanos y funciones no usadas.
- **No exportar variables mutables (B37):** evita `export let ...`; exporta referencias constantes (`const`).

---

## 5. Convenciones de Nombrado en Código

- **Idioma:** todos los identificadores (variables, funciones, tipos, archivos) en **inglés**, sin abreviaturas arbitrarias (solo abreviaturas estándar como `err`, `evt`, `src`, `i`) (B16, B25).
- **Variables, parámetros, propiedades y métodos:** `camelCase` con sustantivos descriptivos (B15).
    - No incluyas el tipo de dato en el nombre: `filters` en lugar de `filtersArray` (B17).
    - No repitas el nombre del objeto o módulo: `wizard.name` en lugar de `wizard.wizardName` (A5).
    - Arrays siempre en **plural**: `users`, `items` (B18).
- **Booleanos (B19):** siempre en afirmativo y con prefijo obligatorio `is`, `should`, `has`, `can`, `did` o `will` (ej. `isLoading`, `hasError`, nunca `isNotRemoved`).
- **Funciones y métodos (B20):** comienzan con un verbo (`getUsers`, `formatCurrency`, `createQueryClient`).
- **Constantes globales (B22):** `UPPER_SNAKE_CASE` (`MAX_RETRIES`, `DEFAULT_TIMEOUT_MS`). Nunca redefinir constantes ni enums (B35).
- **Clases, interfaces y types (B21, A4):** `PascalCase`. Los nombres de interfaces y clases abstractas deben ser genéricos y no revelar detalles de implementación.
- **Eventos en React (A9, A10):**
    - Props de callback: prefijo **`on`** (`onClick`, `onSubmit`).
    - Funciones manejadoras en el componente: prefijo **`handle`** (`handleClick`, `handleSubmit`).
- **Uniformidad (A3, A7, A8):** mantén un solo criterio en todo el proyecto para convenciones, sufijos y APIs equivalentes.

---

## 6. Código Limpio, Sintaxis Moderna y Legibilidad

- **Estructura recomendada dentro de cada archivo (B28):**
    1. Imports
    2. Tipos / constantes conocidas antes de la ejecución
    3. Variables de módulo
    4. Funciones / componentes
    5. Lógica principal (si aplica)
    6. Exports
- **Sintaxis moderna obligatoria (A1, A15, A17):**
    - Usa optional chaining (`?.`) y nullish coalescing (`??`).
    - Usa `for...of` o iteradores de array (`map`, `filter`, `some`, `every`, `forEach`) en lugar de `for (let i = 0; ...)` cuando no se necesite el índice.
    - Prefiere métodos no mutables (`toReversed()`, `toSorted()`).
    - No uses `.map()` si no vas a utilizar el array retornado; usa `.forEach()` o `for...of` (B36).
- **Simplicidad y baja complejidad:**
    - Extrae lógica repetida a módulos reutilizables en `shared/` o `core/` (A11).
    - Divide funciones o componentes largos en unidades pequeñas con responsabilidad única (A16).
    - Usa operador ternario para asignaciones simples, **nunca ternarios anidados** (A12).
    - Simplifica retornos booleanos: `return a === b;` en lugar de `if (a === b) { return true; } else { return false; }` (A13).
    - Evita operaciones implícitas o inseguras (usa `Math.trunc` en lugar de `~~`, conversiones explícitas con `Number(...)`, etc.) (B36).

---

## 7. Principio de Responsabilidad Única (SRP) y Descomposición de Métodos

> [!IMPORTANT]
> **PROHIBIDAS LAS FUNCIONES Y MÉTODOS "MONOLÍTICOS":**
> Toda función o método debe tener una única responsabilidad bien delimitada. En lugar de que un método o función haga un montón de cosas a la vez, se debe descomponer obligatoriamente en métodos o funciones más pequeños y cohesivos con responsabilidad única.

### 7.1. Regla de Descomposición y Métodos Auxiliares

1. **Método Principal como Orquestador:** El método público principal (ej. `createUser`, `saveProgress`, etc.) debe actuar como un orquestador limpio y secuencial de alto nivel, delegando cada sub-tarea, validación o transformación a métodos auxiliares privados.
2. **Validaciones en Métodos Independientes:** Si una operación requiere verificar una o más condiciones de negocio o integridad (ej. si un usuario ya existe, si el correo está duplicado, si hay saldo suficiente o si se alcanzó un límite), cada validación debe aislarse en su propio método privado en `camelCase` (ej. `private validateUserExists(dto)`, `private validateEmail(dto)`, `private validateBalance(dto)`).
3. **Escalabilidad y Extensibilidad:** En caso de que se requiera validar otra necesidad en el futuro, nunca se debe saturar el método principal ni añadir bloques de lógica dentro de métodos existentes; simplemente se crea un nuevo método privado para validar dicha necesidad específica y se invoca en el orquestador.

### 7.2. Encapsulación de Dependencias Externas

- **Prohibido acoplar librerías externas directamente en el código:** cuando se utilice una dependencia externa (ej. `uuid`, librerías de alertas/mensajes, fechas, clientes HTTP, etc.), **no** debe importarse ni invocarse directamente desde features, servicios o componentes.
- **Wrapper obligatorio en clase (instanciable o con métodos estáticos):** toda librería externa debe encapsularse en una clase dedicada dentro de `core/` o `shared/` para desacoplar el código del proveedor y facilitar cambios o pruebas futuras.

```ts
import { v4 as generateUniversallyUniqueIdentifier } from "uuid";

import type { Uuid } from "@/shared/types/uuid.type";

export class UuidGenerator {
    public static generateUuid(): Uuid {
        const sessionUniqueIdentifier = generateUniversallyUniqueIdentifier();

        return sessionUniqueIdentifier as Uuid;
    }
}
```

### 7.3. Manejo de Errores con `CustomError`

- **Prohibido lanzar `new Error(...)` directamente:** nunca lances instancias nativas de la clase `Error`. Todo error controlado en la aplicación debe lanzarse mediante los métodos estáticos de `CustomError` (`@/core/domain/errors/custom.error`) respetando el formato `FormattedErrorResponse`.

```ts
// Incorrecto
throw new Error("El usuario no existe");

// Correcto
throw CustomError.notFound({ message: "El usuario no existe" });
```

---

## 8. React, Accesibilidad, Seguridad y Estilos (Tailwind CSS)

- **React & Hooks:**
    - Cumple estrictamente `react-hooks/rules-of-hooks` y `react-hooks/exhaustive-deps`.
    - Cumple `@tanstack/query/exhaustive-deps` y `@tanstack/query/stable-query-client`.
    - Marca como **`readonly`** todas las propiedades en las interfaces de props de componentes `.tsx` cuando no se reasignen (ej. `readonly counter: CounterEntity;`).
    - Limpia siempre listeners, timers y suscripciones en el cleanup de `useEffect` (B40).
    - Maneja errores de carga y estado para que la aplicación no se rompa en ejecución (B1).
- **Seguridad (B43):** nunca renderices HTML sin sanitizar proveniente del usuario (evita `dangerouslySetInnerHTML`).
- **Markup y Accesibilidad (B3–B7, A2):**
    - Usa el mínimo de nodos HTML necesarios; evita `<div>` decorativos innecesarios.
    - Todo `<img>` de contenido debe incluir `alt` descriptivo (o `alt=""` si es puramente decorativo).
    - Todo `<svg>` inline debe definir tamaño explícito (`width`/`height` o clases `size-*`). Prefiere SVG para iconos y gráficos vectoriales.
    - Todo elemento interactivo (`<button>`, `<a>`, `<input>`) debe tener texto visible, `<label>`, `aria-label` o texto `sr-only`.
- **Estilos con Tailwind CSS (B8–B12, B14):**
    - Maqueta siempre con `flex` y/o `grid`.
    - Prohibido `!important` (excepto overrides inevitables de librerías externas).
    - Evita estilos globales sobre etiquetas HTML y no superes 2 niveles de anidamiento si escribes CSS personalizado.
    - Los estados interactivos (`hover`, `focus`, `active`) no deben provocar saltos de layout.
    - Declara fuentes alternativas seguras si defines tipografías personalizadas.

---

## 9. Formato y Verificación Obligatoria

### Formato (`prettier.config.mjs`)

- Indentación de **4 espacios** (sin tabs).
- Comillas **dobles** (`"`), punto y coma (`;`), `trailingComma: "all"`, `arrowParens: "always"`, ancho máximo de línea **130**.

### Checklist antes de entregar cambios

Todo agente debe ejecutar y verificar con **0 errores** antes de finalizar una tarea:

```bash
pnpm run ls-lint
pnpm run lint
pnpm run typecheck
```

Si modificas configuración de build, dependencias o rutas, valida también:

```bash
pnpm run build
```
