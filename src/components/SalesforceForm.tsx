'use client';
import { usePtoForm } from '../hooks/usePtoForm';
import { LoadingState, ErrorState } from './PtoForm/LoadingStates';
import { Header } from './PtoForm/Header';
import { StatsCards } from './PtoForm/StatsCards';
import { FormSection } from './PtoForm/FormSection';
import { History } from './PtoForm/History';
import { useEffect } from 'react';
import { authService } from '../services/authService';

interface SalesforceFormProps {
    userEmail?: string;
}

export default function SalesforceForm({ userEmail }: SalesforceFormProps) {
    const {
        candidate,
        step,
        holidays,
        ptoRequests,
        isSubmitting,
        ptoData,
        handlePtoInputChange,
        handleSubmit,
        fetchCandidate
    } = usePtoForm();


    useEffect(() => {
        console.log(' DEBUG: userEmail prop:', userEmail);
        console.log('🔍 DEBUG: authenticated email:', authService.getAuthenticatedEmail());
        if (userEmail) {
            fetchCandidate(userEmail);
        }
    }, [userEmail, fetchCandidate]);

    if (step === 'loading') return <LoadingState />;

    if (step === 'error' || step === 'unauthorized' || step === 'not-found') return (
        <div className="min-h-screen bg-[#ECD0B5] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <ErrorState type={step} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#ECD0B5] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Header candidate={candidate} />
                <StatsCards candidate={candidate} />
                <FormSection 
                    ptoData={ptoData}
                    holidays={holidays}
                    isSubmitting={isSubmitting}
                    onInputChange={handlePtoInputChange}
                    onSubmit={() => handleSubmit(userEmail || '')}
                />
                <History ptoRequests={ptoRequests} />
            </div>
        </div>
    );
}