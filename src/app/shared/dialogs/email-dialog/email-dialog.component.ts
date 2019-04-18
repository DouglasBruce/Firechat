import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { auth } from "firebase/app";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar.service';
import { CustomValidator } from '../../custom-validator';
import { CustomErrorStateMatcher } from '../../custom-error-state-matcher';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit {

  reauthForm: FormGroup;
  emailForm: FormGroup;
  matcher: CustomErrorStateMatcher;
  isAuthPassVis: boolean = false;
  isReauthenticated: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<EmailDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private fb: FormBuilder, private afs: AngularFirestore, private afAuth: AngularFireAuth, private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.matcher = new CustomErrorStateMatcher();
    this.reauthForm = this.fb.group({
      reauthPassword: ['', [
        Validators.required
      ]]
    });
    this.emailForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        CustomValidator.emailChanged(this.data.email)
      ],
      CustomValidator.email(this.afs)
    ]
    });
  }

  forgotPassword() {
    this.afAuth.auth.sendPasswordResetEmail(this.data.email).then(res => {
      this.snackbarService.openSnackbar('Password reset email sent');
    }).catch(() => {
      this.snackbarService.error();
    });
  }

  reauth() {
    var user = this.afAuth.auth.currentUser;
    var credential = auth.EmailAuthProvider.credential(this.data.email, this.reauthPassword.value.trim());
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(res => {
      this.isReauthenticated = true;
    }).catch(() => {
      this.snackbarService.error();
    });
  }

  private updateEmailCol(user: firebase.User) {
    this.afs.collection('users').doc(user.uid).update({
      email: this.email.value.toLowerCase().trim()
    });
    this.afs.collection('emails').doc(user.uid).update({
      email: this.email.value.toLowerCase().trim()
    });
  }

  private updateEmail() {
    var user = this.afAuth.auth.currentUser;
    return new Promise(resolve => {
      resolve(user.updateEmail(this.email.value.trim().toLowerCase()).then(res => {
        this.updateEmailCol(user);
        return true;
      }).catch(err => {
        return err.code;
      }))
    });
  }

  async update() {
    if(this.emailForm.valid) {
      const success = await this.updateEmail();
      this.dialogRef.close(success);
    }
  }

  getReauthPasswordErrorMessage() {
    return this.reauthPassword.hasError('required') ? 'Enter a password' : '';
  }
  getEmailErrorMessage() { 
    return this.email.hasError('required') ? 'Enter an email address' : this.email.hasError('email') ? 'Enter a valid email' : this.email.hasError('emailTaken') ? this.email.value + ' has already been taken'
    : this.email.hasError('emailInvalid') ? 'Value must differ from current email address' : ''; 
  }
  get reauthPassword() { return this.reauthForm.get('reauthPassword'); }
  get email() { return this.emailForm.get('email'); }
}
