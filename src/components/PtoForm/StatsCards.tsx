'use client';
//import { Card } from '../ui/Card';
import { Candidate } from '../../types/pto.types';

interface StatsCardsProps {
    candidate: Candidate | null;
}

export const StatsCards = ({ candidate }: StatsCardsProps) => (
    <div className="mb-8 flex justify-center">
        <div className="w-1/2 bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[#448880] text-sm font-medium mb-1">Vacation Days</p>
                    <div className="flex items-baseline gap-2">
                        {}
                        {candidate?.country === 'United States' ? (
                            <p className="text-4xl font-semibold text-gray-900">∞</p>
                        ) : (
                            <p className="text-4xl font-semibold text-gray-900">{candidate?.vacationDays || 0}</p>
                        )}
                        <span className="text-gray-600 text-sm">available</span>
                    </div>
                </div>
                <div className="w-14 h-14 bg-[#448880]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#448880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
);
