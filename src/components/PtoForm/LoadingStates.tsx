'use client';
import { Card } from '../ui/Card';

export const LoadingState = () => (
    <Card className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mb-6"></div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Loading Professional Profile...
        </h2>
        <p className="text-gray-500 text-lg">Please wait while we fetch your information</p>
    </Card>
);

interface ErrorStateProps {
    type: 'error' | 'unauthorized' | 'not-found';
}

export const ErrorState = ({ type }: ErrorStateProps) => {
    const content = {
        error: {
            icon: (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Error Loading Profile',
            message: 'There was an error loading your profile. Please try refreshing the page.',
            color: 'red'
        },
        unauthorized: {
            icon: (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            title: 'Access Denied',
            message: 'You can only access your own profile data. Please contact support if this is an error.',
            color: 'red'
        },
        'not-found': {
            icon: (
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            title: 'Professional Profile Not Found',
            message: 'No candidate profile found for your email address. Please contact HR.',
            color: 'gray'
        }
    }[type];

    return (
        <Card className="text-center py-20">
            <div className={`w-20 h-20 bg-${content.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                {content.icon}
            </div>
            <h2 className={`text-4xl font-bold text-${content.color}-600 mb-4`}>{content.title}</h2>
            <p className="text-gray-600 text-lg">{content.message}</p>
        </Card>
    );
};
