# Hito 1 POS Rapido Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working milestone for the minimarket system: login with `ADMIN`/`CAJERO`, cashier box opening/closing, fast POS sale, stock discount, inventory movement, and printable formal receipt.

**Architecture:** Keep the current Spring Boot layered structure, but introduce DTOs so controllers stop exposing JPA entities directly. Business rules live in services, persistence remains in repositories, and Angular consumes JSON REST endpoints through typed services and guarded routes.

**Tech Stack:** Java 17, Spring Boot, Spring Data JPA, MySQL, JUnit/Mockito, Angular, TypeScript, CSS, JSON.

---

## Scope Check

The approved design includes purchases, suppliers, reception, reports, and broader administration. This plan implements only Hito 1: authentication, roles, caja, POS sale, stock movement, and printable boleta. Purchases, reception, advanced reports, and future SUNAT electronic integration should be handled in later plans.

## File Structure

Backend files to create:

- `src/main/java/edu/upn/proyecto/gruposowad/dtos/auth/LoginRequest.java`: login input.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/auth/LoginResponse.java`: safe login output without password hash.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/common/ApiError.java`: standard error response.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/caja/AbrirCajaRequest.java`: open cashbox input.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/caja/CerrarCajaRequest.java`: close cashbox input.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaRequest.java`: POS sale input.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaDetalleRequest.java`: POS line item input.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaResponse.java`: sale result.
- `src/main/java/edu/upn/proyecto/gruposowad/dtos/boleta/BoletaResponse.java`: printable receipt data.
- `src/main/java/edu/upn/proyecto/gruposowad/exceptions/BusinessException.java`: business-rule failure.
- `src/main/java/edu/upn/proyecto/gruposowad/exceptions/GlobalExceptionHandler.java`: maps exceptions to JSON.
- `src/main/java/edu/upn/proyecto/gruposowad/config/CorsConfig.java`: allows Angular development origin.

Backend files to modify:

- `pom.xml`: add validation, password hashing, and PDF dependency.
- `src/main/resources/application.properties`: move password to environment variable and add predictable local settings.
- `src/main/java/edu/upn/proyecto/gruposowad/models/Usuario.java`: hide password hash from JSON and keep role relation.
- `src/main/java/edu/upn/proyecto/gruposowad/models/Caja.java`: ensure open/closed state fields are usable.
- `src/main/java/edu/upn/proyecto/gruposowad/models/Boleta.java`: add formal receipt fields if missing.
- `src/main/java/edu/upn/proyecto/gruposowad/repositories/CajaRepository.java`: add query for open box by user.
- `src/main/java/edu/upn/proyecto/gruposowad/repositories/ProductoRepository.java`: add product search.
- `src/main/java/edu/upn/proyecto/gruposowad/repositories/BoletaRepository.java`: add max correlativo by serie.
- `src/main/java/edu/upn/proyecto/gruposowad/services/UsuarioService.java`: authenticate without exposing entity.
- `src/main/java/edu/upn/proyecto/gruposowad/services/CajaService.java`: open/close cashbox rules.
- `src/main/java/edu/upn/proyecto/gruposowad/services/VentaService.java`: replace entity-based sale creation with DTO transaction.
- `src/main/java/edu/upn/proyecto/gruposowad/services/BoletaService.java`: generate formal receipt data.
- `src/main/java/edu/upn/proyecto/gruposowad/controllers/UsuarioController.java`: return login DTO.
- `src/main/java/edu/upn/proyecto/gruposowad/controllers/CajaController.java`: add open/close endpoints.
- `src/main/java/edu/upn/proyecto/gruposowad/controllers/VentaController.java`: add POS endpoint.
- `src/main/java/edu/upn/proyecto/gruposowad/controllers/BoletaController.java`: add printable receipt endpoint.

Frontend files to create after Angular project setup:

- `frontend/src/app/core/models/auth.models.ts`: auth interfaces.
- `frontend/src/app/core/models/pos.models.ts`: POS interfaces.
- `frontend/src/app/core/services/auth.service.ts`: login and session.
- `frontend/src/app/core/services/caja.service.ts`: open/close caja.
- `frontend/src/app/core/services/producto.service.ts`: search products.
- `frontend/src/app/core/services/venta.service.ts`: register sales.
- `frontend/src/app/core/guards/role.guard.ts`: role-based route guard.
- `frontend/src/app/features/login/login.component.ts`: login screen.
- `frontend/src/app/features/pos/pos.component.ts`: fast POS screen.
- `frontend/src/app/features/boleta/boleta-print.component.ts`: printable receipt view.

The workspace is not currently a Git repository. If Git is initialized before execution, commit after each task. If it remains non-Git, record each task completion in the plan checkboxes.

---

### Task 1: Backend Dependencies And Configuration

**Files:**
- Modify: `pom.xml`
- Modify: `src/main/resources/application.properties`

- [ ] **Step 1: Add backend dependencies**

Modify `pom.xml` dependencies to include validation, BCrypt support, and PDF generation:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>
<dependency>
    <groupId>com.github.librepdf</groupId>
    <artifactId>openpdf</artifactId>
    <version>2.0.3</version>
</dependency>
```

