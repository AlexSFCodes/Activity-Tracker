# TaskTracker AI

Aplicación de escritorio para organizar tareas, dividirlas en pasos y registrar el tiempo de trabajo mediante sesiones Pomodoro. Permite consultar el progreso y los hábitos de estudio o trabajo, con los datos almacenados localmente en SQLite.

## Funcionalidades

- **Tareas:** crear tareas con título, descripción y pasos; consultar sus detalles y eliminarlas.
- **Seguimiento de pasos:** marcar o desmarcar pasos y calcular el avance de cada tarea.
- **Pomodoro:** trabajar con periodos de concentración de 25 minutos, descansos cortos de 5 minutos y descansos largos de 15 minutos.
- **Sesiones por tarea:** asociar sesiones a una tarea, indicar un objetivo y registrar el tiempo dedicado.
- **Estadísticas:** consultar tiempo de concentración, tareas completadas, actividad diaria, rachas y distribución del tiempo por tarea.
- **Persistencia local:** conservar tareas, pasos y sesiones entre ejecuciones.

### Estado de la integración con IA

La interfaz incluye el botón **«Ayúdame con IA»**, pero todavía no tiene una acción implementada. Aunque `openai` y `dotenv` están declarados como dependencias, el código actual no realiza solicitudes a un modelo de IA. No se necesita una clave de API ni un archivo `.env` para ejecutar las funciones actuales.

## Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| Electron | Ventana de escritorio, ciclo de vida de la aplicación y comunicación entre procesos. |
| React | Interfaz organizada en páginas, componentes y hooks. |
| TypeScript | Tipado del código de la interfaz y de Electron. |
| Vite | Servidor de desarrollo y herramientas para la interfaz. |
| SQLite + `better-sqlite3` | Base de datos local y consultas desde el proceso principal. |
| CSS | Estilos de páginas, componentes y distribución visual. |
| `concurrently` y `wait-on` | Ejecución coordinada de Vite, TypeScript y Electron durante el desarrollo. |
| `@electron/rebuild` | Reconstrucción de módulos nativos para Electron cuando sea necesario. |

Las versiones y la lista completa de dependencias están en [`package.json`](./package.json); `package-lock.json` registra las versiones resueltas.

## Requisitos

- **Node.js 22.12.0 o superior**, compatible con las herramientas instaladas.
- **npm**, incluido con Node.js.
- **Git**, si vas a clonar el repositorio.
- Un entorno con escritorio para abrir la ventana de Electron.

Puedes comprobar las herramientas con:

```bash
node --version
npm --version
```

## Instalación y ejecución

### 1. Abre la carpeta del proyecto

Si ya tienes el repositorio descargado, abre una terminal en su carpeta. Por ejemplo, en PowerShell:

```powershell
cd "C:\ProyectosCODIGO\TaskTracker AI"
```

Si todavía no lo tienes, clona el repositorio con su URL y entra en la carpeta descargada.

### 2. Instala las dependencias

```bash
npm ci
```

Este comando utiliza el archivo `package-lock.json` para instalar las versiones registradas. Si modificas las dependencias de `package.json`, utiliza `npm install` para actualizar también ese archivo de bloqueo.

### 3. Inicia la aplicación

```bash
npm run dev
```

Este comando inicia tres procesos:

1. Vite sirve la interfaz en `http://localhost:5173`.
2. TypeScript compila los archivos de `electron/` hacia `dist/` y observa sus cambios.
3. Electron espera a que estén disponibles el servidor y `dist/main.js`, y abre la ventana de la aplicación.

Utiliza la **ventana de Electron** para trabajar con las tareas y la base de datos. Abrir la dirección de Vite en un navegador permite ver la interfaz, pero las operaciones que dependen de `window.api` requieren Electron.

Para detener los procesos, presiona `Ctrl+C` en la terminal. Vite actualiza la interfaz durante el desarrollo; si modificas el proceso principal o el preload, reinicia `npm run dev` para cargar esos cambios en Electron.

## Uso básico

1. En **Nueva tarea**, escribe un título, añade una descripción y agrega los pasos que necesites.
2. Guarda la tarea y consúltala en **Tareas**.
3. En **Pomodoro**, selecciona una tarea e indica el objetivo de la sesión para comenzar a trabajar.
4. Marca los pasos completados a medida que avances.
5. Revisa **Progreso** para consultar las estadísticas de tus tareas y sesiones.

