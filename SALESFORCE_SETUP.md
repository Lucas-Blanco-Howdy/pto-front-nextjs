# Configuración de Salesforce con jsforce

## Instalación de Dependencias

Primero, instala jsforce y sus tipos:

```bash
npm install jsforce @types/jsforce
```

## Configuración de Variables de Entorno

1. Copia el archivo `env.example` a `.env.local`:
```bash
cp env.example .env.local
```

2. Configura las siguientes variables en `.env.local`:

```env
# Configuración de Salesforce
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_USERNAME=tu_usuario@salesforce.com
SALESFORCE_PASSWORD=tu_contraseña
SALESFORCE_SECURITY_TOKEN=tu_security_token
SALESFORCE_CLIENT_ID=tu_client_id
SALESFORCE_CLIENT_SECRET=tu_client_secret
```

## Configuración en Salesforce

### 1. Obtener Security Token

1. Ve a tu perfil de usuario en Salesforce
2. Ve a "My Settings" > "Personal" > "Reset My Security Token"
3. Haz clic en "Reset Security Token"
4. Revisa tu email para obtener el token

### 2. Configurar Connected App (Opcional pero recomendado)

Para mayor seguridad, es recomendable usar OAuth en lugar de username/password:

1. Ve a Setup > Apps > App Manager
2. Crea una nueva "Connected App"
3. Configura:
   - Connected App Name: "Next.js Form Integration"
   - API Name: "NextJS_Form_Integration"
   - Contact Email: tu email
   - Enable OAuth Settings: ✓
   - Callback URL: `http://localhost:3000/api/auth/callback`
   - Selected OAuth Scopes: "Access and manage your data (api)"

### 3. Permisos de Usuario

Asegúrate de que el usuario tenga permisos para:
- Crear Leads
- Acceder a los campos: FirstName, LastName, Email, Phone, Company, Description

## Uso del Formulario

El formulario captura los siguientes datos:
- **Nombre**: Se mapea a `FirstName` en Salesforce
- **Apellido**: Se mapea a `LastName` en Salesforce
- **Email**: Se mapea a `Email` en Salesforce
- **Teléfono**: Se mapea a `Phone` en Salesforce
- **Empresa**: Se mapea a `Company` en Salesforce
- **Mensaje**: Se mapea a `Description` en Salesforce

Todos los leads creados tendrán `LeadSource = "Website Form"`.

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── salesforce/
│   │       └── route.ts          # API endpoint para Salesforce
│   ├── page.tsx                  # Página principal con el formulario
│   └── layout.tsx
├── components/
│   └── SalesforceForm.tsx        # Componente del formulario
└── ...
```

## Desarrollo

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno (ver sección anterior)

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Visita `http://localhost:3000` para ver el formulario

## Producción

Para producción, asegúrate de:
1. Configurar las variables de entorno en tu plataforma de deployment
2. Usar OAuth en lugar de username/password para mayor seguridad
3. Configurar el callback URL correcto en tu Connected App

## Troubleshooting

### Error de autenticación
- Verifica que el username, password y security token sean correctos
- Asegúrate de que el usuario tenga permisos para crear Leads

### Error de permisos
- Verifica que el usuario tenga acceso a los campos del Lead
- Revisa los permisos del perfil de usuario

### Error de CORS
- Este error no debería ocurrir ya que jsforce se ejecuta en el servidor
- Si ocurre, verifica que estés usando la API route correctamente
