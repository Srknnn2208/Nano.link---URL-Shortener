export interface User {
    id: string;
    username: string;
}

export interface ShortenRequest {
    longUrl: string;
    customCode?: string;
    expiryDate?: string;
    userId: string;
}

export interface ShortenResponse {
    shortUrl: string;
    shortCode: string;
    qrCodeBase64: string;
    clicks: number;
}

export interface ActivityLog {
    id: string;
    shortCode: string;
    longUrl: string;
    clicks: number;
    expiryDate: string;
    isActive: boolean;
    userId?: string;
}
