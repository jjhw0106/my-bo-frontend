export interface User {
    email: string;
    name: string;
    role?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
