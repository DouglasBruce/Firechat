import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from "../../shared/services/theme.service";

@Component({
  selector: 'app-sign-nav',
  templateUrl: './sign-nav.component.html',
  styleUrls: ['./sign-nav.component.scss']
})
export class SignNavComponent {

  constructor(public theme: ThemeService, private renderer: Renderer2, public auth: AuthService) {}

  toggleDarkTheme() {
    this.theme.toggleTheme(this.renderer);
  }

}
