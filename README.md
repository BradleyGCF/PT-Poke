# PT-Poke

Una aplicación web de Pokédex construida con T3 Stak.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm
- Base de datos compatible con Prisma (PostgreSQL, MySQL, SQLite, etc.)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd PT-Poke
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido del archivo de variables de entorno que se proporcionará
   - Asegurarse de que todas las variables estén correctamente configuradas

4. **Configurar la base de datos**
   ```bash
   # Generar el cliente de Prisma
   npm run db:generate
   
   # Ejecutar las migraciones
   npm run db:migrate
   ```

## Ejecutar el Proyecto

### Modo Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
# Construir el proyecto
npm run build

# Iniciar el servidor
npm run start
```

## Scripts Adicionales

- `npm run db:studio` - Abrir Prisma Studio para visualizar la base de datos

## Notas

- Asegúrate de que tu base de datos esté ejecutándose antes de iniciar la aplicación
- Si encuentras problemas con la base de datos, puedes usar `npm run db:reset` para reiniciar las migraciones.
