import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: any;
                username: any;
                name: any;
                role: any;
            };
        };
    }>;
    validateToken(token: string): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
}
