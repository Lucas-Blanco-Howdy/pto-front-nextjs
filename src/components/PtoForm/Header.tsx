'use client';
import { Card } from '../ui/Card';
import { Candidate } from '../../types/pto.types';
import Image from 'next/image';

interface HeaderProps {
    candidate: Candidate | null;
}

export const Header = ({ candidate }: HeaderProps) => (
    <>
        <Card className="violet-gradient text-white p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
                <div className="flex items-center justify-center mb-6">
                    <Image 
                        src="/howdy-logo.svg" 
                        alt="Howdy Logo" 
                        width={192}
                        height={72}
                        className="h-16 w-auto filter brightness-0 invert"
                    />
                </div>
                <h2 className="text-4xl font-bold mb-2">
                    Welcome back, {candidate?.Name}!
                </h2>
                <p className="text-violet-100 text-lg">Manage your time off requests with ease</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full"></div>
        </Card>

        {/* Colombia Warning */}
        {candidate?.Type_of_contract__c === 'Employee' && candidate?.Country_Formula__c === 'Colombia' && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 mb-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">
                            Special Notice for Colombian Employees
                        </h3>
                        <div className="text-amber-700 leading-relaxed">
                            <p className="font-medium mb-2">
                                IMPORTANT NOTICE: If you need to make a Switch Holiday, please contact your Manager.
                            </p>
                            <p>
                                Please note that national holidays worked at the request of the partner or Howdy are paid at a higher rate, 
                                provided proof is sent to finance@howdy.com. However, if you choose to work on a national holiday as a personal decision, 
                                it will NOT be paid at a higher rate.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        )}
    </>
);
