/**
 * Global Quest Technologies (GQT) CSR Platform
 * Django REST Backend Client Service
 */

const DJANGO_BASE_URL = typeof window !== 'undefined'
  ? '/django-api'
  : (process.env.DJANGO_BACKEND_URL || 'http://127.0.0.1:8000') + '/api/v1';

class DjangoApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${DJANGO_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Django API Error (${response.status}): ${errorText}`);
    }
    return response.json();
  }

  // System Health
  async getHealth() {
    return this.request('/audit/health/');
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me/');
  }

  // Drives
  async getDrives() {
    return this.request('/drives/drives/');
  }

  async getDriveStats() {
    return this.request('/drives/stats/');
  }

  // Students & Colleges
  async getStudents(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/students/students/${query}`);
  }

  async getColleges() {
    return this.request('/students/colleges/');
  }

  async getStudentStats() {
    return this.request('/students/stats/');
  }

  // Assessments
  async getExamQuestions(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/assessments/questions/${query}`);
  }

  async submitExam(data: { session_id: number; responses: Array<{ question_id: string; selected_option: number; time_spent: number }> }) {
    return this.request('/assessments/submit/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Interviews & Evaluations
  async getInterviews(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/interviews/schedules/${query}`);
  }

  // Offers
  async getOffers() {
    return this.request('/offers/letters/');
  }

  async respondOffer(offerId: number, action: 'accept' | 'decline') {
    return this.request(`/offers/letters/${offerId}/respond/`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // Notifications
  async dispatchNotification(payload: {
    title: string;
    message: string;
    recipient_email: string;
    recipient_role?: string;
    category?: string;
    channels?: string[];
  }) {
    return this.request('/notifications/dispatch/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Audit Logs
  async getAuditLogs() {
    return this.request('/audit/logs/');
  }
}

export const djangoApi = new DjangoApiService();
export default djangoApi;
