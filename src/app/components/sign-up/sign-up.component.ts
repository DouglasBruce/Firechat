import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { CustomValidator } from '../../shared/custom-validator';
import { CustomErrorStateMatcher } from '../../shared/custom-error-state-matcher';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  isPassVis: boolean = false;
  isProgressBar: boolean = false;
  matcher: CustomErrorStateMatcher;

  constructor(private titleService: Title, private fb: FormBuilder, private router: Router, private afs: AngularFirestore, private auth: AuthService) {}

  ngOnInit() {
    this.matcher = new CustomErrorStateMatcher();
    this.titleService.setTitle("Create your Firechat Account");
    this.signUpForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(4)], CustomValidator.displayName(this.afs)],
      email: ['', [Validators.required, Validators.email], CustomValidator.email(this.afs)],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9#?!@$£%^&*-~_]+)$')]],
      confirmPassword: ['', Validators.required]
    }, { validators: CustomValidator.passwordMatchValidator });
  }

  next() {
    if(this.signUpForm.valid) {
      this.isProgressBar = true;
      this.auth.signUp(this.email.value.trim().toLowerCase(), this.password.value.trim(), this.displayName.value.trim());
      setTimeout(() => { this.isProgressBar = false; }, 500);
    }
  }

  signIn() {
    this.router.navigate(['sign-in']);
  }

  getDisplayNameErrorMessage() {
    return this.displayName.hasError('required') ? 'Enter a username' : this.displayName.hasError('minlength') ? 'Use 4 characters or more for your username' : this.displayName.hasError('displayNameTaken') ? this.displayName.value + ' has already been taken' : '';
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Enter an email address' : this.email.hasError('email') ? 'Enter a valid email' : this.email.hasError('emailTaken') ? this.email.value + ' has already been taken' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Enter a password' : this.password.hasError('minlength') ? 'Use 8 characters or more for your password' : this.password.hasError('pattern') ? 'Must contain at least one letter and one number' : '';
  }

  getConfirmPasswordErrorMessage() {
    return this.confirmPassword.hasError('required') ? 'Confirm your password' : this.confirmPassword.hasError('mismatch') ? 'Those passwords don\'t match. Try again' : '';
  }

  get displayName() { return this.signUpForm.get('displayName'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }

}
