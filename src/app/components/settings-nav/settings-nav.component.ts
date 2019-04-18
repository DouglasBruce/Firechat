import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from "../../shared/services/theme.service";

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.scss']
})
export class SettingsNavComponent {

  constructor(public theme: ThemeService, private renderer: Renderer2, public auth: AuthService, private router: Router) {}

  toggleDarkTheme() {
    this.theme.toggleTheme(this.renderer);
  }

  signOut() {
    this.auth.signOut();
  }

  back() {
    this.router.navigate(['/']);
  }

}
