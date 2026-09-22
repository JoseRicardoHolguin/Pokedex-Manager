# PokéDex Manager

Aplicación web full-stack para gestionar una colección personal de Pokémon. Permite registrarse/iniciar sesión, buscar Pokémon a través de la [PokéAPI](https://pokeapi.co/), ver sus estadísticas, y guardarlos en una colección propia.

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Funcionalidades](#funcionalidades)
- [Endpoints de la API](#endpoints-de-la-api)
- [Decisiones técnicas](#decisiones-técnicas)

## Stack tecnológico

**Frontend**
- React 18 + Vite
- React Router DOM (enrutamiento)
- Axios (cliente HTTP, con interceptor para el token JWT)
- CSS puro (sin frameworks de UI)

**Backend**
- Node.js + Express
- SQLite (`better-sqlite3`) como base de datos
- JWT (`jsonwebtoken`) para autenticación
- `bcrypt` para hash de contraseñas
- Axios para consumir la PokéAPI

## Estructura del proyecto

```
Pokedex Manager/
├── backend/
│   ├── server.js          # Punto de entrada del servidor
│   ├── db.js               # Conexión y esquema de SQLite
│   ├── routes/
│   │   ├── auth.js         # Endpoints de registro/login
│   │   └── pokemon.js      # Endpoints de búsqueda y colección
│   └── middleware/
│       └── auth.js         # Middleware que protege rutas privadas
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js            # Instancia de axios con interceptor de token
        ├── context/
        │   ├── AuthContext.jsx     # Provider de autenticación
        │   ├── AuthContextObject.js
        │   └── useAuth.js          # Hook para consumir el contexto
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx       # Vista principal (buscador + colección)
        └── components/
            ├── SearchBar.jsx
            ├── PokemonCard.jsx         # Tarjeta reutilizable (búsqueda y colección)
            └── PokemonDetailModal.jsx  # Modal con detalles/estadísticas
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

## Instalación y ejecución

Este proyecto tiene el backend y el frontend en carpetas separadas, cada uno con su propio `package.json`. Necesitas correr ambos **al mismo tiempo**, en dos terminales distintas.

### 1. Clonar el repositorio

```bash
git clone https://github.com/JoseRicardoHolguin/Pokedex-Manager.git
cd "Pokedex Manager"
```

### 2. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` dentro de `backend/` (ver [Variables de entorno](#variables-de-entorno)).

```bash
npm run dev
```

El servidor debería levantar en `http://localhost:4000`. La base de datos SQLite (`pokedex.sqlite`) se crea automáticamente la primera vez que corres el servidor.

### 3. Frontend

En una **segunda terminal**:

```bash
cd frontend
npm install
npm run dev
```

La aplicación debería levantar en `http://localhost:5173`.

### 4. Usar la aplicación

Abre `http://localhost:5173` en tu navegador, regístrate con un usuario nuevo, y ya puedes buscar y guardar Pokémon en tu colección.

## Variables de entorno

Crea `backend/.env` con lo siguiente:

```env
PORT=4000
JWT_SECRET=una_clave_larga_y_aleatoria_aqui
```

`JWT_SECRET` se usa para firmar los tokens de sesión. Puedes generar una clave aleatoria segura con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Este archivo está incluido en `.gitignore` y no se sube al repositorio.

## Funcionalidades

- **Autenticación**: registro e inicio de sesión con contraseñas hasheadas (`bcrypt`) y sesiones basadas en JWT (expiración de 7 días).
- **Búsqueda de Pokémon**: consulta en tiempo real a la PokéAPI por nombre o número, mostrando sprite, tipos y estadísticas base.
- **Colección personal**: cada usuario puede agregar, ver y eliminar Pokémon de su propia colección, almacenada en SQLite y asociada a su cuenta.
- **Vista de detalles**: al hacer clic en cualquier tarjeta (de búsqueda o de colección) se abre un modal con altura, peso, tipos y una gráfica de barras de sus estadísticas base.
- **Interfaz responsive**: las tarjetas se acomodan en grilla según el ancho de pantalla, y los colores de cada tarjeta cambian según el tipo del Pokémon (fuego = rojo, agua = azul, planta = verde, etc.), siguiendo la paleta oficial de tipos.

## Endpoints de la API

Todas las rutas bajo `/api/pokemon/collection` requieren el header `Authorization: Bearer <token>`.

| Método | Ruta                          | Descripción                                  | Protegida |
|--------|-------------------------------|-----------------------------------------------|-----------|
| POST   | `/api/auth/register`          | Crea una cuenta nueva                         | No        |
| POST   | `/api/auth/login`             | Inicia sesión                                 | No        |
| GET    | `/api/pokemon/search/:query`  | Busca un Pokémon por nombre o número          | No        |
| GET    | `/api/pokemon/collection`     | Devuelve la colección del usuario autenticado | Sí        |
| POST   | `/api/pokemon/collection`     | Agrega un Pokémon a la colección              | Sí        |
| DELETE | `/api/pokemon/collection/:id` | Elimina un Pokémon de la colección            | Sí        |

## Decisiones técnicas

- **SQLite sobre un motor de base de datos con servidor** (Postgres, MySQL): dado el alcance del proyecto, evita la necesidad de levantar y configurar un servicio adicional, sin sacrificar persistencia real.
- **JWT sobre sesiones basadas en cookies/servidor**: al ser una API separada del frontend (dos servidores distintos en desarrollo), JWT simplifica la autenticación entre orígenes sin necesitar configuración adicional de sesiones compartidas.
- **`react-router-dom` sobre manejo manual de vistas**: da una estructura de rutas más cercana a un proyecto de producción real (`/login`, `/register`, `/dashboard`), con rutas protegidas explícitas.
- **Componente `PokemonCard` reutilizable**: un mismo componente maneja tanto los resultados de búsqueda como los ítems ya guardados en la colección, evitando duplicar la lógica de presentación.