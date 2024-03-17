interface User {
    password: string; // хешированный пароль
    email: string;
    username?: string; // Необязательные поля
    name?: string;
    surname?: string;
}

interface UserRegistered extends User {
    userId: number
}