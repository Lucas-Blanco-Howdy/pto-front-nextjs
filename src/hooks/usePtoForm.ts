'use client';
import { useState, useEffect } from 'react';
import { Candidate, Holiday, PtoRequest, User, PtoData, StepType } from '../types/pto.types';
import { ptoService } from '../services/ptoService';
import { authService } from '../services/authService';

export const usePtoForm = () => {
    const [step, setStep] = useState<StepType>('loading');
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // ✅ AGREGAR: Función para manejar cambios en ptoData
    const handlePtoInputChange = (field: keyof PtoData, value: string) => {
        setPtoData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ✅ AGREGAR: Función para manejar submit
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
                candidateId: candidate.id,
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

    return {
        step,
        candidate,
        holidays,
        ptoRequests,
        error,
        isSubmitting,
        ptoData, 
        handlePtoInputChange, 
        handleSubmit, 
        fetchCandidate,
        submitPtoRequest,
        setError
    };
};
