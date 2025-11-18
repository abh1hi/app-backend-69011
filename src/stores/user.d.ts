import { type User } from 'firebase/auth';
export declare const useUserStore: import("pinia").StoreDefinition<"user", Pick<{
    user: import("vue").Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    listenForAuthStateChanges: () => void;
    stopListeningForAuthStateChanges: () => void;
    logout: () => Promise<void>;
}, "user" | "loading">, Pick<{
    user: import("vue").Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    listenForAuthStateChanges: () => void;
    stopListeningForAuthStateChanges: () => void;
    logout: () => Promise<void>;
}, never>, Pick<{
    user: import("vue").Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string | undefined;
            readonly lastSignInTime?: string | undefined;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean | undefined) => Promise<import("@firebase/auth").IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    listenForAuthStateChanges: () => void;
    stopListeningForAuthStateChanges: () => void;
    logout: () => Promise<void>;
}, "listenForAuthStateChanges" | "stopListeningForAuthStateChanges" | "logout">>;
