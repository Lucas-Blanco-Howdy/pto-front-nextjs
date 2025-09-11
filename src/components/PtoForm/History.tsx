'use client';
import { Card } from '../ui/Card';
import { PtoRequest } from '../../types/pto.types';

interface HistoryProps {
    ptoRequests: PtoRequest[];
}

export const History = ({ ptoRequests }: HistoryProps) => (
    <Card className="bg-white border border-gray-200 p-8 mb-8">
        <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
                PTO Request History
            </h3>
            <p className="text-gray-600">Your previous time off requests</p>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ptoRequests.length > 0 ? (
                        ptoRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-[#448880]/10 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{request.startDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{request.endDate || '-'}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                        request.status === 'Approved' 
                                            ? 'bg-green-100 text-green-800'
                                            : request.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-[#DD461A]/10 text-[#DD461A]'
                                    }`}>
                                        {request.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-xl font-medium text-gray-600">No PTO requests found</p>
                                    <p className="text-sm text-gray-400">Your request history will appear here</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);
