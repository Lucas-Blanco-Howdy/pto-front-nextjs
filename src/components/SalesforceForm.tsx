'use client';
import { useState } from 'react';

interface Candidate {
    Id: string;
    Name: string;
    Howdy_Email__c: string;
    Vacation_Days__c: number;
}

export default function SalesforceForm() {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [step, setStep] = useState('email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ptoData, setPtoData] = useState({
        startDate: '',
        endDate: ''
    });
    const [testEmail, setTestEmail] = useState('lucasblanco@howdy.com');  



    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitting(true);

        try{
            const response = await fetch('/api/pto-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: ptoData.startDate,
                    endDate: ptoData.endDate,
                    candidateId: candidate?.Id,
                    vacationsDays: candidate?.Vacation_Days__c
                }),
            });

            if(response.ok){
                console.log('PTO Request enviado exitosamente');
            }else{
                console.error('Error al enviar PTO Request');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const fetchCandidate = async (email: string) => {
        try{
            const response = await fetch(`/api/candidate?email=${email}`);
            const data = await response.json();
            setCandidate(data.candidate);
            setStep('candidate');
        } catch (error) {
            console.error('Error al obtener el candidato:', error);
            setStep('error');
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('loading');
        await fetchCandidate(testEmail);
    };


    const handlePtoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPtoData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {step === 'email' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Professional Search
                    </h2>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white rounded-md font-medium transition-colors"
                        >
                            Search Professional
                        </button>
                    </form>
                </div>
            )}

            {step === 'loading' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Loading Professional Profile...
                    </h2>
                </div>
            )}
            
            {step === 'candidate' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Welcome, {candidate?.Name}
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 text-center">
                            <strong>Vacation Days Available:</strong> {candidate?.Vacation_Days__c || 0}
                        </p>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        Request Time Off
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={ptoData.startDate}
                                onChange={handlePtoInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date *
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={ptoData.endDate}
                                onChange={handlePtoInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                            } text-white`}
                        >
                            {isSubmitting ? 'Submitting Request...' : 'Submit PTO Request'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );


}