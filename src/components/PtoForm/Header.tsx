'use client';
import { Card } from '../ui/Card';
import { Candidate } from '../../types/pto.types';

interface HeaderProps {
    candidate: Candidate | null;
}

export const Header = ({ candidate }: HeaderProps) => {

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {getGreeting()}, {candidate?.Name?.split(' ')[0]}
                </h1>
                <p className="text-gray-600">
                    Ready to plan your time off?
                </p>
            </div>

            {candidate?.Type_of_contract__c === 'Employee' && candidate?.Country_Formula__c === 'Colombia' && (
                <div className="bg-[#8B8BD7]/10 rounded-lg p-6 mb-8 border border-[#8B8BD7]">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-[#8B8BD7] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">!</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-[#8B8BD7] mb-2">
                                Important Notice for Colombian Employees
                            </h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <strong>Switch Holidays:</strong> Please contact your manager first.
                                </p>
                                <p className="text-gray-600">
                                    National holidays worked at partner/Howdy request are paid at a higher rate
                                    (send proof to finance@howdy.com). Personal choice holidays are paid at regular rate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
