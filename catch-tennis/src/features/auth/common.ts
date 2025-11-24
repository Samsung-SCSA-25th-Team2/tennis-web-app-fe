export interface UserStatus {
    authenticated: boolean
    userId: number
    provider: string
    providerId: string
    name: string
    imageUrl: string
    isProfileComplete: boolean
    message: string
    loginUrl: string
}