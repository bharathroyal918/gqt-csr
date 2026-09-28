import {
  DEFAULT_BRANDING_SETTINGS,
  ACADEMIC_YEARS,
  INITIAL_FEATURE_FLAGS,
  STORAGE_BUCKETS,
  MOCK_STORAGE_FILES,
  ACTIVE_SESSIONS,
  LOGIN_HISTORY_EVENTS,
  SYSTEM_BACKUPS,
  INTEGRATIONS_LIST,
  SYSTEM_HEALTH_METRICS,
  ADMIN_ERROR_LOGS,
} from '@/lib/admin/adminControlData';
import {
  PlatformBrandingSettings,
  AcademicYearRecord,
  FeatureFlagItem,
  StorageBucketStat,
  StorageFileItem,
  SecurityActiveSession,
  SecurityLoginEvent,
  SystemBackupRecord,
  IntegrationConfig,
  SystemHealthMetric,
  AdminErrorLog,
} from '@/types';

export class AdminService {
  /**
   * Branding Settings
   */
  static getBrandingSettings(): PlatformBrandingSettings {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gqt_branding_settings');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_BRANDING_SETTINGS;
  }

  static saveBrandingSettings(settings: PlatformBrandingSettings): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gqt_branding_settings', JSON.stringify(settings));
    }
  }

  /**
   * Academic Years
   */
  static getAcademicYears(): AcademicYearRecord[] {
    return ACADEMIC_YEARS;
  }

  static getActiveAcademicYear(): AcademicYearRecord {
    return ACADEMIC_YEARS.find((a) => a.status === 'Current') || ACADEMIC_YEARS[0];
  }

  /**
   * Feature Flags
   */
  static getFeatureFlags(): FeatureFlagItem[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gqt_feature_flags');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_FEATURE_FLAGS;
  }

  static toggleFeatureFlag(key: string): FeatureFlagItem[] {
    const flags = this.getFeatureFlags();
    const updated = flags.map((f) => (f.key === key ? { ...f, isEnabled: !f.isEnabled } : f));
    if (typeof window !== 'undefined') {
      localStorage.setItem('gqt_feature_flags', JSON.stringify(updated));
    }
    return updated;
  }

  /**
   * Storage Buckets & Files
   */
  static getStorageBuckets(): StorageBucketStat[] {
    return STORAGE_BUCKETS;
  }

  static getStorageFiles(bucketName?: string): StorageFileItem[] {
    if (!bucketName || bucketName === 'all') return MOCK_STORAGE_FILES;
    return MOCK_STORAGE_FILES.filter((f) => f.bucket === bucketName);
  }

  /**
   * Security & Active Sessions
   */
  static getActiveSessions(): SecurityActiveSession[] {
    return ACTIVE_SESSIONS;
  }

  static getLoginHistory(): SecurityLoginEvent[] {
    return LOGIN_HISTORY_EVENTS;
  }

  /**
   * Backups
   */
  static getSystemBackups(): SystemBackupRecord[] {
    return SYSTEM_BACKUPS;
  }

  /**
   * Integrations
   */
  static getIntegrations(): IntegrationConfig[] {
    return INTEGRATIONS_LIST;
  }

  /**
   * System Health & Diagnostics
   */
  static getSystemHealth(): SystemHealthMetric[] {
    return SYSTEM_HEALTH_METRICS;
  }

  static getErrorLogs(): AdminErrorLog[] {
    return ADMIN_ERROR_LOGS;
  }
}
