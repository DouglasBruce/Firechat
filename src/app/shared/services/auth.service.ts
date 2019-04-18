import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { switchMap, first, tap, startWith } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { ColorService } from './color.service';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  isSingleton: boolean = false;
  intervalId_Global;
  localStorageName: string = 'firechat_user';

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private snackbarService: SnackbarService, private router: Router, private colorService: ColorService) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          var emailVerified = user.emailVerified;
          if(emailVerified === false && this.isSingleton === false) {
            this.isSingleton = true;
            var intervalId = setInterval(function(afAuth: AngularFireAuth, updateUserEmailVerification, afs: AngularFirestore) {
              afAuth.auth.currentUser.reload().then(() => {
                var currentUser = afAuth.auth.currentUser;
                emailVerified = currentUser.emailVerified;
                if(emailVerified === true) {
                  this.singleton = false;
                  updateUserEmailVerification(afs, currentUser.uid, emailVerified);
                  clearInterval(intervalId);
                }
              });
            }, 2000, this.afAuth, this.updateUserEmailVerification, this.afs);
            this.intervalId_Global = intervalId;
          }
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          localStorage.setItem(this.localStorageName, null);
          if (this.isSingleton === true) {
            clearInterval(this.intervalId_Global);
            this.isSingleton = false;
          }
          return of(null);
        }
      }),
      tap(user => localStorage.setItem(this.localStorageName, JSON.stringify(user))),
      startWith(JSON.parse(localStorage.getItem(this.localStorageName)))
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getUserUid() {
    return this.afAuth.auth.currentUser.uid;
  }

  getUserName() {
    return this.afAuth.auth.currentUser.displayName;
  }

  saveUserDataToLocalStorage(userData: User) {
    localStorage.setItem(this.localStorageName, JSON.stringify(userData));
  }

  private updateUserEmailVerification(afs: AngularFirestore, userId: string, emailVerified: boolean) {
    const docRef = afs.collection('users').doc(userId);
    docRef.update({
      emailVerified: emailVerified
    });
    location.reload();
  }

  sendPasswordReset(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
    .then(() => {
      this.snackbarService.openSnackbar("Password reset email sent");
    })
    .catch(err => {
      if(err.code == 'auth/user-not-found') {
        this.snackbarService.openSnackbar("Couldn't find your Firechat Account");
      } else {
        this.snackbarService.error();
      }
    });
  }

  sendEmailVerification() {
    this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.snackbarService.openSnackbar("Email verification sent");
    })
    .catch(() => {
      this.snackbarService.error();
    })
  }

  updateUserProfile(displayName: string, photoURL: string) {
    return new Promise(resolve => {
      resolve(this.afAuth.auth.currentUser.updateProfile({
        displayName: displayName,
        photoURL: photoURL
      }));
    });
  }

  addUserToPublicRoom(uid: string) {
    this.afs.collection('chats').doc('MYOkm98CRH1zy0HhgAge').update({
      uid: firestore.FieldValue.arrayUnion(uid)
    });
  }

  signUp(email: string, password: string, displayName: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(async res => {
      await this.updateUserProfile(displayName, null);
      const data: User = {
        email: email,
        displayName: displayName,
        photoURL: null,
        photoPath: null,
        uid: res.user.uid,
        color: this.colorService.randomColor(),
        lastUpdated: Date.now(),
        emailVerified: false,
        muted: []
      }
      this.afs.collection('users').doc(res.user.uid).set(data);
      this.afs.collection('emails').doc(res.user.uid).set({email: email});
      this.afs.collection('displayNames').doc(res.user.uid).set({displayName: displayName.toLowerCase()});
      this.addUserToPublicRoom(res.user.uid);
      this.sendEmailVerification();
      this.saveUserDataToLocalStorage(data);
      this.router.navigate(['messages']);
    })
    .catch(() => {
      this.snackbarService.error();
    });
  }

  signIn(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(res => {
      const data: User = {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        photoURL: res.user.photoURL
      }
      this.saveUserDataToLocalStorage(data);
      this.router.navigate(['messages']);
    })
    .catch(err => {
      console.log(err.code);
      if(err.code === 'auth/wrong-password') {
        this.snackbarService.openSnackbar("Wrong password. Try again or click Forgot password to reset it");
      } else {
        this.snackbarService.error();
      }
    });
  }

  signOut() {
    this.afAuth.auth.signOut()
    .then(() => {
      localStorage.removeItem(this.localStorageName);
      this.router.navigate(['sign-in']);
    })
    .catch(() => {
      this.snackbarService.error();
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem(this.localStorageName));
    return (user !== null) ? true : false;
  }

  get isVerified(): boolean {
    const user = JSON.parse(localStorage.getItem(this.localStorageName));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
}
