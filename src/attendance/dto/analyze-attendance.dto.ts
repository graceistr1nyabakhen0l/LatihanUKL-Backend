export class AnalyzeAttendanceDto {
  startDate: string;        // Format: YYYY-MM-DD
  endDate: string;          // Format: YYYY-MM-DD
  groupByJabatan?: string;  // Optional: Filter by specific jabatan (e.g., "Manager", "Staff")
}