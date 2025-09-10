'use client';
import { usePtoForm } from '../hooks/usePtoForm';
import { LoadingState, ErrorState } from './PtoForm/LoadingStates';
import { Header } from './PtoForm/Header';
import { StatsCards } from './PtoForm/StatsCards';
import { FormSection } from './PtoForm/FormSection';
import { History } from './PtoForm/History';

export default function SalesforceForm() {
    const {
        candidate,
        step,
        holidays,
        ptoRequests,
        isSubmitting,
        ptoData,
        handlePtoInputChange,
        handleSubmit
    } = usePtoForm();

    if (step === 'loading') return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <LoadingState />
            </div>
        </div>
    );

    if (step === 'error' || step === 'unauthorized' || step === 'not-found') return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <ErrorState type={step} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Header candidate={candidate} />
                <StatsCards candidate={candidate} />
                <FormSection 
                    ptoData={ptoData}
                    holidays={holidays}
                    isSubmitting={isSubmitting}
                    onInputChange={handlePtoInputChange}
                    onSubmit={handleSubmit}
                />
                <History ptoRequests={ptoRequests} />
            </div>
        </div>
    );
}