## Comandos disponibles

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el entorno completo de desarrollo. |
| `npm run dev:vite` | Inicia únicamente el servidor de la interfaz. |
| `npm run dev:electron:build` | Compila Electron en modo observación. |
| `npm run dev:electron:start` | Espera al servidor y al archivo compilado antes de abrir Electron. |
| `npx tsc -p tsconfig.json --noEmit` | Comprueba los tipos del código de Electron sin generar archivos. |
| `npx tsc -p tsconfig.app.json` | Comprueba los tipos de la interfaz sin generar archivos. |

Los tres comandos `dev:*` también pueden ejecutarse en terminales separadas.

## Estructura del proyecto

```text
TaskTracker AI/
├── electron/
│   ├── main.ts             # Ventana principal y manejadores IPC
│   ├── preload.cts         # Expone window.api a la interfaz
│   └── db.ts               # Conexión y creación de tablas SQLite
├── src/
│   ├── Components/         # Barra lateral y ventanas modales
│   ├── layouts/            # Distribución del panel principal
│   ├── pages/
│   │   ├── NuevaTarea/     # Formulario de creación de tareas y pasos
│   │   ├── Tareas/         # Listado de tareas
│   │   ├── Pomodoro/       # Temporizador y seguimiento de sesiones
│   │   └── Progreso/       # Estadísticas y cálculos de actividad
│   ├── types/              # Tipos de datos y de la API de Electron
│   ├── App.tsx            # Navegación entre páginas
│   └── main.tsx           # Entrada de React
├── dist/                   # Código de Electron generado por TypeScript
├── index.html              # Entrada HTML de la interfaz
├── vite.config.ts          # Configuración de Vite y puerto de desarrollo
├── tsconfig.json           # Configuración TypeScript de Electron
├── tsconfig.app.json       # Configuración TypeScript de React
└── package.json            # Dependencias y comandos
```

## Arquitectura y datos

La interfaz de React llama a los métodos de `window.api`, expuestos por `electron/preload.cts` mediante `contextBridge`. Estos métodos utilizan `ipcRenderer.invoke` para comunicarse con los manejadores de `ipcMain` en `electron/main.ts`, donde se ejecutan las consultas SQLite.

La ventana utiliza `contextIsolation: true` y `nodeIntegration: false`. El acceso a la base de datos se mantiene en el proceso principal.

El archivo **`tasktracker.db`** se crea automáticamente en el directorio que devuelve `app.getPath("userData")`. En Windows, normalmente se encuentra dentro de `%APPDATA%`, en la carpeta correspondiente a la aplicación. No se guarda dentro del repositorio y no requiere instalar un servidor de base de datos.

| Tabla | Contenido |
| --- | --- |
| `tarea` | Título, descripción, fecha y campo de progreso. |
| `paso` | Pasos asociados a una tarea, su orden y estado de completado. |
| `pomodoro` | Sesiones asociadas a tareas, tiempo en minutos, fecha y objetivo o logro. |
| `config` | Estructura prevista para duración de estudio, descanso y tema. |

Las claves foráneas están habilitadas: eliminar una tarea elimina también sus pasos y sesiones. La tabla `config` existe, pero actualmente no hay una pantalla ni manejadores IPC para modificarla; las duraciones del temporizador se definen en `src/pages/Pomodoro/pomodoro.constants.ts`.

## Solución de problemas

### Error al cargar `better-sqlite3`

Si aparece un error de módulo nativo o de incompatibilidad con `NODE_MODULE_VERSION`, detén la aplicación y reconstruye la dependencia para Electron:

```bash
npx electron-rebuild -f -w better-sqlite3
npm run dev
```

Si la reconstrucción necesita compilar desde el código fuente, puede requerir Python y herramientas de compilación de C++, como Visual Studio Build Tools en Windows.

### El puerto 5173 está ocupado

Vite tiene `strictPort: true`, y Electron espera exactamente `http://localhost:5173`. Detén el proceso que esté usando ese puerto y vuelve a iniciar la aplicación. Si cambias el puerto, actualiza también `electron/main.ts` y el comando `dev:electron:start` de `package.json`.

### `window.api` no está disponible

Ejecuta `npm run dev` y utiliza la ventana de Electron. Si ocurre dentro de esa ventana, revisa la salida de TypeScript y confirma que se haya generado `dist/preload.cjs`.

## Estado del empaquetado

El repositorio está preparado para ejecutarse en desarrollo. Aunque incluye `electron-builder` como dependencia y una ruta de carga para una aplicación empaquetada, todavía no define scripts `build` o `dist` ni una configuración completa para generar instaladores.

Antes de distribuirlo, será necesario configurar la compilación de la interfaz hacia `dist-renderer/`, la compilación de Electron y el empaquetado de los archivos y módulos nativos.

## Licencia

El campo `license` de `package.json` declara **ISC**. Actualmente el repositorio no incluye un archivo `LICENSE` con el texto de la licencia.
