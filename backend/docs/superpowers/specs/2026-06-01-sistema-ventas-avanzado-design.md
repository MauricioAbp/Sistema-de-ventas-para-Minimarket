# Sistema de ventas avanzado para minimarket

## Objetivo

Completar un sistema de ventas para minimarket con backend en Spring Boot, frontend en Angular y base de datos MySQL. El sistema prioriza el flujo operativo de venta, caja e inventario, y agrega funciones administrativas para productos, proveedores, compras, recepcion de mercaderia, reportes y boletas formales imprimibles.

## Alcance aprobado

El alcance inicial es avanzado, pero se implementara de forma ordenada comenzando por el nucleo operativo:

1. Login con roles.
2. Punto de venta rapido para cajero.
3. Apertura y cierre de caja.
4. Registro de venta con detalle.
5. Descuento automatico de stock.
6. Movimiento de inventario por cada venta.
7. Boleta formal imprimible/PDF.
8. Administracion de productos, categorias, proveedores, compras y recepcion de mercaderia.
9. Reportes basicos para administracion.

La integracion electronica con SUNAT queda fuera del alcance actual. El sistema solo generara una representacion formal de boleta para impresion o PDF.

## Roles y permisos

### ADMIN

El administrador gestiona usuarios, productos, categorias, stock, proveedores, compras, recepcion de mercaderia, reportes y configuracion de empresa. Tambien puede consultar ventas, cajas y movimientos de inventario.

### CAJERO

El cajero inicia sesion, abre caja, consulta productos, registra ventas, genera boletas y cierra caja. No administra proveedores, compras, usuarios ni configuraciones generales.

## Flujo POS rapido

1. El cajero inicia sesion.
2. El sistema valida usuario, clave y rol.
3. El cajero abre caja con monto inicial.
4. El cajero busca productos por codigo o nombre.
5. El cajero agrega productos al carrito.
6. Angular calcula y muestra subtotal, IGV, total, monto recibido y vuelto.
7. El cajero confirma la venta.
8. Spring Boot valida stock, caja abierta, cantidades y totales.
9. Spring Boot registra venta y detalles.
10. Spring Boot descuenta stock y registra movimientos de inventario.
11. Spring Boot genera la boleta formal.
12. Angular muestra la boleta para imprimir o descargar como PDF.

## Backend Spring Boot

El backend se implementara en Java con Spring Boot porque permite separar la aplicacion en controladores REST, servicios de negocio, repositorios JPA y entidades. Esta estructura facilita validaciones, transacciones y mantenimiento.

Componentes principales:

- Controladores REST para exponer endpoints en JSON.
- Servicios para reglas de negocio como venta, stock, caja, compras y boletas.
- Repositorios JPA para acceso a MySQL.
- Entidades JPA para mapear tablas SQL.
- DTOs para evitar exponer directamente entidades sensibles, especialmente usuario y ventas.
- Validaciones para cantidades, stock, caja abierta, roles y datos obligatorios.

## Frontend Angular

El frontend se implementara en Angular con TypeScript porque Angular trabaja de forma nativa con componentes, servicios HTTP, rutas protegidas, guards por rol y formularios reactivos.

Pantallas principales:

- Login.
- Dashboard segun rol.
- POS rapido.
- Apertura y cierre de caja.
- Productos y categorias.
- Proveedores.
- Ordenes de compra.
- Recepcion de mercaderia.
- Inventario y movimientos.
- Boletas.
- Reportes basicos.

La interfaz priorizara escritorio y laptop. Se agregara soporte responsive basico para tablet, especialmente en POS, listas y formularios.

## CSS

CSS se usara para disenar una interfaz clara, rapida y consistente. El objetivo no es una pagina de marketing, sino una herramienta operativa para cajeros y administradores. El POS debe permitir lectura rapida, botones visibles, totales claros y tablas faciles de revisar.

## JSON

JSON sera el formato de intercambio entre Angular y Spring Boot mediante APIs REST. Se usara para solicitudes de login, consultas, registro de ventas, detalles, productos, caja, compras y boletas.

## Base de datos MySQL

MySQL sera la base SQL principal. El modelo incluira, como minimo:

- `rol`
- `usuario`
- `empresa`
- `categoria`
- `producto`
- `proveedor`
- `proveedor_producto`
- `caja`
- `venta`
- `detalle_venta`
- `boleta`
- `movimiento_inventario`
- `orden_compra`
- `detalle_orden_compra`
- `recepcion_mercaderia`
- `detalle_recepcion`
- `anulacion_venta`

Las tablas de venta, detalle, caja e inventario deben trabajar dentro de transacciones para mantener consistencia.

## Boleta formal imprimible

La boleta sera una representacion formal para impresion o PDF. Debe incluir:

- Datos de empresa: RUC, razon social, nombre comercial y direccion.
- Serie y numero correlativo.
- Fecha y hora de emision.
- Datos del cajero.
- Datos del cliente cuando correspondan.
- Detalle de productos: cantidad, descripcion, precio unitario y subtotal.
- Subtotal, IGV y total.
- Medio de pago, monto recibido y vuelto.
- Estado de la boleta.

La emision electronica, envio a SUNAT, resumen diario y validaciones de servicios externos quedan fuera de esta fase.

## Seguridad

El login debe evitar devolver datos sensibles. El backend no debe responder con `password_hash` ni entidades completas de usuario. Las claves deben almacenarse con hash seguro, preferentemente BCrypt.

Las rutas de Angular deben protegerse con guards por rol. Los endpoints de Spring Boot deben validar permisos en backend, no solo en frontend.

## Manejo de errores

El backend debe responder errores claros para:

- Credenciales incorrectas.
- Usuario inactivo.
- Rol no autorizado.
- Caja no abierta.
- Stock insuficiente.
- Cantidad invalida.
- Producto no encontrado.
- Venta no registrable por datos incompletos.

Angular debe mostrar estos errores de forma visible sin perder el carrito cuando sea posible.

## Pruebas

Se deben cubrir pruebas prioritarias:

- Login con usuario valido, invalido e inactivo.
- Registro de venta con stock suficiente.
- Rechazo de venta con stock insuficiente.
- Descuento correcto de stock.
- Generacion de detalle de venta.
- Generacion de boleta.
- Apertura y cierre de caja.
- Acceso por roles en frontend y backend.

## Criterios de aceptacion

El primer hito se considera completo cuando:

- Un administrador puede iniciar sesion y gestionar productos base.
- Un cajero puede iniciar sesion y abrir caja.
- El cajero puede registrar una venta desde el POS rapido.
- La venta descuenta stock correctamente.
- La venta genera detalle, movimiento de inventario y boleta formal imprimible.
- El cajero puede cerrar caja.
- Las rutas principales respetan roles `ADMIN` y `CAJERO`.

