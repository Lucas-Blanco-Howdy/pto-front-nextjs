'use client';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Holiday, PtoData, Candidate } from '../../types/pto.types';

interface FormSectionProps {
    ptoData: PtoData;
    holidays: Holiday[];
    isSubmitting: boolean;
    candidate: Candidate | null; 
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: () => void;
}

export const FormSection = ({ ptoData, holidays, isSubmitting, candidate, onInputChange, onSubmit }: FormSectionProps) => {
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(); 
    };

    return (
        <Card className="bg-white border border-gray-200 p-8 mb-8">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Request Time Off
                </h3>
                <p className="text-gray-600">Submit your time off request</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={ptoData.startDate}
                            onChange={onInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#448880] focus:border-[#448880] transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={ptoData.endDate}
                            onChange={onInputChange}
                            min={ptoData.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#448880] focus:border-[#448880] transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900"
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="typeOfLicense" className="block text-sm font-medium text-gray-700 mb-2">
                        Type of License
                    </label>
                    <select
                        id="typeOfLicense"
                        name="typeOfLicense"
                        value={ptoData.typeOfLicense}
                        onChange={onInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#448880] focus:border-[#448880] transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900"
                        required
                    >
                        <option value="">Select type of leave</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Sick">Sick</option>
                        {!(candidate?.typeOfContract === 'Employee' && candidate?.country === 'Colombia') && (
                            <option value="Switch holiday">Switch holiday</option>
                        )}
                    </select>
                </div>
                
                {ptoData.typeOfLicense === 'Switch holiday' && (
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-[#8B8BD7]/5 rounded-xl border border-[#8B8BD7]/30">
                        <div>
                            <label htmlFor="holiday" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Holiday *
                            </label>
                            <select
                                id="holiday"
                                name="holiday"
                                value={ptoData.holiday || ''}
                                onChange={(e) => onInputChange(e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#448880] focus:border-[#448880] transition-all duration-200 bg-white shadow-sm text-gray-900"
                                required
                            >
                                <option value="">Select a holiday</option>
                                {holidays.map((holiday) => (
                                    <option key={holiday.id} value={holiday.id}>
                                        {holiday.name || holiday.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="switchDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Date to switch to *
                            </label>
                            <input
                                type="date"
                                id="switchDate"
                                name="switchDate"
                                value={ptoData.switchDate}
                                onChange={(e) => onInputChange(e)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#448880] focus:border-[#448880] transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900"
                                required
                            />
                        </div>
                    </div>
                )}
                
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed scale-95'
                            : 'bg-[#448880] hover:bg-[#448880] active:bg-[#448880] focus:ring-4 focus:ring-[#448880]/20 shadow-sm hover:shadow-md'
                    } text-white`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-500">Submitting Request...</span>
                        </div>
                    ) : (
                        'Submit PTO Request'
                    )}
                </Button>
            </form>
        </Card>
    );
};
