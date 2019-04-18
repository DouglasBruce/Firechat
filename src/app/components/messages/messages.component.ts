import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from "../../shared/services/theme.service";
import { ChatService } from '../../shared/services/chat.service';
import { CreateChatDialogComponent } from 'src/app/shared/dialogs/create-chat-dialog/create-chat-dialog.component';
import { Title } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DeleteMessageDialogComponent } from 'src/app/shared/dialogs/delete-message-dialog/delete-message-dialog.component';
import { DetailsDialogComponent } from 'src/app/shared/dialogs/details-dialog/details-dialog.component';
import { ImageDialogComponent } from 'src/app/shared/dialogs/image-dialog/image-dialog.component';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  selectedUsers;
  selectedUsersUid;
  usersUidInChat;
  activeElement: HTMLElement;
  trigger: number = 0;
  lastScrollTopPos: number = 0;
  newMsg: string;
  userFilter: string;
  chatActiveClass: string = 'chatActive';
  shadowClass: string = 'HDgBue';
  screenChangerClass: string = 'GcJF5e';
  showSpinner: Boolean = true;
  hasChatBeenSelected: boolean = false;
  isAddingPeople: boolean = false;
  isFabExtended: boolean = true;
  sub: Subscription;
  userChats$: Observable<any>;
  chat$: Observable<any>;
  allUsers$: Observable<any>;
  filteredUsers$: Observable<any>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  
  constructor(private breakpointObserver: BreakpointObserver, private titleService: Title, public cs: ChatService, public theme: ThemeService, private renderer2: Renderer2, private snackbarService: SnackbarService, public authService: AuthService, private router: Router, private elem: ElementRef, private dialog: MatDialog, private dialogService: DialogService) { }

  ngOnInit() {
    setInterval(() => this.trigger = Math.random(), 60000);
    this.titleService.setTitle("Firechat - Messages");
    this.userChats$ = this.cs.getUserChats();
    this.sub = this.userChats$.subscribe(() => this.showSpinner = false);
    setInterval(this.calculateChatRoomHeight, 3000, this.elem);
    this.selectedUsers = [];
    this.selectedUsersUid = [];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(newValue: string) {
    if(newValue.length == 0) {
      this.filteredUsers$ = this.allUsers$;
      return;
    }
    this.filteredUsers$ = this.allUsers$.pipe(
      map(users => {
        return users.filter(user => user.displayName.toLowerCase().indexOf(newValue.toLowerCase()) > -1)
      })
    );
  }

  isSelected(uid: string) {
    if (this.selectedUsersUid.length <= 0) return false;
    if (this.selectedUsersUid.includes(uid)) return true;
    else return false;
  }

  toggleSelected(uid: string, displayName: string) {
    const user = {
      uid: uid,
      displayName: displayName
    }
    if(this.selectedUsersUid.includes(uid)) {
      this.removeSelectedUser(user);
    } else {
      this.selectedUsersUid.push(uid);
      this.selectedUsers.push(user)
    }
  }

  removeSelectedUser(user: {uid: string, displayName: string}) {
    var index = this.selectedUsers.indexOf(user);
    this.selectedUsers.splice(index,1);
    index = this.selectedUsersUid.indexOf(user.uid);
    this.selectedUsersUid.splice(index,1);
  }

  calculateChatRoomHeight(elem: ElementRef) {
    var outerHeight = 62;
    var elements = elem.nativeElement.getElementsByClassName("boPWvd");
    for(var i = 0; i < elements.length; i++) {
      outerHeight += elements[i].clientHeight;
      outerHeight += parseInt(getComputedStyle(elements[i]).marginTop);
    }
    var element = document.getElementById('messageList');
    if (element) {
      var paddingElem = document.getElementById('padding');
      outerHeight += parseInt(getComputedStyle(paddingElem).paddingBottom);
      element.style.minHeight = outerHeight + 'px';
    }
  }

  trackByFn(index, item) {
    return index;
  }

  selectChat(chatId: string, event, uids: [string]) {
    if(event.target.tagName.toLowerCase() === 'svg' || event.target.tagName.toLowerCase() === 'path') return;
    this.getSource(chatId);
    this.usersUidInChat = uids;
    this.generateUsers();
    this.backToChat(chatId);
    this.removeActiveClass();
    this.renderer2.addClass(event.currentTarget, this.chatActiveClass);
    this.activeElement = event.currentTarget;
    this.removeScreenChanger();
  }

  getSource(chatId: string) {
    const source = this.cs.getChat(chatId);
    this.chat$ = this.cs.joinUsers(source);
    this.hasChatBeenSelected = true;
  }

  generateUsers() {
    this.allUsers$ = this.cs.getAllUsers(this.usersUidInChat);
    this.filteredUsers$ = this.allUsers$;
  }

  addNewMembers(chatId, uids: [string]) {
    this.usersUidInChat = uids;
    if(this.selectedUsersUid.length == 0) return;
    this.cs.addNewMembers(chatId, this.selectedUsersUid);
    this.selectedUsersUid.map(uid => {
      if(this.usersUidInChat.indexOf(uid) == -1) this.usersUidInChat.push(uid);
    });
    this.generateUsers();
    this.backToChat(chatId);
  }

  resetSelectedUsersArrays() {
    this.selectedUsers = [];
    this.selectedUsersUid = [];
  }

  removeActiveClass() {
    if(this.activeElement != null) {
      this.renderer2.removeClass(this.activeElement, this.chatActiveClass)
    }
  }

  removeScreenChanger() {
    var elem = document.getElementById('screenChanger');
    this.renderer2.removeClass(elem, this.screenChangerClass);
  }

  selectNewChat(chatId: string, uids: [string]) {
    this.getSource(chatId);
    this.usersUidInChat = uids;
    this.generateUsers();
    this.removeScreenChanger();
    this.removeActiveClass();
    let elem = document.getElementById(chatId);
    this.renderer2.addClass(elem, this.chatActiveClass);
    this.activeElement = elem;
    this.addPeople(chatId, uids);
  }

  isMuted(chatId: string, muted: [string]) {
    if (muted.length <= 0) return false;
    if (muted.includes(chatId)) return true;
    else return false;
  }

  scroll() {
    var elem = document.getElementById('startChatButton');
    var offset = document.getElementById('chatRoomList').scrollTop;
    if(offset > 0) {
      this.renderer2.addClass(elem, this.shadowClass);
    } else {
      this.renderer2.removeClass(elem, this.shadowClass);
    }
    if(offset > this.lastScrollTopPos) {
      this.isFabExtended = false;
    } else {
      this.isFabExtended = true;
    }
    this.lastScrollTopPos = offset <= 0 ? 0 : offset; // For mobile or negative scrolling
  }

  toggleMute(chatId: string, muted: [string]) {
    if(this.isMuted(chatId, muted)) {
      this.cs.unmuteChat(chatId);
    } else {
      this.cs.muteChat(chatId);
    }
  }

  toggleDarkTheme() {
    this.theme.toggleTheme(this.renderer2);
  }

  settings() {
    this.router.navigate(['/settings']);
  }

  back() {
    var elem = document.getElementById('screenChanger');
    this.renderer2.addClass(elem, this.screenChangerClass);
    this.resetChat();
  }

  backToChat(chatId: string) {
    var elem = document.getElementById('conversation_' + chatId);
    if(elem) elem.style.display = 'flex';
    this.resetSelectedUsersArrays();
    this.userFilter = '';
    this.isAddingPeople = false;
  }

  leaveChat(chatId: string) {
    this.cs.leaveChat(chatId);
    this.resetChat();
  }

  resetChat() {
    this.removeActiveClass();
    this.hasChatBeenSelected = false;
    this.isAddingPeople = false;
    this.chat$ = null;
    this.activeElement = null;
  }

  addPeople(chatId, uids: [string]) {
    var elem = document.getElementById('conversation_' + chatId);
    if (elem) {
      elem.style.display = 'none';
    } else {
      setTimeout(() => { this.addPeople(chatId, uids); }, 150);
    }
    this.usersUidInChat = uids;
    this.generateUsers();
    this.isAddingPeople = true;
  }

  copyText(msg: string) {
    var textarea = document.createElement('textarea');
    textarea.textContent = msg;
    document.body.appendChild(textarea);
    
    var selection = document.getSelection();
    var range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);
    if(document.execCommand('copy')) {
      this.snackbarService.openSnackbar('Message copied');
    }
    selection.removeAllRanges();
    document.body.removeChild(textarea);
  }

  toggleTime(event) {
    if(event.target.tagName.toLowerCase() === 'svg' || event.target.tagName.toLowerCase() === 'path' || event.target.id == 'image') return;
    var elem = event.currentTarget.querySelector('.XFumA');
    if(getComputedStyle(elem).height == '20px') {
      elem.style.height = '0';
      elem.style.opacity = '0';
      elem.style.marginBottom = '0';
    } else {
      elem.style.height = '20px';
      elem.style.opacity = '1';
      elem.style.marginBottom = '2px';
    }
  }

  handleUpload(event, chatId: string) {
    event.preventDefault();
    var file = event.target.files[0];
    
    if(file == undefined || file == null) return;

    if (!file.type.match('image.*')) {
      this.snackbarService.openSnackbar("Unsupported file type. Please select an image");
      return;
    }

    this.cs.sendImage(chatId, file);
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.click();
  }

  submit(event, chatId: string) {
    event.preventDefault();
    if (!this.newMsg) {
      return;
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  create() {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig = this.dialogService.getDialogConfig(matDialogConfig);
    let dialogRef = this.dialog.open(CreateChatDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res != undefined && res != null && res != '') {
        this.selectNewChat(res, [this.authService.getUserUid()]);
      }
    });
  }

  enlargeImage(url: string, displayName: string, time) {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig = this.dialogService.getImageDialogConfig(matDialogConfig);
    matDialogConfig.data = {url: url, displayName: displayName, time: time};
    this.dialog.open(ImageDialogComponent, matDialogConfig);
  }

  deleteMessage(chat, msg) {
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig = this.dialogService.getDialogConfig(matDialogConfig);
    matDialogConfig.data = {chat: chat, msg: msg};
    this.dialog.open(DeleteMessageDialogComponent, matDialogConfig);
  }

  details(chat, muted, uid) {
    let clientHeight = document.documentElement.clientHeight;
    var matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig = this.dialogService.getDialogConfig(matDialogConfig);
    if((clientHeight / 100) * 90 > 1001) {
      matDialogConfig.maxHeight = '1001px';
      matDialogConfig.id = 'detailsMax'
    } else {
      matDialogConfig.maxHeight = 'calc(90%)';
      matDialogConfig.id = 'details'
    }
    matDialogConfig.data = {chat: chat, muted: muted, uid: uid};
    let dialogRef = this.dialog.open(DetailsDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      switch (res) {
        case 'add':
          this.addPeople(chat.id, chat.uid);
          break;
        case 'leave':
          this.leaveChat(chat.id);
          break;
      }
    });
  }
}
