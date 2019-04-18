import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ColorService } from './color.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs: AngularFirestore, private auth: AuthService, private router: Router, private color: ColorService, private storage: AngularFireStorage) {}

  muteChat(chatId: string) {
    const uid  = this.auth.getUserUid();

    const ref = this.afs.collection('users').doc(uid);
    ref.update({
      muted: firestore.FieldValue.arrayUnion(chatId)
    });
  }

  unmuteChat(chatId: string) {
    const uid  = this.auth.getUserUid();

    const ref = this.afs.collection('users').doc(uid);
    ref.update({
      muted: firestore.FieldValue.arrayRemove(chatId)
    });
  }

  deleteMessage(chat, msg) {
    if(chat.messages.length <= 0) return;
    const uid  = this.auth.getUserUid();
    if (msg.uid === uid) {
      const index = chat.messages.indexOf(msg);
      const length = chat.messages.length;
      if(length == 2) {
        this.deleteAndUpdate(chat, msg, chat.messages[0]);
      } else if (length > 2) {
        this.deleteAndUpdate(chat, msg, chat.messages[index - 1]);
      }
    }
  }

  private deleteAndUpdate(chat, msg, lastMessage) {
    const ref = this.afs.collection('chats').doc(chat.id);
    delete msg.user;

    var content: string;
    if(lastMessage.type == 'image') content = 'Picture' 
    else content = lastMessage.content

    if(msg.type == 'image') this.deleteImage(msg.storageUrl);

    return ref.update({
      messages: firestore.FieldValue.arrayRemove(msg),
      lastMessage: lastMessage.createdAt,
      lastMessage_str: content,
      lastMessage_uid: lastMessage.uid,
    });
  }

  deleteImage(storageUrl: string) {
    this.storage.ref(storageUrl).delete();
  }

  addNewMembers(chatId: string, uids: [string]) {
    uids.forEach(uid => {
      return this.afs.collection<any>('chats').doc(chatId).update({
        uid: firestore.FieldValue.arrayUnion(uid)
      });
    });
  }

  getChat(chatId: string) {
    return this.afs.collection<any>('chats').doc(chatId).snapshotChanges().pipe(
      map(doc => {
        return { id: doc.payload.id, ...doc.payload.data() };
      })
    );
  }

  getAllUsers(uids: [string]) {
    return this.afs.collection<User>('users').valueChanges().pipe(
      map(users => {
        return users.filter(user => uids.includes(user.uid) == false)
      })
    );
  }

  getUserChats() {
    return this.auth.user$.pipe(
      switchMap(user => {
        if(user == null) {
          return of(null);
        } else {
          return this.afs
          .collection('chats', ref => ref.where('uid', 'array-contains', user.uid).orderBy('lastMessage', 'desc'))
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                const data: Object = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
        }
      })
    );
  }

  async createChat(chatName: string) {
    const uid  = this.auth.getUserUid();
    const now = Date.now();
    const message = {
      type: 'system',
      content: 'Conversation with ' + chatName,
      createdAt: now,
      uid: 'system'
    }
    const data = {
      uid: [uid],
      name: chatName,
      createdAt: now,
      lastMessage: now,
      lastMessage_str: 'Conversation with ' + chatName,
      lastMessage_uid: 'system',
      color: this.color.randomColor(),
      messages: [message]
    };

    const docRef = await this.afs.collection('chats').add(data);
    return docRef.id;
  }

  sendImage(chatId, file) {
    const uid  = this.auth.getUserUid();
    const now = Date.now();

    var data = {
      uid,
      content: 'LOADING_IMAGE_URL',
      createdAt: now,
      type: 'image',
      storageUrl: null
    };
    
    if(uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        lastMessage: now,
        lastMessage_str: 'Picture',
        lastMessage_uid: uid,
        messages: firestore.FieldValue.arrayUnion(data)
      }).then(() => {
        var filePath = 'images/' + uid + '_' + chatId + '_' + file.name + '_' + now;
        var metaData = {
          customMetadata: {
            'uid': uid
          }
        }
        return this.storage.ref(filePath).put(file, metaData).then(fileSnapshot => {
          return fileSnapshot.ref.getDownloadURL().then(url => {
            return ref.update({
              messages: firestore.FieldValue.arrayRemove(data)
            }).then(() => {
              data.content = url;
              data.storageUrl = fileSnapshot.metadata.fullPath
              return ref.update({
                messages: firestore.FieldValue.arrayUnion(data)
              });
            });
          })
        })
      })
    }
  }

  sendMessage(chatId, content) {
    const uid  = this.auth.getUserUid();
    const now = Date.now();

    const data = {
      uid,
      content,
      createdAt: now,
      type: 'message'
    };

    if(uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        lastMessage: now,
        lastMessage_str: data.content,
        lastMessage_uid: uid,
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  leaveChat(chatId: string) {
    const uid  = this.auth.getUserUid();

    const ref = this.afs.collection('chats').doc(chatId);
    ref.update({
      uid: firestore.FieldValue.arrayRemove(uid)
    });
  }

  /*joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};
  
    return chat$.pipe(
      switchMap(c => {
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));
        
        var index = uids.indexOf('system');
        if(index > -1) {
          uids.splice(index, 1);
        }
        
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );
  
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });
  
        return chat;
      })
    );
  }*/

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};
  
    return chat$.pipe(
      switchMap(c => {
        chat = c;
        
        const uids = Array.from(new Set(c.uid.map(v => v)));
        
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });
        chat.users = chat.uid.map(v => {
          return joinKeys[v]
        });
        
        return chat;
      })
    );
  }
}
