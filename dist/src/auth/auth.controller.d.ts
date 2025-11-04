import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
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
}
