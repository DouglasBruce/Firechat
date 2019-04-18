import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecureInnerGuard } from './shared/guards/secure-inner.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { SettingsGuard } from './shared/guards/settings.guard';
import { VerifiedGuard } from './shared/guards/verified.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [SecureInnerGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [SettingsGuard] },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [VerifiedGuard] },
  { path: '**', redirectTo: 'sign-in', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