- [ ] **Step 2: Externalize database password**

Replace `src/main/resources/application.properties` with:

```properties
spring.application.name=gruposowad
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/minimarket}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
```

- [ ] **Step 3: Verify dependency resolution**

Run:

```powershell
.\mvnw.cmd -q dependency:tree
```

Expected: Maven resolves `spring-security-crypto`, `spring-boot-starter-validation`, and `openpdf`.

- [ ] **Step 4: Commit**

If Git is available:

```powershell
git add pom.xml src/main/resources/application.properties
git commit -m "chore: configure backend dependencies"
```

---

### Task 2: DTOs And Error Handling

**Files:**
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/common/ApiError.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/exceptions/BusinessException.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/exceptions/GlobalExceptionHandler.java`

- [ ] **Step 1: Create standard API error DTO**

```java
package edu.upn.proyecto.gruposowad.dtos.common;

import java.time.LocalDateTime;

public class ApiError {
    private String message;
    private int status;
    private LocalDateTime timestamp;

    public ApiError(String message, int status) {
        this.message = message;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
```

- [ ] **Step 2: Create business exception**

```java
package edu.upn.proyecto.gruposowad.exceptions;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

- [ ] **Step 3: Create global exception handler**

```java
package edu.upn.proyecto.gruposowad.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import edu.upn.proyecto.gruposowad.dtos.common.ApiError;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusiness(BusinessException ex) {
        return ResponseEntity.badRequest().body(new ApiError(ex.getMessage(), 400));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Solicitud invalida");
        return ResponseEntity.badRequest().body(new ApiError(message, 400));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError("Error interno del servidor", 500));
    }
}
```

- [ ] **Step 4: Verify compilation**

Run:

```powershell
.\mvnw.cmd -q test
```

Expected: compilation succeeds, or test execution reaches the existing database connection stage.

- [ ] **Step 5: Commit**

```powershell
git add src/main/java/edu/upn/proyecto/gruposowad/dtos/common src/main/java/edu/upn/proyecto/gruposowad/exceptions
git commit -m "feat: add api error handling"
```

---

### Task 3: Safe Login With ADMIN And CAJERO Roles

**Files:**
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/auth/LoginRequest.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/auth/LoginResponse.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/models/Usuario.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/services/UsuarioService.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/controllers/UsuarioController.java`

- [ ] **Step 1: Create login request DTO**

```java
package edu.upn.proyecto.gruposowad.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "El usuario es obligatorio")
    private String username;

