import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

    matDialogConfig = new MatDialogConfig();

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(Breakpoints.Handset).subscribe(res => {
            if(res.matches) {
                this.setHandsetConfig();
            } else {
                this.setDefaultConfig();
            }
        });
    }

    getConfig() {
        return this.matDialogConfig;
    }

    setDefaultConfig() {
        this.matDialogConfig.width = '400px';
        this.matDialogConfig.minWidth = "400px";
        this.matDialogConfig.maxWidth = '80vh';
        this.matDialogConfig.height = 'auto';
        this.matDialogConfig.minHeight = 'auto';
        this.matDialogConfig.maxHeight = 'auto';
      }
    
      setHandsetConfig() {
        this.matDialogConfig.width = '100vh';
        this.matDialogConfig.minWidth = '100%';
        this.matDialogConfig.maxWidth = '100vh';
        this.matDialogConfig.height = '100vh';
        this.matDialogConfig.minHeight = '100%';
        this.matDialogConfig.maxHeight = '100vh';
      }

      getDialogConfig(matDialogConfig: MatDialogConfig) {
        matDialogConfig.id = 'nonfullscreen';
        matDialogConfig.maxWidth = '420px';
        matDialogConfig.width = '80vw';
        matDialogConfig.minWidth = "288px";
        matDialogConfig.height = 'auto';
        matDialogConfig.minHeight = 'auto';
        matDialogConfig.maxHeight = 'auto';
        return matDialogConfig;
      }

      getImageDialogConfig(matDialogConfig: MatDialogConfig) {
        matDialogConfig.id = 'imagefullscreen';
        matDialogConfig.maxWidth = 'auto';
        matDialogConfig.width = '100%';
        matDialogConfig.minWidth = "auto";
        matDialogConfig.height = '100%';
        matDialogConfig.minHeight = 'auto';
        matDialogConfig.maxHeight = 'auto';
        matDialogConfig.hasBackdrop = false;
        return matDialogConfig;
      }
}
