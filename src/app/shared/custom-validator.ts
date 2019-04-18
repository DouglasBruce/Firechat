import { AbstractControl, FormGroup } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { debounceTime, take, map } from "rxjs/operators";

export class CustomValidator {
    static passwordMatchValidator(g: FormGroup) {
        let pass = g.controls.password.value;
        let confirmPass = g.controls.confirmPassword.value;

        if(pass != confirmPass && confirmPass.length > 0) {
            g.controls.confirmPassword.setErrors({'mismatch': true});
        }
        return pass === confirmPass ? null : { 'mismatch': true }     
    }

    static newPasswordMatchValidator(g: FormGroup) {
        let pass = g.controls.newPassword.value;
        let confirmPass = g.controls.confirmPassword.value;

        if(pass != confirmPass && confirmPass.length > 0) {
            g.controls.confirmPassword.setErrors({'mismatch': true});
        }
        return pass === confirmPass ? null : { 'mismatch': true }     
    }

    static displayNameChanged(oldDisplayName: string) {
        return(control: AbstractControl) => {
            const displayName = control.value.toLowerCase().trim();

            if(displayName === oldDisplayName.toLowerCase()) {
                return { 'displayNameInvalid': true };
            }
        }
    }

    static chatNameChanged(oldChatName: string) {
        return(control: AbstractControl) => {
            const chatName = control.value.toLowerCase().trim();

            if(chatName === oldChatName.toLowerCase()) {
                return { 'chatNameInvalid': true };
            }
        }
    }

    static displayName(afs: AngularFirestore) {
        return(control: AbstractControl) => {
            const displayName = control.value.toLowerCase().trim();

            return afs.collection('displayNames', ref => ref.where('displayName', '==', displayName)).valueChanges().pipe(
                debounceTime(500),
                take(1),
                map(arr => arr.length ? { 'displayNameTaken': true }: null)
            );
        }
    }

    static emailChanged(oldEmail: string) {
        return(control: AbstractControl) => {
            const email = control.value.toLowerCase().trim();

            if(email === oldEmail.toLowerCase()) {
                return { 'emailInvalid': true }
            }
        }
    }

    static email(afs: AngularFirestore) {
        return(control: AbstractControl) => {
            const email = control.value.toLowerCase().trim();

            return afs.collection('emails', ref => ref.where('email', '==', email)).valueChanges().pipe(
                debounceTime(500),
                take(1),
                map(arr => arr.length ? { 'emailTaken': true }: null)
            );
        }
    }
}
