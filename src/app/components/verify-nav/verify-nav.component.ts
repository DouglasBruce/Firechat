import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from "../../shared/services/theme.service";

@Component({
  selector: 'app-verify-nav',
  templateUrl: './verify-nav.component.html',
  styleUrls: ['./verify-nav.component.scss']
})
export class VerifyNavComponent {

  constructor(public theme: ThemeService, private renderer: Renderer2, public auth: AuthService, private router: Router) { }

  toggleDarkTheme() {
    this.theme.toggleTheme(this.renderer);
  }

  signOut() {
    this.auth.signOut();
  }

  settings() {
    this.router.navigate(['/settings']);
  }

}
