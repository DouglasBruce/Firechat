import { Injectable, Renderer2 } from "@angular/core";
import { Meta } from "@angular/platform-browser";

@Injectable()
export class ThemeService {

    altTheme: string = "alt-theme";
    darkTheme: boolean = false;

    constructor(private meta: Meta) {}

    initThemePref(renderer: Renderer2) {
        const key = localStorage.getItem('darkTheme');
        if(key === null) {
            localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme));
        } else {
            this.darkTheme = (key === 'true');
            this.setTheme(renderer);
        }
        this.updateMeta();
    }

    setTheme(renderer: Renderer2) {
        if(this.darkTheme) {
            renderer.addClass(document.body, this.altTheme);
        } else {
            renderer.removeClass(document.body, this.altTheme);
        }
        localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme));
        this.updateMeta();
    }

    updateMeta() {
        if (this.darkTheme) {
            this.meta.updateTag({ name: 'theme-color', content: '#333333'});
        } else {
            this.meta.updateTag({ name: 'theme-color', content: '#ffffff'});
        } 
    }

    toggleTheme(renderer: Renderer2) {
        this.darkTheme = !this.darkTheme;
        this.setTheme(renderer);
    }
}