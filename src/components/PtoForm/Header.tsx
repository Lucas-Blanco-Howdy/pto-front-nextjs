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
                    {getGreeting()}, {candidate?.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-600">
                    Ready to plan your time off?
                </p>
            </div>

            {candidate?.typeOfContract === 'Employee' && candidate?.country === 'Colombia' && (
                <div className="bg-[#DD461A] rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-[#fcf6eb] rounded-full flex items-center justify-center">
                                <span className="text-[#DD461A] text-sm font-medium">!</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-[#fcf6eb] mb-2">
                                Important Notice for Colombian Employees
                            </h3>
                            <div className="text-sm text-[#fcf6eb] space-y-2">
                                <p>
                                    <strong>Switch Holidays:</strong> Please contact your manager first.
                                </p>
                                <p className="text-[#fcf6eb]/90">
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
