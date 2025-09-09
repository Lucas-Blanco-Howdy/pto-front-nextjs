'use client';
import { useState, useEffect } from 'react';

interface Candidate {
    Id: string;
    Name: string;
    Howdy_Email__c: string;
    Vacation_Days__c: number;
}

interface Holiday{
    Id: string;
    Name: string;
    Date__c: string;
}

interface PtoRequest {
    Id: string;
    Name: string;
    StartDate__c: string;
    EndDate__c: string;
    Status__c: string;
}

interface User {
    email: string;
    name: string;
    picture: string;
    googleId: string;
}

export default function SalesforceForm() {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [step, setStep] = useState('loading');
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userEmail, setUserEmail] = useState<string>(''); 
    const [ptoData, setPtoData] = useState({
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

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitting(true);

        try{
            const response = await fetch('/api/pto-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': userEmail 
                },
                body: JSON.stringify({
                    startDate: ptoData.startDate,
                    endDate: ptoData.endDate,
                    typeOfLicense: ptoData.typeOfLicense,
                    candidateId: candidate?.Id,
                    vacationsDays: candidate?.Vacation_Days__c,
                    holiday: ptoData.holiday,
                    switchDate: ptoData.switchDate
                }),
            });

            if(response.ok){
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
            } else if (response.status === 403) {
                alert('Unauthorized: You can only submit requests for your own profile');
            } else {
                console.error('Error sending PTO Request');
                alert('Error submitting PTO Request');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting PTO Request');
        } finally {
            setIsSubmitting(false);
        }
    }

    const fetchCandidate = async (email: string) => {
        try{
            const response = await fetch(`/api/candidate?email=${email}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': email 
                }
            });
            const data = await response.json();
            
            if (response.status === 403) {
                setStep('unauthorized');
                return;
            }
            
            if (data.candidate) {
                setCandidate(data.candidate);
                setHolidays(data.holidays || []);
                setPtoRequests(data.ptoRequests || []);
                setStep('candidate');
            } else {
                setStep('not-found');
            }
        } catch (error) {
            console.error('Error fetching candidate:', error);
            setStep('error');
        }
    }

    const handlePtoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);
        setPtoData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {step === 'loading' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Loading Professional Profile...
                    </h2>
                </div>
            )}

            {step === 'unauthorized' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-6">
                        Access Denied
                    </h2>
                    <p className="text-gray-600">
                        You can only access your own profile data. Please contact support if this is an error.
                    </p>
                </div>
            )}

            {step === 'not-found' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Professional Profile Not Found
                    </h2>
                    <p className="text-gray-600">
                        No candidate profile found for your email address. Please contact HR.
                    </p>
                </div>
            )}

            {step === 'error' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-6">
                        Error Loading Profile
                    </h2>
                    <p className="text-gray-600">
                        There was an error loading your profile. Please try refreshing the page.
                    </p>
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
                                required
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
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="typeOfLicense" className="block text-sm font-medium text-gray-700 mb-1">
                                Type of License *
                            </label>
                            <select
                                id="typeOfLicense"
                                name="typeOfLicense"
                                value={ptoData.typeOfLicense}
                                onChange={handlePtoInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select type of license</option>
                                <option value="Vacations">Vacations</option>
                                <option value="Sick Day">Sick Day</option>
                                <option value="Switch holiday">Switch holiday</option>
                            </select>
                        </div>
                        
                        {ptoData.typeOfLicense === 'Switch holiday' && (
                            <>
                                <div>
                                    <label htmlFor="holiday" className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Holiday *
                                    </label>
                                    <select
                                        id="holiday"
                                        name="holiday"
                                        value={ptoData.holiday || ''}
                                        onChange={handlePtoInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a holiday</option>
                                        {holidays.map((holiday) => (
                                            <option key={holiday.Id} value={holiday.Id}>
                                                {holiday.Name || holiday.Id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="switchDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date to switch to *
                                    </label>
                                    <input
                                        type="date"
                                        id="switchDate"
                                        name="switchDate"
                                        value={ptoData.switchDate}
                                        onChange={handlePtoInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        
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
                    
                    {/* PTO History */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">PTO Request History</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ptoRequests.length > 0 ? (
                                        ptoRequests.map((request) => (
                                            <tr key={request.Id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{request.Name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{request.StartDate__c}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{request.EndDate__c || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        request.Status__c === 'Approved' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : request.Status__c === 'Rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {request.Status__c}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                No PTO requests found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}