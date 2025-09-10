'use client';
import { Card } from '../ui/Card';
import { Candidate } from '../../types/pto.types';

interface StatsCardsProps {
    candidate: Candidate | null;
}

export const StatsCards = ({ candidate }: StatsCardsProps) => (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 p-6 card-hover">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-violet-600 text-sm font-semibold uppercase tracking-wide mb-1">Vacation Days</p>
                    <p className="text-4xl font-bold text-violet-800">{candidate?.Vacation_Days__c || 0}</p>
                    <p className="text-violet-600 text-sm">Available</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200 p-6 card-hover">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide mb-1">Sick Days</p>
                    <p className="text-4xl font-bold text-indigo-800">{candidate?.Sick_Days__c || 0}</p>
                    <p className="text-indigo-600 text-sm">Available</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            </div>
        </Card>
    </div>
);
