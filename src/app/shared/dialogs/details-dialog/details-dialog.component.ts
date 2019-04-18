import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { ChatService } from '../../services/chat.service';
import { DialogService } from '../../services/dialog.service';
import { ChatNameDialogComponent } from '../chat-name-dialog/chat-name-dialog.component';
import { ChatColorDialogComponent } from '../chat-color-dialog/chat-color-dialog.component';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {

  name: string;
  color: string;
  checked: boolean;
  members: [];
  matDialogConfig: MatDialogConfig = new MatDialogConfig();

  constructor(private dialogRef: MatDialogRef<DetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cs: ChatService, private dialogService: DialogService, private dialog: MatDialog) {}

  ngOnInit() {
    this.name = this.data.chat.name;
    this.color = this.data.chat.color;
    this.checked = this.isMuted(this.data.chat.id, this.data.muted);
    this.members = this.data.chat.users;
  }

  isMuted(chatId: string, muted: [string]) {
    if (muted.length <= 0) return false;
    if (muted.includes(chatId)) return true;
    else return false;
  }

  toggleMuted(chatId: string) {
    this.checked = !this.checked;
    if (this.checked) {
      this.cs.muteChat(chatId);
    } else {
      this.cs.unmuteChat(chatId);
    }
  }

  leaveChat() {
    this.dialogRef.close('leave');
  }

  addPeople() {
    this.dialogRef.close('add');
  }

  changeName(chatId: string, chatName: string) {
    this.matDialogConfig = this.dialogService.getConfig();
    this.matDialogConfig.data = {id: chatId, chatName: chatName};
    let dialogRef = this.dialog.open(ChatNameDialogComponent, this.matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res != undefined && res != null && res != '') {
        this.name = res;
      }
    });
  }

  changeColor(chatId: string, chatColor: string) {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {id: chatId, color: chatColor};
    let dialogRef = this.dialog.open(ChatColorDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res != undefined && res != null && res != '') {
        this.color = res;
      }
    });
  }

}
