import { Candidate, Holiday, PtoRequest } from '../types/pto.types';

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

    async submitPtoRequest(data: PtoRequestData, userEmail: string) {
        const response = await fetch('/api/pto-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Unauthorized: You can only submit requests for your own profile');
            }
            throw new Error('Error submitting PTO Request');
        }

        return response;
    }
};
