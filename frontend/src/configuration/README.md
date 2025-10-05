# Integración de Plux Paybox

Esta carpeta contiene la configuración y componentes necesarios para integrar Plux Paybox en la aplicación.

## Archivos

### `ppx.data.js` / `ppx.data.ts`
Contiene la configuración base de datos para Plux Paybox. Incluye:
- Credenciales del comercio
- Configuración de pagos
- Callback `onAuthorize` para manejar respuestas

### `ppx.index.js`
Contiene las funciones principales:
- `iniciarDatos(dataPago)`: Inicializa Plux Paybox con los datos
- `reload(data)`: Recarga Plux Paybox con nuevos datos

### `ppx.config.ts`
Configuración para diferentes entornos:
- Sandbox (desarrollo)
- Producción
- URLs de scripts
- Tarjetas de prueba

## Uso

### 1. Importar el componente
```tsx
import PpxButton from "@/components/payment/PpxButton";
import { data as pluxData } from "@/configuration/ppx.data";
```

### 2. Usar en el componente
```tsx
<PpxButton
  data={paymentData}
  amount={donationAmount}
  description="Donación para proyecto"
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

## Configuración

### Sandbox (Desarrollo)
- Email: `correoplux@gmail.com`
- Comercio ID: `921`
- Client ID: `uj8Yic1a8MbQTdZ0W1yXk524QP`
- Ambiente: `sandbox`

### Producción
Actualizar las credenciales en `ppx.config.ts`:
```typescript
export const productionConfig: PluxConfig = {
  environment: 'production',
  commerceEmail: 'tu-email@tudominio.com',
  commerceId: 'TU_COMERCIO_ID',
  clientId: 'TU_CLIENT_ID',
  production: true
};
```

## Tarjetas de Prueba

### VISA
- Número: `4540639936908783`
- CVV: `123`

### MASTERCARD
- Número: `5230428590692129`
- CVV: `123`

### DINERS
- Número: `36417200103608`
- CVV: `123`
- OTP: `123456`

## Scripts Requeridos

Los siguientes scripts deben estar cargados en el HTML:

```html
<!-- jQuery (si no está ya cargado) -->
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>

<!-- Plux Paybox Sandbox -->
<script src="https://sandbox-paybox.pagoplux.com/paybox/index_angular.js"></script>

<!-- Plux Paybox Producción -->
<script src="https://paybox.pagoplux.com/paybox/index_angular.js"></script>
```

## Respuesta del Pago

Cuando el pago es exitoso, se ejecuta el callback `onAuthorize` con la siguiente información:

```javascript
{
  status: "succeeded",
  amount: "10.00",
  id_transaccion: "123456789",
  cardIssuer: "Visa",
  cardType: "Crédito",
  clientName: "Juan Pérez",
  fecha: "2024-01-15",
  token: "voucher_del_pago",
  tipoPago: "Tarjeta de Crédito"
}
```

## Troubleshooting

### El botón no aparece
1. Verificar que los scripts de Plux estén cargados
2. Revisar la consola para errores de JavaScript
3. Asegurar que `window.Data` esté disponible

### Error de inicialización
1. Verificar que las credenciales sean correctas
2. Comprobar que el email del comercio esté registrado en Plux
3. Revisar la configuración de `PayboxEnvironment`

### Pago no se procesa
1. Usar las tarjetas de prueba correctas
2. Verificar que esté en modo sandbox
3. Revisar los logs de la consola
