'use client';
import { useState, useEffect } from 'react';
import { Candidate, Holiday, PtoRequest, User, PtoData, StepType } from '../types/pto.types';
import { ptoService } from '../services/ptoService';

export const usePtoForm = () => {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [step, setStep] = useState<StepType>('loading');
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userEmail, setUserEmail] = useState<string>(''); 
    const [ptoData, setPtoData] = useState<PtoData>({
        startDate: '',
        endDate: '',
        typeOfLicense: '',
        holiday: '',
        switchDate: ''
    });

    useEffect(() => {
        const fetchCandidateData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user: User = JSON.parse(storedUser);
                setUserEmail(user.email); 
                await fetchCandidate(user.email);
            } else {
                setStep('error');
            }
        };

        fetchCandidateData();
    }, []);

    const fetchCandidate = async (email: string) => {
        try {
            const data = await ptoService.fetchCandidate(email);
            
            if (data.candidate) {
                setCandidate(data.candidate);
                setHolidays(data.holidays || []);
                setPtoRequests(data.ptoRequests || []);
                setStep('candidate');
            } else {
                setStep('not-found');
            }
        } catch (error) {
            if (error instanceof Error && error.message === 'unauthorized') {
                setStep('unauthorized');
            } else {
                console.error('Error fetching candidate:', error);
                setStep('error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const requestData = {
                startDate: ptoData.startDate,
                endDate: ptoData.endDate,
                typeOfLicense: ptoData.typeOfLicense,
                candidateId: candidate?.Id,
                vacationsDays: candidate?.Vacation_Days__c,
                typeOfContract: candidate?.Type_of_contract__c,
                sickDays: candidate?.Sick_Days__c,
                holiday: ptoData.holiday,
                switchDate: ptoData.switchDate,
                country: candidate?.Country_Formula__c,
            };

            await ptoService.submitPtoRequest(requestData, userEmail);
            
            console.log('PTO Request sent successfully');
            await fetchCandidate(userEmail);
            
            // Reset form
            setPtoData({
                startDate: '',
                endDate: '',
                typeOfLicense: '',
                holiday: '',
                switchDate: ''
            });
            
            alert('PTO Request submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error instanceof Error ? error.message : 'Error submitting PTO Request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePtoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);
        setPtoData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    return {
        candidate,
        step,
        holidays,
        ptoRequests,
        isSubmitting,
        ptoData,
        userEmail,
        handlePtoInputChange,
        handleSubmit
    };
};
