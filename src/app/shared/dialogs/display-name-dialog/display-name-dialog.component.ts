import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomValidator } from '../../custom-validator';
import { CustomErrorStateMatcher } from '../../custom-error-state-matcher';

@Component({
  selector: 'app-display-name-dialog',
  templateUrl: './display-name-dialog.component.html',
  styleUrls: ['./display-name-dialog.component.scss']
})
export class DisplayNameDialogComponent implements OnInit {

  matcher: CustomErrorStateMatcher;
  displayNameForm: FormGroup;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<DisplayNameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.matcher = new CustomErrorStateMatcher();
    this.displayNameForm = this.fb.group({
      displayName: ['', [
        Validators.required,
        Validators.minLength(4),
        CustomValidator.displayNameChanged(this.data.displayName)
      ], 
      CustomValidator.displayName(this.afs)
    ]
    });
  }

  private updateDisplayNameCol(user: firebase.User) {
    this.afs.collection('users').doc(user.uid).update({
      displayName: this.displayName.value.trim()
    });
    this.afs.collection('displayNames').doc(user.uid).update({
      displayName: this.displayName.value.toLowerCase().trim()
    });
  }

  private updateDisplayName() {
    var user = this.afAuth.auth.currentUser;
    return new Promise(resolve => {
      resolve(user.updateProfile({
        displayName: this.displayName.value.trim(),
        photoURL: null
      }).then(res => {
        this.updateDisplayNameCol(user);
        return true;
      }).catch(err => {
        return false;
      }))
    });
  }

  async update() {
    if(this.displayNameForm.valid) {
      const success = await this.updateDisplayName();
      this.dialogRef.close(success);
    }
  }

  getDisplayNameErrorMessage() {
    return this.displayName.hasError('required') ? 'Enter a username' : this.displayName.hasError('minlength') ? 'Use 4 characters or more for your username' : this.displayName.hasError('displayNameTaken') ? this.displayName.value + ' has already been taken'
    : this.displayName.hasError('displayNameInvalid') ? 'Value must differ from current username' : '';
  }

  get displayName() { return this.displayNameForm.get('displayName'); }

}
