import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-menu-bar',
    imports: [MenubarModule, ButtonModule],
    template: `
        <p-menubar [model]="items">
            <ng-template #end>
                <div class="flex items-center gap-2">
                    {{user.name}} - {{user.sector.name}}
                    <p-button label="Logout" variant="outlined" severity="danger" (onClick)="logout()" />
                </div>
            </ng-template>
        </p-menubar>
    `,
    styles: ``
})
export class MenuBarComponent implements OnInit {
    items: MenuItem[] | undefined;
    user!: User;

    protected userService: UserService = inject(UserService);
    protected router = inject(Router);

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                command: () => {
                    this.router.navigate(['/']);
                }
            },
            {
                label: 'Documentos',
                icon: 'pi pi-folder',
                command: () => {
                    this.router.navigate(['/documents']);
                }
            },
        ];

        this.user = this.userService.getUser() ?? {} as User;
    }

    logout() {
        this.userService.updateUser(null);
        this.router.navigate(['/login']);
    }
}
