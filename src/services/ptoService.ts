import { Candidate, Holiday, PtoRequest } from '../types/pto.types';

interface CandidateResponse {
    success: boolean;
    message: string;
    candidate?: Candidate;
    holidays?: Holiday[];
    ptoRequests?: PtoRequest[];
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
        const response = await fetch(`/api/candidate?email=${email}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': email 
            }
        });
        
        if (!response.ok && response.status === 403) {
            throw new Error('unauthorized');
        }
        
        return response.json();
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
