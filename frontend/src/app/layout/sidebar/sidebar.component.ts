import { Component, computed } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
interface NavItem{
    label:string;
    route:string;
    roles:Array<'ADMIN'|'CAJERO'>;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent{
    private readonly items: NavItem[]=[
        {label:'Dashboard',route:'/app/dashboard',roles:['ADMIN','CAJERO']},
        { label: 'Categorías', route: '/app/categorias', roles: ['ADMIN'] },
    { label: 'Productos', route: '/app/productos', roles: ['ADMIN'] },
    { label: 'Inventario', route: '/app/inventario/movimientos', roles: ['ADMIN'] },
    { label: 'Ventas', route: '/app/ventas/pos', roles: ['ADMIN', 'CAJERO'] },
    { label: 'Anulación', route: '/app/ventas/anulacion', roles: ['ADMIN'] },
    { label: 'Historial ventas', route: '/app/ventas/historial', roles: ['ADMIN'] },
    { label: 'Caja', route: '/app/caja', roles: ['ADMIN', 'CAJERO'] },
    { label: 'Proveedores', route: '/app/proveedores', roles: ['ADMIN'] },
    { label: 'Ajustes stock', route: '/app/inventario/ajustes', roles: ['ADMIN'] },
    { label: 'Reportes', route: '/app/reportes', roles: ['ADMIN'] },
    { label: 'Configuración', route: '/app/configuracion', roles: ['ADMIN'] }
    ];

    readonly visibleItems = computed(()=>{
        const user = this.auth.currentUser();
        return this.items.filter((item)=>user&&item.roles.includes(user.rol));
    });

    constructor(private auth:AuthService,private router:Router){}
    logout():void{
        this.auth.logout();
        void this.router.navigate(['/login']);
    }
}