    @NotBlank(message = "La clave es obligatoria")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

- [ ] **Step 2: Create login response DTO**

```java
package edu.upn.proyecto.gruposowad.dtos.auth;

public class LoginResponse {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String username;
    private String rol;

    public LoginResponse(Long idUsuario, String nombre, String apellido, String username, String rol) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.username = username;
        this.rol = rol;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getUsername() {
        return username;
    }

    public String getRol() {
        return rol;
    }
}
```

- [ ] **Step 3: Hide password hash from JSON**

Add this import and annotation in `Usuario.java`:

```java
import com.fasterxml.jackson.annotation.JsonIgnore;
```

```java
@JsonIgnore
@Column
private String password_hash;
```

- [ ] **Step 4: Replace login logic in service**

Add this method to `UsuarioService.java`:

```java
public LoginResponse login(LoginRequest request) {
    Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException("Credenciales incorrectas"));

    if (usuario.getActivo() != null && !usuario.getActivo()) {
        throw new BusinessException("El usuario se encuentra inactivo");
    }

    String storedPassword = usuario.getPassword_hash();
    boolean matchesPlainTextForCurrentData = storedPassword != null && storedPassword.equals(request.getPassword());
    boolean matchesBCrypt = storedPassword != null
            && storedPassword.startsWith("$2")
            && new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(request.getPassword(), storedPassword);

    if (!matchesPlainTextForCurrentData && !matchesBCrypt) {
        throw new BusinessException("Credenciales incorrectas");
    }

    String rol = usuario.getRol() != null ? usuario.getRol().getNombre() : "";
    if (!"ADMIN".equalsIgnoreCase(rol) && !"CAJERO".equalsIgnoreCase(rol)) {
        throw new BusinessException("Rol no autorizado");
    }

    return new LoginResponse(
            usuario.getId_usuario(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getUsername(),
            rol.toUpperCase());
}
```

Also add imports:

```java
import edu.upn.proyecto.gruposowad.dtos.auth.LoginRequest;
import edu.upn.proyecto.gruposowad.dtos.auth.LoginResponse;
import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
```

- [ ] **Step 5: Replace login endpoint**

Replace `UsuarioController.login` with:

```java
@PostMapping("/login")
@CrossOrigin(origins = "http://localhost:4200")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
    return ResponseEntity.ok(usuarioService.login(loginRequest));
}
```

Add imports:

```java
import edu.upn.proyecto.gruposowad.dtos.auth.LoginRequest;
import edu.upn.proyecto.gruposowad.dtos.auth.LoginResponse;
import jakarta.validation.Valid;
```

- [ ] **Step 6: Verify password hash is not returned**

Run the application and call:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/usuario/login -ContentType 'application/json' -Body '{"username":"admin","password":"admin"}'
```

Expected: JSON includes `idUsuario`, `nombre`, `apellido`, `username`, `rol`; it does not include `password_hash`.

- [ ] **Step 7: Commit**

```powershell
git add src/main/java/edu/upn/proyecto/gruposowad/dtos/auth src/main/java/edu/upn/proyecto/gruposowad/models/Usuario.java src/main/java/edu/upn/proyecto/gruposowad/services/UsuarioService.java src/main/java/edu/upn/proyecto/gruposowad/controllers/UsuarioController.java
git commit -m "feat: add safe role login"
```

---

### Task 4: Caja Open And Close Rules

**Files:**
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/caja/AbrirCajaRequest.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/caja/CerrarCajaRequest.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/repositories/CajaRepository.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/services/CajaService.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/controllers/CajaController.java`

- [ ] **Step 1: Create open caja request**

```java
package edu.upn.proyecto.gruposowad.dtos.caja;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class AbrirCajaRequest {
    @NotNull(message = "El usuario es obligatorio")
    private Long idUsuario;

    @NotNull(message = "El monto de apertura es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto de apertura no puede ser negativo")
    private BigDecimal montoApertura;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public BigDecimal getMontoApertura() {
        return montoApertura;
    }

    public void setMontoApertura(BigDecimal montoApertura) {
        this.montoApertura = montoApertura;
    }
}
```

- [ ] **Step 2: Create close caja request**

```java
package edu.upn.proyecto.gruposowad.dtos.caja;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class CerrarCajaRequest {
    @NotNull(message = "El monto contado es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto contado no puede ser negativo")
    private BigDecimal montoContado;

    private String observaciones;

    public BigDecimal getMontoContado() {
        return montoContado;
    }

    public void setMontoContado(BigDecimal montoContado) {
        this.montoContado = montoContado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
```

- [ ] **Step 3: Add repository queries**

Add to `CajaRepository.java`:

```java
Optional<Caja> findFirstByUsuario_IdUsuarioAndEstadoOrderByFechaAperturaDesc(Long idUsuario, String estado);
```

If the generated property path does not compile because current getters use snake case, use this exact JPQL query instead:

```java
@Query("select c from Caja c where c.usuario.id_usuario = :idUsuario and c.estado = :estado order by c.fecha_apertura desc")
Optional<Caja> buscarCajaAbierta(@Param("idUsuario") Long idUsuario, @Param("estado") String estado);
```

- [ ] **Step 4: Implement service methods**

Add to `CajaService.java`:

```java
public Caja abrir(AbrirCajaRequest request) {
    usuarioRepository.findById(request.getIdUsuario())
            .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

    cajaRepository.buscarCajaAbierta(request.getIdUsuario(), "ABIERTA").ifPresent(caja -> {
        throw new BusinessException("El usuario ya tiene una caja abierta");
    });

    Usuario usuario = new Usuario();
    usuario.setId_usuario(request.getIdUsuario());

    Caja caja = new Caja();
    caja.setUsuario(usuario);
    caja.setMonto_apertura(request.getMontoApertura());
    caja.setFecha_apertura(LocalDateTime.now());
    caja.setEstado("ABIERTA");
    return cajaRepository.save(caja);
}

public Caja cerrar(Long idCaja, CerrarCajaRequest request) {
    Caja caja = cajaRepository.findById(idCaja)
            .orElseThrow(() -> new BusinessException("Caja no encontrada"));

    if (!"ABIERTA".equalsIgnoreCase(caja.getEstado())) {
        throw new BusinessException("La caja no esta abierta");
    }

    caja.setMonto_contado(request.getMontoContado());
    caja.setFecha_cierre(LocalDateTime.now());
    caja.setObservaciones(request.getObservaciones());
    caja.setDiferencia(request.getMontoContado().subtract(caja.getMonto_apertura()));
    caja.setEstado("CERRADA");
    return cajaRepository.save(caja);
}
```

Required imports:

```java
import java.time.LocalDateTime;
import edu.upn.proyecto.gruposowad.dtos.caja.AbrirCajaRequest;
import edu.upn.proyecto.gruposowad.dtos.caja.CerrarCajaRequest;
import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Usuario;
import edu.upn.proyecto.gruposowad.repositories.UsuarioRepository;
```

- [ ] **Step 5: Add endpoints**

Add to `CajaController.java`:

```java
@PostMapping("/abrir")
public Caja abrir(@Valid @RequestBody AbrirCajaRequest request) {
    return cajaService.abrir(request);
}

@PostMapping("/{idCaja}/cerrar")
public Caja cerrar(@PathVariable Long idCaja, @Valid @RequestBody CerrarCajaRequest request) {
    return cajaService.cerrar(idCaja, request);
}
```

- [ ] **Step 6: Verify caja flow**

Run:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/caja/abrir -ContentType 'application/json' -Body '{"idUsuario":1,"montoApertura":100.00}'
```

Expected: caja is returned with `estado` equal to `ABIERTA`.

- [ ] **Step 7: Commit**

```powershell
git add src/main/java/edu/upn/proyecto/gruposowad/dtos/caja src/main/java/edu/upn/proyecto/gruposowad/repositories/CajaRepository.java src/main/java/edu/upn/proyecto/gruposowad/services/CajaService.java src/main/java/edu/upn/proyecto/gruposowad/controllers/CajaController.java
git commit -m "feat: add caja open close flow"
```

---

### Task 5: POS Sale DTOs And Transaction

**Files:**
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaDetalleRequest.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaRequest.java`
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/venta/VentaResponse.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/repositories/ProductoRepository.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/services/VentaService.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/controllers/VentaController.java`

- [ ] **Step 1: Create line item request**

```java
package edu.upn.proyecto.gruposowad.dtos.venta;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class VentaDetalleRequest {
    @NotNull(message = "El producto es obligatorio")
    private Long idProducto;

    @Min(value = 1, message = "La cantidad debe ser mayor a cero")
    private int cantidad;

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
```

- [ ] **Step 2: Create sale request**

```java
package edu.upn.proyecto.gruposowad.dtos.venta;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class VentaRequest {
    @NotNull(message = "La caja es obligatoria")
    private Long idCaja;

    @NotNull(message = "El usuario es obligatorio")
    private Long idUsuario;

    @NotEmpty(message = "La venta debe tener productos")
    @Valid
    private List<VentaDetalleRequest> detalles;

    @NotNull(message = "El monto recibido es obligatorio")
    private BigDecimal montoRecibido;

    private String metodoPago;

    public Long getIdCaja() {
        return idCaja;
    }

    public void setIdCaja(Long idCaja) {
        this.idCaja = idCaja;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<VentaDetalleRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<VentaDetalleRequest> detalles) {
        this.detalles = detalles;
    }

    public BigDecimal getMontoRecibido() {
        return montoRecibido;
    }

    public void setMontoRecibido(BigDecimal montoRecibido) {
        this.montoRecibido = montoRecibido;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
```

- [ ] **Step 3: Create sale response**

```java
package edu.upn.proyecto.gruposowad.dtos.venta;

import java.math.BigDecimal;

public class VentaResponse {
    private Long idVenta;
    private Long idBoleta;
    private String numeroVenta;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private BigDecimal vuelto;

    public VentaResponse(Long idVenta, Long idBoleta, String numeroVenta, BigDecimal subtotal, BigDecimal igv, BigDecimal total, BigDecimal vuelto) {
        this.idVenta = idVenta;
        this.idBoleta = idBoleta;
        this.numeroVenta = numeroVenta;
        this.subtotal = subtotal;
        this.igv = igv;
        this.total = total;
        this.vuelto = vuelto;
    }

    public Long getIdVenta() {
        return idVenta;
    }

    public Long getIdBoleta() {
        return idBoleta;
    }

    public String getNumeroVenta() {
        return numeroVenta;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getIgv() {
        return igv;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getVuelto() {
        return vuelto;
    }
}
```

- [ ] **Step 4: Add product search query**

Add to `ProductoRepository.java`:

```java
List<Producto> findByActivoTrueAndNombreProductoContainingIgnoreCaseOrCodigoProductoContainingIgnoreCase(String nombre, String codigo);
```

If camel-case derived fields do not compile with current snake-case field names, use:

```java
@Query("select p from Producto p where p.activo = true and (lower(p.nombre_producto) like lower(concat('%', :q, '%')) or lower(p.codigo_producto) like lower(concat('%', :q, '%')))")
List<Producto> buscarActivos(@Param("q") String q);
```

- [ ] **Step 5: Implement transactional POS sale**

Replace `VentaService.nuevo(Venta venta)` with a new method:

```java
@Transactional
public VentaResponse registrarPos(VentaRequest request) {
    Caja caja = cajaRepository.findById(request.getIdCaja())
            .orElseThrow(() -> new BusinessException("Caja no encontrada"));
    if (!"ABIERTA".equalsIgnoreCase(caja.getEstado())) {
        throw new BusinessException("Caja no abierta");
    }

    Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
            .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

    Venta venta = new Venta();
    venta.setCaja(caja);
    venta.setUsuario(usuario);
    venta.setMetodo_pago(request.getMetodoPago() == null ? "EFECTIVO" : request.getMetodoPago());
    venta.setMonto_recibido(request.getMontoRecibido());
    venta.setEstado("COMPLETADA");

    List<DetalleVenta> detalles = new ArrayList<>();
    BigDecimal subtotal = BigDecimal.ZERO;

    for (VentaDetalleRequest item : request.getDetalles()) {
        Producto producto = productoRepository.findById(item.getIdProducto())
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));
        if (producto.getStock_actual() == null || producto.getStock_actual() < item.getCantidad()) {
            throw new BusinessException("Stock insuficiente para el producto: " + producto.getNombre_producto());
        }
        if (producto.getPrecio_venta() == null) {
            throw new BusinessException("Producto sin precio de venta: " + producto.getNombre_producto());
        }

        BigDecimal cantidad = BigDecimal.valueOf(item.getCantidad());
        BigDecimal itemSubtotal = producto.getPrecio_venta().multiply(cantidad);
        subtotal = subtotal.add(itemSubtotal);

        DetalleVenta detalle = new DetalleVenta();
        detalle.setVenta(venta);
        detalle.setProducto(producto);
        detalle.setCantidad(item.getCantidad());
        detalle.setPrecio_unitario(producto.getPrecio_venta());
        detalle.setPrecio_compra(producto.getPrecio_compra());
        detalle.setDescuento(BigDecimal.ZERO);
        detalle.setSubtotal(itemSubtotal);
        detalles.add(detalle);

        int stockAnterior = producto.getStock_actual();
        producto.setStock_actual(stockAnterior - item.getCantidad());
        productoRepository.save(producto);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setUsuario(usuario);
        movimiento.setTipo_movimiento("SALIDA");
        movimiento.setCantidad(item.getCantidad());
        movimiento.setStock_anterior(stockAnterior);
        movimiento.setStock_posterior(producto.getStock_actual());
        movimiento.setMotivo("VENTA");
        movimiento.setTabla_referencia("venta");
        movimiento.setFecha_movimiento(LocalDateTime.now());
        movimientoInventarioRepository.save(movimiento);
    }

    BigDecimal igv = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
    BigDecimal total = subtotal.add(igv).setScale(2, RoundingMode.HALF_UP);
    if (request.getMontoRecibido().compareTo(total) < 0) {
        throw new BusinessException("Monto recibido insuficiente");
    }

    venta.setSubtotal(subtotal);
    venta.setIgv_monto(igv);
    venta.setTotal(total);
    venta.setVuelto(request.getMontoRecibido().subtract(total));
    venta.setDetalles(detalles);
    Venta ventaGuardada = ventaRepository.save(venta);

    Boleta boleta = boletaService.generarParaVenta(ventaGuardada);

    return new VentaResponse(
            ventaGuardada.getId_venta(),
            boleta.getId_boleta(),
            ventaGuardada.getNumero_venta(),
            subtotal,
            igv,
            total,
            ventaGuardada.getVuelto());
}
```

Add required repositories as injected fields:

```java
@Autowired
private CajaRepository cajaRepository;

@Autowired
private UsuarioRepository usuarioRepository;

@Autowired
private MovimientoInventarioRepository movimientoInventarioRepository;

@Autowired
private BoletaService boletaService;
```

- [ ] **Step 6: Add POS endpoint**

Add to `VentaController.java`:

```java
@PostMapping("/pos")
public VentaResponse registrarPos(@Valid @RequestBody VentaRequest request) {
    return ventaService.registrarPos(request);
}
```

- [ ] **Step 7: Verify POS sale**

Run:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/venta/pos -ContentType 'application/json' -Body '{"idCaja":1,"idUsuario":1,"montoRecibido":50.00,"metodoPago":"EFECTIVO","detalles":[{"idProducto":1,"cantidad":1}]}'
```

Expected: JSON includes `idVenta`, `idBoleta`, `subtotal`, `igv`, `total`, and `vuelto`; stock decreases by one.

- [ ] **Step 8: Commit**

```powershell
git add src/main/java/edu/upn/proyecto/gruposowad/dtos/venta src/main/java/edu/upn/proyecto/gruposowad/repositories/ProductoRepository.java src/main/java/edu/upn/proyecto/gruposowad/services/VentaService.java src/main/java/edu/upn/proyecto/gruposowad/controllers/VentaController.java
git commit -m "feat: add transactional pos sale"
```

---

### Task 6: Formal Boleta Data And Printable Endpoint

**Files:**
- Create: `src/main/java/edu/upn/proyecto/gruposowad/dtos/boleta/BoletaResponse.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/repositories/BoletaRepository.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/services/BoletaService.java`
- Modify: `src/main/java/edu/upn/proyecto/gruposowad/controllers/BoletaController.java`

- [ ] **Step 1: Create boleta response**

```java
package edu.upn.proyecto.gruposowad.dtos.boleta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BoletaResponse {
    private String ruc;
    private String razonSocial;
    private String nombreComercial;
    private String direccion;
    private String serie;
    private String numero;
    private LocalDateTime fechaEmision;
    private String cajero;
    private List<String> detalles;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String metodoPago;

    public BoletaResponse(String ruc, String razonSocial, String nombreComercial, String direccion, String serie, String numero, LocalDateTime fechaEmision, String cajero, List<String> detalles, BigDecimal subtotal, BigDecimal igv, BigDecimal total, String metodoPago) {
        this.ruc = ruc;
        this.razonSocial = razonSocial;
        this.nombreComercial = nombreComercial;
        this.direccion = direccion;
        this.serie = serie;
        this.numero = numero;
        this.fechaEmision = fechaEmision;
        this.cajero = cajero;
        this.detalles = detalles;
        this.subtotal = subtotal;
        this.igv = igv;
        this.total = total;
        this.metodoPago = metodoPago;
    }

    public String getRuc() { return ruc; }
    public String getRazonSocial() { return razonSocial; }
    public String getNombreComercial() { return nombreComercial; }
    public String getDireccion() { return direccion; }
    public String getSerie() { return serie; }
    public String getNumero() { return numero; }
    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public String getCajero() { return cajero; }
    public List<String> getDetalles() { return detalles; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getIgv() { return igv; }
    public BigDecimal getTotal() { return total; }
    public String getMetodoPago() { return metodoPago; }
}
```

- [ ] **Step 2: Add boleta correlativo query**

Add to `BoletaRepository.java`:

```java
@Query("select coalesce(max(b.numero), 0) from Boleta b where b.serie = :serie")
Integer maxNumeroPorSerie(@Param("serie") String serie);
```

- [ ] **Step 3: Generate boleta for sale**

Add to `BoletaService.java`:

```java
public Boleta generarParaVenta(Venta venta) {
    String serie = "B001";
    Integer ultimoNumero = boletaRepository.maxNumeroPorSerie(serie);
    int siguienteNumero = ultimoNumero == null ? 1 : ultimoNumero + 1;

    Boleta boleta = new Boleta();
    boleta.setVenta(venta);
    boleta.setSerie(serie);
    boleta.setNumero(siguienteNumero);
    boleta.setFecha_emision(LocalDateTime.now());
    boleta.setSubtotal(venta.getSubtotal());
    boleta.setIgv_monto(venta.getIgv_monto());
    boleta.setTotal(venta.getTotal());
    boleta.setEstado("GENERADA");
    return boletaRepository.save(boleta);
}
```

- [ ] **Step 4: Add printable data endpoint**

Add to `BoletaService.java`:

```java
public BoletaResponse obtenerFormal(Long idBoleta) {
    Boleta boleta = boletaRepository.findById(idBoleta)
            .orElseThrow(() -> new BusinessException("Boleta no encontrada"));
    Venta venta = boleta.getVenta();
    Empresa empresa = empresaRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new BusinessException("Datos de empresa no configurados"));

    List<String> detalles = venta.getDetalles().stream()
            .map(d -> d.getCantidad() + " x " + d.getProducto().getNombre_producto() + " - S/ " + d.getSubtotal())
            .toList();

    String cajero = venta.getUsuario() == null ? "" : venta.getUsuario().getNombre() + " " + venta.getUsuario().getApellido();

    return new BoletaResponse(
            empresa.getRuc(),
            empresa.getRazon_social(),
            empresa.getNombre_comercial(),
            empresa.getDireccion(),
            boleta.getSerie(),
            String.format("%08d", boleta.getNumero()),
            boleta.getFecha_emision(),
            cajero,
            detalles,
            boleta.getSubtotal(),
            boleta.getIgv_monto(),
            boleta.getTotal(),
            venta.getMetodo_pago());
}
```

Inject:

```java
@Autowired
private EmpresaRepository empresaRepository;
```

- [ ] **Step 5: Add controller endpoint**

Add to `BoletaController.java`:

```java
@GetMapping("/{idBoleta}/formal")
public BoletaResponse obtenerFormal(@PathVariable Long idBoleta) {
    return boletaService.obtenerFormal(idBoleta);
}
```

- [ ] **Step 6: Verify formal boleta JSON**

Run:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/boleta/1/formal
```

Expected: JSON includes company data, `serie`, `numero`, `fechaEmision`, line details, subtotal, IGV, total, and payment method.

- [ ] **Step 7: Commit**

```powershell
git add src/main/java/edu/upn/proyecto/gruposowad/dtos/boleta src/main/java/edu/upn/proyecto/gruposowad/repositories/BoletaRepository.java src/main/java/edu/upn/proyecto/gruposowad/services/BoletaService.java src/main/java/edu/upn/proyecto/gruposowad/controllers/BoletaController.java
git commit -m "feat: add formal boleta endpoint"
```

---

### Task 7: Angular Project Shell

**Files:**
- Create: `frontend/`

- [ ] **Step 1: Generate Angular app**

Run from project root:

```powershell
npx @angular/cli new frontend --routing --style=css --skip-git
```

Expected: `frontend/package.json`, `frontend/src/app`, and Angular routing are created.

- [ ] **Step 2: Create API environment**

Create `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080'
};
```

- [ ] **Step 3: Create auth models**

Create `frontend/src/app/core/models/auth.models.ts`:

```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: 'ADMIN' | 'CAJERO';
}
```

- [ ] **Step 4: Create POS models**

Create `frontend/src/app/core/models/pos.models.ts`:

```typescript
export interface Producto {
  id_producto: number;
  codigo_producto: string;
  nombre_producto: string;
  precio_venta: number;
  stock_actual: number;
}

export interface VentaDetalleRequest {
  idProducto: number;
  cantidad: number;
}

export interface VentaRequest {
  idCaja: number;
  idUsuario: number;
  montoRecibido: number;
  metodoPago: string;
  detalles: VentaDetalleRequest[];
}

export interface VentaResponse {
  idVenta: number;
  idBoleta: number;
  numeroVenta: string;
  subtotal: number;
  igv: number;
  total: number;
  vuelto: number;
}
```

- [ ] **Step 5: Verify Angular build**

Run:

```powershell
cd frontend
npm install
npm run build
```

Expected: Angular build completes successfully.

- [ ] **Step 6: Commit**

```powershell
git add frontend
git commit -m "feat: scaffold angular frontend"
```

---

### Task 8: Angular Login, Guard, And POS Routes

**Files:**
- Create: `frontend/src/app/core/services/auth.service.ts`
- Create: `frontend/src/app/core/guards/role.guard.ts`
- Create: `frontend/src/app/features/login/login.component.ts`
- Create: `frontend/src/app/features/login/login.component.html`
- Create: `frontend/src/app/features/login/login.component.css`
- Create: `frontend/src/app/features/pos/pos.component.ts`
- Create: `frontend/src/app/features/pos/pos.component.html`
- Create: `frontend/src/app/features/pos/pos.component.css`
- Modify: `frontend/src/app/app.routes.ts`

- [ ] **Step 1: Create auth service**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'minimarket_user';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/usuario/login`, request).pipe(
      tap(user => localStorage.setItem(this.storageKey, JSON.stringify(user)))
    );
  }

  currentUser(): LoginResponse | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as LoginResponse : null;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.rol);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }
}
```

- [ ] **Step 2: Create role guard**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[];

  if (auth.hasRole(roles)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

- [ ] **Step 3: Create login component class**

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: user => this.router.navigate([user.rol === 'CAJERO' ? '/pos' : '/admin']),
      error: err => this.error = err.error?.message || 'No se pudo iniciar sesion'
    });
  }
}
```

