interface User {
    password?: string;
    email: string;
    username?: string;
    name?: string;
    surname?: string;
    id?: string;
    role?: number;
}

interface UserRegistered extends User {
    userId: number
}


interface ContactInfo {
    tg?: string;
    whatsapp?: string;
    phonePrimary?: string;
    phoneSecondary?: string;

}