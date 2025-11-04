import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) { }
  async create(createAttendanceDto: CreateAttendanceDto, userId: number) {
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

  async findOne(id: number) {
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

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
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

  async remove(id: number) {
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

  async findByUserId(userId: number) {
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

  async summarizeAttendance(userId: number) {
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

  async analyzeAttendance(startDate: string, endDate: string, groupByJabatan?: string) {
    // Build where clause
    const whereClause: any = {
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
      if (status === 'hadir') acc[jabatan].counts.hadir++;
      else if (status === 'izin') acc[jabatan].counts.izin++;
      else if (status === 'sakit') acc[jabatan].counts.sakit++;
      else if (status === 'alpha' || status === 'alpa') acc[jabatan].counts.alpha++;

      return acc;
    }, {} as Record<string, { totalUsers: Set<number>; counts: { hadir: number; izin: number; sakit: number; alpha: number } }>);


    const result = Object.entries(grouped).map(([group, data]) => {
      const total = Object.values(data.counts as Record<string, number>).reduce((a, b) => a + b, 0);
      return {
        group,
        total_users: data.totalUsers.size,
        attendance_rate: {
          hadir_percentage: total > 0 ? (((data.counts.hadir ?? 0) / total) * 100).toFixed(2) + ' %' : '0%',
          izin_percentage: total > 0 ? (((data.counts.izin ?? 0) / total) * 100).toFixed(2) + ' %' : '0%',
          saki_tpercentage: total > 0 ? (((data.counts.sakit ?? 0) / total) * 100).toFixed(2) + ' %' : '0%',
          alpha_percentage: total > 0 ? (((data.counts.alpha ?? 0) / total) * 100).toFixed(2) + ' %' : '0%',
        },
        total_attendance: {
          hadir: data.counts.hadir ?? 0,
          izin: data.counts.izin ?? 0,
          sakit: data.counts.sakit ?? 0,
          alpha: data.counts.alpha ?? 0,
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
}