- [ ] **Step 4: Create login template**

```html
<main class="login-page">
  <form class="login-panel" (ngSubmit)="submit()">
    <h1>Minimarket</h1>
    <label>
      Usuario
      <input name="username" [(ngModel)]="username" autocomplete="username">
    </label>
    <label>
      Clave
      <input name="password" [(ngModel)]="password" type="password" autocomplete="current-password">
    </label>
    <p class="error" *ngIf="error">{{ error }}</p>
    <button type="submit">Ingresar</button>
  </form>
</main>
```

- [ ] **Step 5: Create login CSS**

```css
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f6f8;
}

.login-panel {
  width: min(380px, calc(100vw - 32px));
  padding: 24px;
  background: #ffffff;
  border: 1px solid #dde3ea;
  border-radius: 8px;
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input {
  height: 40px;
  border: 1px solid #b8c2cc;
  border-radius: 6px;
  padding: 0 10px;
}

button {
  height: 42px;
  border: 0;
  border-radius: 6px;
  background: #1677c8;
  color: #ffffff;
  font-weight: 700;
}

.error {
  color: #b42318;
  margin: 0;
}
```

- [ ] **Step 6: Create POS component placeholder**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-pos',
  standalone: true,
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent {}
```

```html
<main class="pos-shell">
  <section class="search-panel">
    <h1>Punto de venta</h1>
    <input placeholder="Buscar producto por codigo o nombre">
    <div class="product-list">Productos disponibles</div>
  </section>
  <aside class="cart-panel">
    <h2>Carrito</h2>
    <div class="cart-lines">Agrega productos para iniciar la venta</div>
    <div class="totals">
      <span>Total</span>
      <strong>S/ 0.00</strong>
    </div>
    <button>Cobrar</button>
  </aside>
