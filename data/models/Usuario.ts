export default interface Usuario {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string | Date | null;
    role: string;
}