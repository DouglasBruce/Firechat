import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFirestoreModule, FirestoreSettingsToken } from "@angular/fire/firestore";

import { environment } from 'src/environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignNavComponent } from './components/sign-nav/sign-nav.component';
import { VerifyNavComponent } from './components/verify-nav/verify-nav.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ThemeService } from './shared/services/theme.service';
import { DateConvertorPipe } from './shared/dateConvertor';
import { lastUpdatedConvertorPipe } from './shared/lastUpdatedConvertor';
import { smsDateConvertorPipe } from './shared/smsDateConvertor';
import { SettingsNavComponent } from './components/settings-nav/settings-nav.component';
import { DisplayNameDialogComponent } from './shared/dialogs/display-name-dialog/display-name-dialog.component';
import { EmailDialogComponent } from './shared/dialogs/email-dialog/email-dialog.component';
import { PasswordDialogComponent } from './shared/dialogs/password-dialog/password-dialog.component';
import { PhotoDialogComponent } from './shared/dialogs/photo-dialog/photo-dialog.component';
import { ColorDialogComponent } from './shared/dialogs/color-dialog/color-dialog.component';
import { CreateChatDialogComponent } from './shared/dialogs/create-chat-dialog/create-chat-dialog.component';
import { ChatColorDialogComponent } from './shared/dialogs/chat-color-dialog/chat-color-dialog.component';
import { ChatNameDialogComponent } from './shared/dialogs/chat-name-dialog/chat-name-dialog.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DeleteMessageDialogComponent } from './shared/dialogs/delete-message-dialog/delete-message-dialog.component';
import { DetailsDialogComponent } from './shared/dialogs/details-dialog/details-dialog.component';
import { ImageDialogComponent } from './shared/dialogs/image-dialog/image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    SignNavComponent,
    VerifyNavComponent,
    VerifyEmailComponent,
    SettingsComponent,
    DateConvertorPipe,
    lastUpdatedConvertorPipe,
    smsDateConvertorPipe,
    SettingsNavComponent,
    DisplayNameDialogComponent,
    EmailDialogComponent,
    PasswordDialogComponent,
    PhotoDialogComponent,
    ColorDialogComponent,
    CreateChatDialogComponent,
    ChatColorDialogComponent,
    ChatNameDialogComponent,
    MessagesComponent,
    DeleteMessageDialogComponent,
    DetailsDialogComponent,
    ImageDialogComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
    { provide: FirestoreSettingsToken, useValue: {} },
    ThemeService
  ],
  entryComponents: [
    DisplayNameDialogComponent,
    EmailDialogComponent,
    PasswordDialogComponent,
    PhotoDialogComponent,
    ColorDialogComponent,
    CreateChatDialogComponent,
    ChatColorDialogComponent,
    ChatNameDialogComponent,
    DeleteMessageDialogComponent,
    DetailsDialogComponent,
    ImageDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
