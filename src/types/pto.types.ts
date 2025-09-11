export interface Candidate {
    id: string;
    name: string;
    email: string;
    vacationDays: number;
    sickDays: number;
    typeOfContract: string;
    country: string;
    countryId?: string;
}

export interface Holiday {
    id: string;
    name: string;
    date: string;
}

export interface PtoRequest {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    createdDate?: string;
    switchHolidayDate?: string;
}

export interface User {
    email: string;
    name: string;
    picture: string;
    googleId: string;
}

export interface PtoData {
    startDate: string;
    endDate: string;
    typeOfLicense: string;
    holiday: string;
    switchDate: string;
}

export type StepType = 'loading' | 'candidate' | 'error' | 'unauthorized' | 'not-found';
