import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AnalyzeAttendanceDto } from './dto/analyze-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(req: any, createAttendanceDto: CreateAttendanceDto): Promise<{
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
    getMyHistory(req: any): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: any;
    }>;
    getSummary(req: any): Promise<{
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
    analyzeAttendance(analyzeDto: AnalyzeAttendanceDto): Promise<{
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
}
