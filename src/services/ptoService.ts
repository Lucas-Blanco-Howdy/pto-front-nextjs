import { Candidate, Holiday, PtoRequest } from '../types/pto.types';
import { authService } from './authService';

interface CandidateResponse {
    success: boolean;
    message: string;
    candidate?: Candidate;
    holidays?: Holiday[];
    ptoRequests?: PtoRequest[];
    error?: string;
}

interface PtoRequestData {
    startDate: string;
    endDate: string;
    typeOfLicense: string;
    candidateId?: string;
    vacationsDays?: number;
    typeOfContract?: string;
    sickDays?: number;
    holiday: string;
    switchDate: string;
    country?: string;
}

export const ptoService = {
    async fetchCandidate(email: string): Promise<CandidateResponse> {
        try {
            //Validate email authenticated
            const authenticatedEmail = authService.getAuthenticatedEmail();
            if (!authenticatedEmail || authenticatedEmail !== email) {
                return {
                    success: false,
                    message: 'Unauthorized: You can only access your own data',
                    error: 'UNAUTHORIZED'
                };
            }

            const response = await fetch(`/api/candidate?email=${encodeURIComponent(email)}`, {
                headers: {
                    'x-user-email': email,
                },
            });

            if (response.status === 429) {
                const data = await response.json();
                return {
                    success: false,
                    message: `Rate limit exceeded. Please wait ${data.retryAfter || 15} minutes before trying again.`,
                    error: 'RATE_LIMIT_EXCEEDED'
                };
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching candidate:', error);
            return {
                success: false,
                message: 'Failed to fetch candidate data',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    async submitPtoRequest(data: PtoRequestData, userEmail: string): Promise<{ success: boolean; message: string }> {
        try {
            const authenticatedEmail = authService.getAuthenticatedEmail();
            if (!authenticatedEmail || authenticatedEmail !== userEmail) {
                return {
                    success: false,
                    message: 'Unauthorized: You can only submit requests for your own profile'
                };
            }

            const response = await fetch('/api/pto-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': userEmail,
                },
                body: JSON.stringify(data),
            });

            if (response.status === 429) {
                const data = await response.json();
                return {
                    success: false,
                    message: `Rate limit exceeded. Please wait ${data.retryAfter || 15} minutes before trying again.`
                };
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting PTO request:', error);
            return {
                success: false,
                message: 'Failed to submit PTO request'
            };
        }
    }
};
