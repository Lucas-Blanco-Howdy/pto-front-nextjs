'use client';
import { Card } from '../ui/Card';
import { Candidate } from '../../types/pto.types';

interface StatsCardsProps {
    candidate: Candidate | null;
}

export const StatsCards = ({ candidate }: StatsCardsProps) => (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-emerald-700 text-sm font-medium mb-1">Vacation Days</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-emerald-900">{candidate?.Vacation_Days__c || 0}</p>
                        <span className="text-emerald-600 text-sm">days to relax</span>
                    </div>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🏖️</span>
                </div>
            </div>
        </div>
        
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sky-700 text-sm font-medium mb-1">Sick Days</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-sky-900">{candidate?.Sick_Days__c || 0}</p>
                        <span className="text-sky-600 text-sm">days to recover</span>
                    </div>
                </div>
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🏥</span>
                </div>
            </div>
        </div>
    </div>
);
