# ⚛️ Plantilla React + Vite + TypeScript

Plantilla base configurada con **React**, **Vite**, **TypeScript (modo estricto)**, **Tailwind CSS v4**, rutas absolutas (`@/`), **ESLint**, **Prettier**, **ls-lint** y **Husky**.

## 📋 Requisitos previos

> [!IMPORTANT]
> El uso de **`pnpm` es obligatorio** en este proyecto. Instalar dependencias con `npm` o `yarn` está bloqueado automáticamente mediante el script `preinstall`.

- **Node.js**: `>=22.23.1`
- **pnpm**: `>=11.9.0` (versión fijada: `pnpm@11.9.0`)

## 📦 Primeros pasos

Instala las dependencias del proyecto con `pnpm`. Esto también inicializará automáticamente los hooks de Git con **Husky** (gracias al script `prepare` en `package.json`):

```bash
pnpm install
```

_(Si en algún momento necesitas inicializar los hooks manualmente, ejecuta `pnpm run prepare`.)_

## 🚀 Servidor de desarrollo

Para iniciar el servidor local de desarrollo con Hot Module Replacement (HMR), ejecuta:

```bash
pnpm run dev
```

_(Por defecto estará disponible en `http://localhost:5173`.)_

## 🧹 Scripts de calidad de código y linting

Este proyecto aplica reglas estrictas de calidad, formato, tipado y arquitectura. Utiliza los siguientes scripts para auditar el código:

- **Lint de código (ESLint & Prettier):** analiza errores, reglas de arquitectura y formato en TypeScript/React.
- **Lint de estructura de archivos (`ls-lint`):** valida las convenciones de nombres de archivos y carpetas.
- **Verificación de tipos (TypeScript):** ejecuta el compilador (`tsc -b`) para detectar errores de tipado.
- **Lint de archivos en stage (`lint-staged`):** audita únicamente los archivos listos para commit (también se ejecuta automáticamente en el hook `pre-commit`).

```bash
pnpm run lint
pnpm run lint:fs
pnpm run typecheck
pnpm run lint-staged
```

## 🐶 Git Hooks (Husky)

Este proyecto utiliza **Husky** para ejecutar validaciones automáticas antes de cada commit. El hook `pre-commit` verifica:

1. La estructura y nomenclatura de archivos (`pnpm run ls-lint`).
2. Las reglas de arquitectura, dependencias y estilo sobre los archivos en stage (`pnpm run lint-staged`).

Esto garantiza que no ingrese código sin formatear o con errores al repositorio.
