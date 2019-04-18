import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackbarService } from '../../services/snackbar.service';
import { ColorDialogComponent } from '../color-dialog/color-dialog.component';

@Component({
  selector: 'app-photo-dialog',
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.scss']
})
export class PhotoDialogComponent {

  file: File;
  path: string;
  task: AngularFireUploadTask;

  constructor(private dialogRef: MatDialogRef<PhotoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackbarService: SnackbarService, private afs: AngularFirestore, private storage: AngularFireStorage, private afAuth: AngularFireAuth, private dialog: MatDialog) {}

  startUpload(event: FileList) {
    this.file  = event.item(0);

    if(this.file !== null) {
      if (this.file.type.split('/')[0] !== 'image') {
        this.snackbarService.openSnackbar("Unsupported file type. Please select an image");
        return;
      }

      this.path = `profilePhotos/${this.data.uid}`;
      this.task = this.storage.upload(this.path, this.file);

      this.task.then(() => {
        this.storage.storage.ref(this.path).getDownloadURL().then(url => {
          this.updateUserProfile(url, this.path);
        });
      });
      this.closeDialog();
    }
  }

  private updateUserPhotoPath(downloadURL: string, photoPath: string) {
    this.afs.collection('users').doc(this.data.uid).update({
      photoURL: downloadURL,
      photoPath: photoPath
    });
  }

  private updateUserProfile(downloadURL: string, photoPath: string) {
    var user = this.afAuth.auth.currentUser;
    user.updateProfile({
      displayName: this.data.displayName,
      photoURL: downloadURL
    }).then(() => {
      this.updateUserPhotoPath(downloadURL, photoPath);
    }).catch(() => {
      this.snackbarService.error();
    });
  }

  uploadPhoto() {
    let element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.click();
  }

  removePhoto(photoPath: string) {
    this.storage.storage.ref(photoPath).delete().then(() => {
      this.updateUserProfile(null, null);
    });
    this.closeDialog();
  }

  changeColor(uid: string, color: string) {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.id = 'nonfullscreen2';
    matDialogConfig.data = {uid: uid, color: color};
    this.dialog.open(ColorDialogComponent, matDialogConfig);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
