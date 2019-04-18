import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private titleService: Title, public authService: AuthService) {}

  ngOnInit() {
    this.titleService.setTitle("Verify your Firechat Account");
  }

  resend() {
    this.authService.sendEmailVerification();
  }

}
