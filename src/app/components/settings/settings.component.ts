import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SnackbarService } from "../../shared/services/snackbar.service";
import { AuthService } from '../../shared/services/auth.service';
import { DisplayNameDialogComponent } from '../../shared/dialogs/display-name-dialog/display-name-dialog.component';
import { EmailDialogComponent } from '../../shared/dialogs/email-dialog/email-dialog.component';
import { PasswordDialogComponent } from '../../shared/dialogs/password-dialog/password-dialog.component';
import { DialogService } from '../../shared/services/dialog.service';
import { PhotoDialogComponent } from '../../shared/dialogs/photo-dialog/photo-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  matDialogConfig = new MatDialogConfig();
  trigger: number = 0;

  constructor(private snackbar: SnackbarService, private dialog: MatDialog, public auth: AuthService, private dialogService: DialogService) {}

  ngOnInit() {
    setInterval(() => this.trigger = Math.random(), 60000)
  }

  editPhoto(displayName: string, photoPath: string, uid: string, color: string) {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.id = 'nonfullscreen';
    matDialogConfig.data = {displayName: displayName, photoPath: photoPath, uid: uid, color: color};
    this.dialog.open(PhotoDialogComponent, matDialogConfig);
  }

  editUsername(displayName: string) {
    this.matDialogConfig = this.dialogService.getConfig();
    this.matDialogConfig.data = {displayName: displayName};
    let dialogRef = this.dialog.open(DisplayNameDialogComponent, this.matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res === true) {
        this.snackbar.openSnackbar("Username successfully updated");
      } else if(res === false) {
        this.snackbar.error();
      }
    });
  }

  editEmail(displayName:string, photoUrl: string, color:string, email: string) {
    this.matDialogConfig = this.dialogService.getConfig();
    this.matDialogConfig.data = {displayName: displayName, photoUrl: photoUrl, color: color, email: email};
    let dialogRef = this.dialog.open(EmailDialogComponent, this.matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res === true) {
        this.snackbar.openSnackbar("Email successfully updated");
      } else if(res !== '' && res !== undefined && res !== null) {
        this.snackbar.error();
      }
    });
  }

  editPassword(displayName:string, photoUrl: string, color:string, email: string) {
    this.matDialogConfig = this.dialogService.getConfig();
    this.matDialogConfig.data = {displayName: displayName, photoUrl: photoUrl, color: color, email: email};
    let dialogRef = this.dialog.open(PasswordDialogComponent, this.matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res === true) {
        this.snackbar.openSnackbar("Password successfully updated");
      } else if(res !== '' && res !== undefined && res !== null) {
        this.snackbar.error();
      }
    });
  }

}
