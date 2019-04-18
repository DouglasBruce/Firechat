import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomErrorStateMatcher } from '../../custom-error-state-matcher';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-create-chat-dialog',
  templateUrl: './create-chat-dialog.component.html',
  styleUrls: ['./create-chat-dialog.component.scss']
})
export class CreateChatDialogComponent implements OnInit {

    matcher: CustomErrorStateMatcher;
    chatNameForm: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateChatDialogComponent>, private fb: FormBuilder, private cs: ChatService) {}

    ngOnInit() {
        this.matcher = new CustomErrorStateMatcher();
        this.chatNameForm = this.fb.group({
            chatName: ['', [Validators.required]]
        });
    }

    async update() {
        if(this.chatNameForm.valid) {
            let chatId =  await this.cs.createChat(this.chatName.value.trim());
            this.dialogRef.close(chatId);
        }
    }

    getChatNameErrorMessage() {
        return this.chatName.hasError('required') ? 'Enter a chat room name' : '';
    }
    
    get chatName() { return this.chatNameForm.get('chatName'); }

}
