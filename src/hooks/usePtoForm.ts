'use client';
import { useState } from 'react';
import { Candidate, Holiday, PtoRequest, PtoData, StepType } from '../types/pto.types';
import { ptoService } from '../services/ptoService';


export const usePtoForm = () => {
    const [step, setStep] = useState<StepType>('loading');
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [ptoData, setPtoData] = useState<PtoData>({
        startDate: '',
        endDate: '',
        typeOfLicense: '',
        holiday: '',
        switchDate: ''
    });

    const fetchCandidate = async (email: string) => {
        try {
            setStep('loading');
            const response = await ptoService.fetchCandidate(email);
            
            if (response.success && response.candidate) {
                setCandidate(response.candidate);
                setHolidays(response.holidays || []);
                setPtoRequests(response.ptoRequests || []);
                setStep('candidate');
            } else {
                if (response.error === 'UNAUTHORIZED') {
                    setStep('unauthorized');
                } else if (response.error === 'RATE_LIMIT_EXCEEDED') {
                    setError(response.message);
                    setStep('error');
                } else {
                    setStep('not-found');
                }
            }
        } catch (error) {
            console.error('Error fetching candidate:', error);
            setStep('error');
        }
    };

    const handlePtoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const field = e.target.name as keyof PtoData;
        const value = e.target.value;
        setPtoData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (userEmail: string) => {
        await submitPtoRequest(ptoData, userEmail);
    };

    const submitPtoRequest = async (ptoData: PtoData, userEmail: string) => {
        if (!candidate) return;
        
        setIsSubmitting(true);
        try {
            const requestData = {
                startDate: ptoData.startDate,
                endDate: ptoData.endDate,
                typeOfLicense: ptoData.typeOfLicense,
                //candidateId: candidate.realId, // Usar el ID real para PTO requests
                vacationsDays: candidate.vacationDays,
                typeOfContract: candidate.typeOfContract,
                sickDays: candidate.sickDays,
                holiday: ptoData.holiday,
                switchDate: ptoData.switchDate,
                country: candidate.country,
            };

            const response = await ptoService.submitPtoRequest(requestData, userEmail);
            
            if (response.success) {
                console.log('PTO Request sent successfully');
                
                setSuccessMessage('PTO Request submitted successfully!');
                setShowSuccess(true);
                
                setPtoData({
                    startDate: '',
                    endDate: '',
                    typeOfLicense: '',
                    holiday: '',
                    switchDate: ''
                });
                
                // Refresh data
                await fetchCandidate(userEmail);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error submitting PTO request:', error);
            setError('Failed to submit PTO request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        setSuccessMessage('');
    };

    return {
        step,
        candidate,
        holidays,
        ptoRequests,
        error,
        isSubmitting,
        ptoData,
        showSuccess, 
        successMessage, 
        closeSuccess, 
        handlePtoInputChange,
        handleSubmit,
        fetchCandidate,
        submitPtoRequest,
        setError
    };
};
