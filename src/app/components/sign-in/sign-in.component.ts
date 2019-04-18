import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  emailForm: FormGroup;
  passwordForm: FormGroup;
  hasEmailBeenEntered: boolean = false;
  isPassVis: boolean = false;
  isProgressBar: boolean = false;

  constructor(private titleService: Title, private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.titleService.setTitle("Sign in - Firechat Accounts");
    this.emailForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
    this.passwordForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  clearInputs() {
    this.email.setValue('');
    this.emailForm.markAsUntouched();
    this.emailForm.markAsPristine();
    this.password.setValue('');
    this.passwordForm.markAsPristine();
    this.passwordForm.markAsUntouched();
  }

  resetForm() {
    this.hasEmailBeenEntered = false;
    this.clearInputs();
  }

  next() {
    if(this.emailForm.valid) {
      this.email.setValue(this.email.value.trim().toLowerCase());
      this.hasEmailBeenEntered = true;
    }
  }

  forgotPassword() {
    this.auth.sendPasswordReset(this.email.value);
  }

  signIn() {
    if(this.passwordForm.valid) {
      this.isProgressBar = true;
      this.auth.signIn(this.email.value, this.password.value.trim());
      setTimeout(() => { this.isProgressBar = false; }, 500);
    }
  }

  signUp() {
    this.router.navigate(['sign-up']);
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Enter an email address' : this.email.hasError('email') ? 'Enter a valid email' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Enter a password' : '';
  }

  get email() { return this.emailForm.get('email'); }
  get password() { return this.passwordForm.get('password'); }

}