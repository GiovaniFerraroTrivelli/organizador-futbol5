# Organizador de partidos de Fútbol 5

Esta es una aplicación creada con el objetivo de organizar los partidos de fútbol 5 de manera eficiente.

## Servidor de desarrollo

1. `npm install` para instalar las dependencias.
2. `ng serve` para correr el servidor de desarrollo. Este se abrirá en `http://localhost:4200/`.

### Configuración
1. Crear el archivo `src/environments/environment.ts` con el siguiente contenido:

```ts
export const environment = {
  production: false, /* O true si es producción */
  firebase: {
    apiKey: 'API_KEY_DE_FIREBASE',
    authDomain: 'AUTH_DOMAIN_DE_FIREBASE',
    databaseURL: 'URL_DE_DATABASE_DE_FIREBASE',
    projectId: 'ID_DE_PROYECTO_DE_FIREBASE',
    storageBucket: 'STORAGE_DE_FIREBASE',
    messagingSenderId: 'MESSAGING_SENDER_ID',
    appId: 'APP_ID',
    measurementId: 'MEASUREMENT_ID'
  },
  mapsApiKey: 'API_KEY_DE_MAPS'
};
```

Eso se puede encontrar acá: https://developers.google.com/codelabs/building-a-web-app-with-angular-and-firebase#9

## Build

Escribir `ng build` para buildear el proyecto. Los archivos se almacenarán en la carpeta `/dist`.
