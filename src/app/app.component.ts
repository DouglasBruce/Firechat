import { Component, Renderer2, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  handsetClass = 'handset';
  navbarClass = "navbarShadow";
  @HostListener('window:scroll', ['$event']) onScrollEvent(){
    const verticalOffset = window.pageYOffset 
      || document.documentElement.scrollTop 
      || document.body.scrollTop || 0;

      if(verticalOffset <= 0) {
        this.renderer.removeClass(document.body, this.navbarClass);
      } else {
        this.renderer.addClass(document.body, this.navbarClass);
      }
  }
  constructor(private breakpointObserver: BreakpointObserver, private theme: ThemeService, private renderer: Renderer2) {
    this.theme.initThemePref(this.renderer);
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(res => {
      if(res.matches) {
        renderer.addClass(document.body, this.handsetClass);
      } else { 
        renderer.removeClass(document.body, this.handsetClass);
      }
    });
  }
}
