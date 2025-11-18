import { type User } from '@capacitor-firebase/authentication';
export declare function useAuth(): {
    user: import("vue").Ref<{
        displayName: string | null;
        email: string | null;
        emailVerified: boolean;
        isAnonymous: boolean;
        metadata: {
            creationTime?: number | undefined;
            lastSignInTime?: number | undefined;
        };
        phoneNumber: string | null;
        photoUrl: string | null;
        providerData: {
            displayName: string | null;
            email: string | null;
            phoneNumber: string | null;
            photoUrl: string | null;
            providerId: string;
            uid: string;
        }[];
        providerId: string;
        tenantId: string | null;
        uid: string;
    } | null, User | {
        displayName: string | null;
        email: string | null;
        emailVerified: boolean;
        isAnonymous: boolean;
        metadata: {
            creationTime?: number | undefined;
            lastSignInTime?: number | undefined;
        };
        phoneNumber: string | null;
        photoUrl: string | null;
        providerData: {
            displayName: string | null;
            email: string | null;
            phoneNumber: string | null;
            photoUrl: string | null;
            providerId: string;
            uid: string;
        }[];
        providerId: string;
        tenantId: string | null;
        uid: string;
    } | null>;
    googleSignIn: () => Promise<void>;
    signOut: () => Promise<void>;
};
