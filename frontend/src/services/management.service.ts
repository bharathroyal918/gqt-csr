import {
  KARNATAKA_DISTRICTS,
  PIPELINE_FUNNEL,
  COLLEGE_PERFORMANCE_METRICS,
  HR_PERFORMANCE_METRICS,
  GQT_COURSES_ANALYTICS,
  BRANCH_ANALYTICS,
  PASSING_YEAR_ANALYTICS,
  TRAINING_BATCHES,
  SAVED_EXECUTIVE_REPORTS,
  MANAGEMENT_AUDIT_LOGS,
  MANAGEMENT_ACTIVITY_FEED,
  MANAGEMENT_EXECUTIVE_INSIGHTS,
} from '@/lib/management/managementData';
import {
  DistrictStatistics,
  CollegePerformanceStats,
  HRPerformanceStats,
  PipelineFunnelStage,
  CourseAnalyticsData,
  ExecutiveSavedReport,
  ManagementAuditEntry,
  ManagementActivityFeedItem,
  ExecutiveInsightsItem,
} from '@/types';

export interface ManagementExecutiveKPIs {
  totalDrives: number;
  activeDrives: number;
  completedDrives: number;
  upcomingDrives: number;
  totalColleges: number;
  activeColleges: number;
  districtsCovered: number;
  studentsRegistered: number;
  examCompleted: number;
  qualifiedStudents: number;
  selectedStudents: number;
  rejectedStudents: number;
  offerAcceptedStudents: number;
  joiningConfirmedStudents: number;
  trainingBatchFilledRate: number;
  averageSelectionRate: number;
  averageAcceptanceRate: number;
}

export class ManagementService {
  /**
   * Calculate Statewide Top-Level Executive KPIs
   */
  static getExecutiveKPIs(): ManagementExecutiveKPIs {
    const totalReg = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.studentsRegistered, 0);
    const totalExam = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.studentsExamAppeared, 0);
    const totalQual = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.studentsQualified, 0);
    const totalSel = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.studentsSelected, 0);
    const totalAcc = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.offersAccepted, 0);
    const totalJoin = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.joiningConfirmed, 0);
    const totalColls = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.collegesCount, 0);
    const totalDrives = KARNATAKA_DISTRICTS.reduce((sum, d) => sum + d.drivesCount, 0);

    return {
      totalDrives: totalDrives + 8,
      activeDrives: 14,
      completedDrives: totalDrives - 8,
      upcomingDrives: 6,
      totalColleges: totalColls,
      activeColleges: Math.round(totalColls * 0.78),
      districtsCovered: 31,
      studentsRegistered: totalReg,
      examCompleted: totalExam,
      qualifiedStudents: totalQual,
      selectedStudents: totalSel,
      rejectedStudents: totalExam - totalSel,
      offerAcceptedStudents: totalAcc,
      joiningConfirmedStudents: totalJoin,
      trainingBatchFilledRate: 94.2,
      averageSelectionRate: 22.4,
      averageAcceptanceRate: 92.1,
    };
  }

  /**
   * Get all 31 Karnataka Districts with optional query
   */
  static getDistricts(query?: string): DistrictStatistics[] {
    if (!query) return KARNATAKA_DISTRICTS;
    const lower = query.toLowerCase();
    return KARNATAKA_DISTRICTS.filter(
      (d) =>
        d.district.toLowerCase().includes(lower) ||
        d.zone.toLowerCase().includes(lower) ||
        d.topColleges.some((c) => c.toLowerCase().includes(lower))
    );
  }

  /**
   * Get specific district by ID or name
   */
  static getDistrictById(idOrName: string): DistrictStatistics | undefined {
    return KARNATAKA_DISTRICTS.find(
      (d) => d.id === idOrName || d.district.toLowerCase() === idOrName.toLowerCase()
    );
  }

  /**
   * College Leaderboard with sorting and multi-filtering
   */
  static getCollegeLeaderboard(filters?: {
    district?: string;
    type?: string;
    tier?: string;
    search?: string;
    sortBy?: 'rank' | 'registered' | 'selected' | 'acceptance';
  }): CollegePerformanceStats[] {
    let list = [...COLLEGE_PERFORMANCE_METRICS];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.collegeName.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      );
    }
    if (filters?.district && filters.district !== 'all') {
      list = list.filter((c) => c.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((c) => c.type === filters.type);
    }
    if (filters?.tier && filters.tier !== 'all') {
      list = list.filter((c) => c.tier === filters.tier);
    }

    if (filters?.sortBy === 'registered') {
      list.sort((a, b) => b.studentsRegistered - a.studentsRegistered);
    } else if (filters?.sortBy === 'selected') {
      list.sort((a, b) => b.currentYearSelected - a.currentYearSelected);
    } else if (filters?.sortBy === 'acceptance') {
      list.sort((a, b) => b.offerAcceptanceRate - a.offerAcceptanceRate);
    } else {
      list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }

  /**
   * HR Recruiter Leaderboard & Productivity
   */
  static getHrPerformance(): HRPerformanceStats[] {
    return [...HR_PERFORMANCE_METRICS].sort((a, b) => b.selectedCount - a.selectedCount);
  }

  /**
   * Recruitment Funnel Stages
   */
  static getPipelineFunnel(): PipelineFunnelStage[] {
    return PIPELINE_FUNNEL;
  }

  /**
   * GQT Courses & Batch statistics
   */
  static getCourseAnalytics(): CourseAnalyticsData[] {
    return GQT_COURSES_ANALYTICS;
  }

  static getBranchAnalytics() {
    return BRANCH_ANALYTICS;
  }

  static getPassingYearAnalytics() {
    return PASSING_YEAR_ANALYTICS;
  }

  static getTrainingBatches() {
    return TRAINING_BATCHES;
  }

  /**
   * Executive Saved Reports
   */
  static getSavedReports(): ExecutiveSavedReport[] {
    return SAVED_EXECUTIVE_REPORTS;
  }

  /**
   * Governance Audit Trail
   */
  static getAuditLogs(filters?: {
    user?: string;
    role?: string;
    module?: string;
    search?: string;
  }): ManagementAuditEntry[] {
    let logs = [...MANAGEMENT_AUDIT_LOGS];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.module.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }
    if (filters?.role && filters.role !== 'all') {
      logs = logs.filter((l) => l.role === filters.role);
    }
    if (filters?.module && filters.module !== 'all') {
      logs = logs.filter((l) => l.module.toLowerCase().includes(filters.module?.toLowerCase() || ''));
    }

    return logs;
  }

  /**
   * Live Activity Center Feed
   */
  static getActivityFeed(eventType?: string): ManagementActivityFeedItem[] {
    if (!eventType || eventType === 'all') return MANAGEMENT_ACTIVITY_FEED;
    return MANAGEMENT_ACTIVITY_FEED.filter((a) => a.eventType === eventType);
  }

  /**
   * Executive Insights Briefing
   */
  static getExecutiveInsights(): ExecutiveInsightsItem[] {
    return MANAGEMENT_EXECUTIVE_INSIGHTS;
  }

  /**
   * Generic Exporter for CSV / Excel Download in Browser
   */
  static exportToCSV(filename: string, rows: Record<string, any>[]) {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
    const dataLines = rows.map((row) =>
      headers
        .map((field) => {
          const val = row[field];
          if (val === null || val === undefined) return '""';
          if (typeof val === 'string') {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return `"${val}"`;
        })
        .join(',')
    );

    const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }
}
