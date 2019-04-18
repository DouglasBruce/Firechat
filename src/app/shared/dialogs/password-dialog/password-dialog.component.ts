import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from "firebase/app";
import { SnackbarService } from '../../services/snackbar.service';
import { CustomValidator } from '../../custom-validator';
import { DateService } from '../../services/date.service';
import { CustomErrorStateMatcher } from '../../custom-error-state-matcher';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  reauthForm: FormGroup;
  passwordForm: FormGroup;
  matcher: CustomErrorStateMatcher;
  isAuthPassVis: boolean = false;
  isPassVis: boolean = false;
  isConPassVis: boolean = false;
  isReauthenticated: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<PasswordDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private fb: FormBuilder, private afAuth: AngularFireAuth, private afs: AngularFirestore, private snackbarService: SnackbarService, private dateService: DateService) {}

  ngOnInit() {
    this.matcher = new CustomErrorStateMatcher();
    this.reauthForm = this.fb.group({
      reauthPassword: ['', [
        Validators.required
      ]]
    });

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9#?!@$£%^&*-~_]+)$')]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: CustomValidator.passwordMatchValidator });
  }

  forgotPassword() {
    this.afAuth.auth.sendPasswordResetEmail(this.data.email).then(res => {
      this.snackbarService.openSnackbar('Password reset email sent');
    }).catch(err => {
      this.snackbarService.error();
    });
  }

  reauth() {
    var user = this.afAuth.auth.currentUser;
    var credential = auth.EmailAuthProvider.credential(this.data.email, this.reauthPassword.value.trim());
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(res => {
      this.isReauthenticated = true;
    }).catch(err => {
      this.snackbarService.error();
    });
  }

  private updateLastChanged(user: firebase.User) {
    this.afs.collection('users').doc(user.uid).update({
      lastUpdated: Date.now()
    });
  }

  private updatePassword() {
    var user = this.afAuth.auth.currentUser;
    return new Promise(resolve => {
      resolve(user.updatePassword(this.password.value.trim()).then(res => {
        this.updateLastChanged(user);
        return true;
      }).catch(err => {
        return err.code;
      }))
    });
  }

  async update() {
    if(this.passwordForm.valid) {
      const success = await this.updatePassword();
      this.dialogRef.close(success);
    }
  }

  getReauthPasswordErrorMessage() {
    return this.reauthPassword.hasError('required') ? 'Enter a password' : '';
  }
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Enter a password' : this.password.hasError('minlength') ? 'Use 8 characters or more for your password' : this.password.hasError('pattern') ? 'Must contain at least one letter and one number' : '';
  }
  getConfirmPasswordErrorMessage() {
    return this.confirmPassword.hasError('required') ? 'Confirm your password' : this.confirmPassword.hasError('mismatch') ? 'Those passwords don\'t match. Try again' : '';
  }
  get reauthPassword() { return this.reauthForm.get('reauthPassword'); }
  get password() { return this.passwordForm.get('password'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}
