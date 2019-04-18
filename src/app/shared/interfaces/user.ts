export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    photoPath?: string;
    emailVerified: boolean;
    color?: string;
    lastUpdated?: number;
    muted?: []
}
