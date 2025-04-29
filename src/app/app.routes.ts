import { Routes } from '@angular/router';
import { DocumentManangerComponent } from './components/document-mananger/document-mananger.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { userGuardGuard } from './guard/user-guard.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'documents', component: DocumentManangerComponent, canActivate: [userGuardGuard] },
    { path: '', component: ChatComponent, canActivate: [userGuardGuard] },
];
