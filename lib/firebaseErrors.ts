export function getFirebaseErrorMessage(error: unknown): string {
    const errorCode = (error as { code?: string }).code;

    switch (errorCode) {
        case 'auth/invalid-credential':
            return 'Invalid email or password';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
        case 'auth/invalid-login-credentials':
            return 'Incorrect password';
        case 'auth/operation-not-allowed':
            return 'Email/Password login is not enabled in Firebase Console.';
        case 'auth/email-already-in-use':
            return 'Email is already in use. Please use a different email or login.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
}
