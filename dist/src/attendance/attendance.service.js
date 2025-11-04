"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAttendanceDto, userId) {
        const attendance = await this.prisma.attendance.create({
            data: {
                userId: userId,
                status: createAttendanceDto.status,
                date: new Date(),
            },
        });
        return {
            statusCode: 201,
            message: 'Attendance created successfully',
            success: true,
            data: attendance,
        };
    }
    async findAll() {
        const attendances = await this.prisma.attendance.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return {
            statusCode: 200,
            message: 'Attendances retrieved successfully',
            success: true,
            data: attendances,
        };
    }
    async findOne(id) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true,
                    },
                },
            },
        });
        if (!attendance) {
            return {
                statusCode: 404,
                message: 'Attendance not found',
                success: false,
                data: null,
            };
        }
        return {
            statusCode: 200,
            message: 'Attendance retrieved successfully',
            success: true,
            data: attendance,
        };
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.prisma.attendance.update({
            where: { id },
            data: {
                status: updateAttendanceDto.status,
                date: new Date(),
            },
        });
        return {
            statusCode: 200,
            message: 'Attendance updated successfully',
            success: true,
            data: attendance,
        };
    }
    async remove(id) {
        const attendance = await this.prisma.attendance.delete({
            where: { id },
        });
        return {
            statusCode: 200,
            message: 'Attendance deleted successfully',
            success: true,
            data: attendance,
        };
    }
    async findByUserId(userId) {
        const attendances = await this.prisma.attendance.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return {
            statusCode: 200,
            message: 'User attendance history retrieved successfully',
            success: true,
            data: attendances,
        };
    }
    async summarizeAttendance(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const records = await this.prisma.attendance.findMany({
            where: {
                userId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            select: {
                status: true,
            },
        });
        const summary = {
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpa: 0,
        };
        records.forEach((record) => {
            if (record.status !== undefined) {
                summary[record.status] += 1;
            }
        });
        return {
            statusCode: 200,
            message: 'Attendance summary retrieved successfully',
            success: true,
            data: {
                user_id: userId,
                month: `${now.getMonth() + 1}-${now.getFullYear()}`,
                attendance_summary: summary,
            },
        };
    }
    async analyzeAttendance(startDate, endDate, groupByJabatan) {
        const whereClause = {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        };
        if (groupByJabatan) {
            whereClause.user = {
                jabatan: groupByJabatan,
            };
        }
        const attendances = await this.prisma.attendance.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true,
                        jabatan: true,
                    },
                },
            },
        });
        const grouped = attendances.reduce((acc, record) => {
            const jabatan = record.user.jabatan || 'Unknown';
            if (!acc[jabatan]) {
                acc[jabatan] = {
                    totalUsers: new Set(),
                    counts: { hadir: 0, izin: 0, sakit: 0, alpha: 0 },
                };
            }
            acc[jabatan].totalUsers.add(record.userId);
            const status = record.status.toLowerCase();
            if (status === 'hadir')
                acc[jabatan].counts.hadir++;
            else if (status === 'izin')
                acc[jabatan].counts.izin++;
            else if (status === 'sakit')
                acc[jabatan].counts.sakit++;
            else if (status === 'alpha' || status === 'alpa')
                acc[jabatan].counts.alpha++;
            return acc;
        }, {});
        const result = Object.entries(grouped).map(([group, data]) => {
            const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
            return {
                group,
                total_users: data.totalUsers.size,
                attendance_rate: {
                    hadir_percentage: total > 0 ? ((data.counts.hadir / total) * 100).toFixed(2) + '%' : '0%',
                    izin_percentage: total > 0 ? ((data.counts.izin / total) * 100).toFixed(2) + '%' : '0%',
                    sakit_percentage: total > 0 ? ((data.counts.sakit / total) * 100).toFixed(2) + '%' : '0%',
                    alpha_percentage: total > 0 ? ((data.counts.alpha / total) * 100).toFixed(2) + '%' : '0%',
                },
                total_attendance: {
                    hadir: data.counts.hadir,
                    izin: data.counts.izin,
                    sakit: data.counts.sakit,
                    alpha: data.counts.alpha,
                    total: total,
                },
            };
        });
        return {
            statusCode: 200,
            message: 'Attendance analysis completed successfully',
            success: true,
            data: {
                analysis_period: {
                    start_date: startDate,
                    end_date: endDate,
                    filtered_by_jabatan: groupByJabatan || 'All',
                },
                grouped_analysis: result,
            },
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map