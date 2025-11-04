import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAttendanceDto: CreateAttendanceDto, userId: number): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    findAll(): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    findOne(id: number): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    remove(id: number): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    findByUserId(userId: number): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    summarizeAttendance(userId: number): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            user_id: number;
            month: string;
            attendance_summary: {
                hadir: number;
                izin: number;
                sakit: number;
                alpa: number;
            };
        };
    }>;
    analyzeAttendance(startDate: string, endDate: string, groupByJabatan?: string): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            analysis_period: {
                start_date: string;
                end_date: string;
                filtered_by_jabatan: string;
            };
            grouped_analysis: {
                group: string;
                total_users: any;
                attendance_rate: {
                    hadir_percentage: string;
                    izin_percentage: string;
                    sakit_percentage: string;
                    alpha_percentage: string;
                };
                total_attendance: {
                    hadir: any;
                    izin: any;
                    sakit: any;
                    alpha: any;
                    total: unknown;
                };
            }[];
        };
    }>;
}