</main>
```

```css
.pos-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
  padding: 16px;
  background: #eef2f5;
}

.search-panel,
.cart-panel {
  background: #ffffff;
  border: 1px solid #d8e0e8;
  border-radius: 8px;
  padding: 16px;
}

input {
  width: 100%;
  height: 44px;
  border: 1px solid #b8c2cc;
  border-radius: 6px;
  padding: 0 12px;
}

.product-list,
.cart-lines {
  margin-top: 16px;
  min-height: 240px;
  border: 1px dashed #b8c2cc;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: #52606d;
}

.totals {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 20px;
}

button {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 6px;
  background: #198754;
  color: #ffffff;
  font-weight: 700;
}

@media (max-width: 900px) {
  .pos-shell {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Configure routes**

```typescript
import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/login/login.component';
import { PosComponent } from './features/pos/pos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'pos', component: PosComponent, canActivate: [roleGuard], data: { roles: ['CAJERO', 'ADMIN'] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
```

- [ ] **Step 8: Verify Angular routing build**

Run:

```powershell
cd frontend
npm run build
```

Expected: build completes and routes compile.

- [ ] **Step 9: Commit**

```powershell
git add frontend/src/app
git commit -m "feat: add angular login and pos shell"
```

---

### Task 9: Backend And Frontend Verification

**Files:**
- Modify: plan checkboxes only.

- [ ] **Step 1: Verify backend compilation**

Run:

```powershell
.\mvnw.cmd test
```

Expected: backend compiles and tests run. If `JAVA_HOME` is missing, configure Java 17 and rerun.

- [ ] **Step 2: Verify backend manually**

Run the Spring Boot app and verify:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/usuario/login -ContentType 'application/json' -Body '{"username":"admin","password":"admin"}'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/caja/abrir -ContentType 'application/json' -Body '{"idUsuario":1,"montoApertura":100.00}'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/venta/pos -ContentType 'application/json' -Body '{"idCaja":1,"idUsuario":1,"montoRecibido":50.00,"metodoPago":"EFECTIVO","detalles":[{"idProducto":1,"cantidad":1}]}'
Invoke-RestMethod -Method Get -Uri http://localhost:8080/boleta/1/formal
```

Expected: login returns no password hash, caja opens, sale registers, stock decreases, and boleta formal data is returned.

- [ ] **Step 3: Verify frontend**

Run:

```powershell
cd frontend
npm start
```

Open `http://localhost:4200`.

Expected: login screen loads; successful login routes cashier to `/pos`; POS shell is responsive on laptop width and stacks on tablet width.

- [ ] **Step 4: Final commit**

```powershell
git add .
git commit -m "feat: complete hito 1 pos rapido"
```

---

## Self-Review

Spec coverage:

- Login with roles: Task 3 and Task 8.
- POS rapido: Task 5 and Task 8.
- Apertura/cierre de caja: Task 4.
- Registro de venta con detalle: Task 5.
- Descuento automatico de stock: Task 5.
- Movimiento de inventario: Task 5.
- Boleta formal imprimible data: Task 6.
- Angular desktop/laptop with tablet basic support: Task 8.
- JSON REST communication: Tasks 3 through 8.

Known exclusions for later plans:

- Full product administration screens.
- Supplier, purchase order, and reception workflows.
- Advanced reports.
- PDF byte-stream generation if JSON print view is not enough for the teacher.
- SUNAT electronic integration.

