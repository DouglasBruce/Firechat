import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-delete-message-dialog',
  templateUrl: './delete-message-dialog.component.html',
  styleUrls: ['./delete-message-dialog.component.scss']
})
export class DeleteMessageDialogComponent {

    constructor(private dialogRef: MatDialogRef<DeleteMessageDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private cs: ChatService) {}

    delete() {
      this.cs.deleteMessage(this.data.chat, this.data.msg);
      this.closeDialog();
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
