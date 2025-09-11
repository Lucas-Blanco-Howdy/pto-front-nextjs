'use client';
import { usePtoForm } from '../hooks/usePtoForm';
import { LoadingState, ErrorState } from './PtoForm/LoadingStates';
import { Header } from './PtoForm/Header';
import { StatsCards } from './PtoForm/StatsCards';
import { FormSection } from './PtoForm/FormSection';
import { History } from './PtoForm/History';
import { SuccessMessage } from './PtoForm/SuccessMessage'; 
import { useEffect, useRef } from 'react';

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
        showSuccess, 
        successMessage, 
        closeSuccess, 
        handlePtoInputChange,
        handleSubmit,
        fetchCandidate
    } = usePtoForm();

    
    const hasFetched = useRef(false);

    useEffect(() => {
        if (userEmail && !hasFetched.current) {
            console.log('🔍 DEBUG: Fetching data for:', userEmail);
            hasFetched.current = true;
            fetchCandidate(userEmail);
        }
    }, [userEmail]);

    if (step === 'loading') return <LoadingState />;

    if (step === 'error' || step === 'unauthorized' || step === 'not-found') return (
        <div className="min-h-screen bg-[#ECD0B5] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <ErrorState type={step} />
            </div>
        </div>
    );

    return (
        <>
            {}
            <SuccessMessage 
                isVisible={showSuccess}
                onClose={closeSuccess}
                message={successMessage}
            />
            
            <div className="min-h-screen bg-[#ECD0B5] py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Header candidate={candidate} />
                    <StatsCards candidate={candidate} />
                    <FormSection 
                        ptoData={ptoData}
                        holidays={holidays}
                        isSubmitting={isSubmitting}
                        candidate={candidate}
                        onInputChange={handlePtoInputChange}
                        onSubmit={() => handleSubmit(userEmail || '')}
                    />
                    <History ptoRequests={ptoRequests} />
                </div>
            </div>
        </>
    );
}