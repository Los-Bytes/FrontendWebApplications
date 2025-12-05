# Guía de Despliegue en Render

Tu proyecto ya está configurado para desplegarse como un **Web Service** en Render. Sigue estos pasos:

## 1. Subir cambios a GitHub
Primero, asegúrate de guardar y subir los cambios que acabo de hacer (`package.json` y `server.js`).

```bash
git add .
git commit -m "Configuración para Render: server.js y package.json"
git push origin main
```

## 2. Crear Web Service en Render
1. Ve a [dashboard.render.com](https://dashboard.render.com/).
2. Haz clic en **New +** y selecciona **Web Service**.
3. Conecta tu repositorio de GitHub.

## 3. Configuración del Servicio
Usa los siguientes valores en el formulario de configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `mi-frontend-app` (o el nombre que quieras) |
| **Region** | (La más cercana a tus usuarios, ej: Ohio/Frankfurt) |
| **Branch** | `main` (o tu rama de desarrollo) |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

## 4. Variables de Entorno (Environment Variables)
No necesitas configurar el PUERTO (`PORT`), Render lo hace automático.
Si tu aplicación usa variables secretas, añádelas aquí.

## 5. ¡Desplegar!
Haz clic en **Create Web Service**. Render instalará las dependencias, construirá el frontend (Vite) y arrancará tu servidor Node.

---

### ¿Cómo funciona ahora?
He modificado `server.js` para que haga dos cosas a la vez:
1. **Servir la API**: Tus rutas de `json-server` están disponibles en `/api/v1/...`.
2. **Servir el Frontend**: Cualquier otra ruta cargará tu aplicación Vue (`index.html`), permitiendo que el routing funcione correctamente.

¡Listo! Tu app estará online en unos minutos.
