import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from "@angular/fire/firestore";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomErrorStateMatcher } from '../../custom-error-state-matcher';
import { CustomValidator } from '../../custom-validator';

@Component({
  selector: 'app-chat-name-dialog',
  templateUrl: './chat-name-dialog.component.html',
  styleUrls: ['./chat-name-dialog.component.scss']
})
export class ChatNameDialogComponent implements OnInit {

    matcher: CustomErrorStateMatcher;
    chatNameForm: FormGroup;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
        map(result => result.matches)
    );

    constructor(private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<ChatNameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private afs: AngularFirestore, private fb: FormBuilder) {}

    ngOnInit() {
        this.matcher = new CustomErrorStateMatcher();
        this.chatNameForm = this.fb.group({
            chatName: ['', [Validators.required, CustomValidator.chatNameChanged(this.data.chatName)]]
        });
    }

    update() {
        if(this.chatNameForm.valid) {
            this.dialogRef.close(this.chatName.value.trim());
            this.afs.collection('chats').doc(this.data.id).update({
                name: this.chatName.value.trim()
            });
        }
    }

    getChatNameErrorMessage() {
        return this.chatName.hasError('required') ? 'Enter a chat room name' : this.chatName.hasError('chatNameInvalid') ? 'Value must differ from current chat name' : '';
    }
    
    get chatName() { return this.chatNameForm.get('chatName'); }

}
