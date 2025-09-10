export interface Candidate {
    Id: string;
    Name: string;
    Howdy_Email__c: string;
    Vacation_Days__c: number;
    Sick_Days__c: number;
    Type_of_contract__c: string;
    Country_Formula__c: string;
}

export interface Holiday {
    Id: string;
    Name: string;
    Date__c: string;
}

export interface PtoRequest {
    Id: string;
    Name: string;
    StartDate__c: string;
    EndDate__c: string;
    Status__c: string;
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
