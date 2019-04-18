import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat-color-dialog',
  templateUrl: './chat-color-dialog.component.html',
  styleUrls: ['./chat-color-dialog.component.scss']
})
export class ChatColorDialogComponent implements OnInit {

  chosenColor: string;

  constructor(private dialogRef: MatDialogRef<ChatColorDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private afs: AngularFirestore) {}

  ngOnInit() {
    this.chosenColor = this.data.color;
  }

  changeColor(color: string) {
    this.chosenColor = color;
    this.afs.collection('chats').doc(this.data.id).update({
      color: color
    });
    this.dialogRef.close(color);
  }

}
