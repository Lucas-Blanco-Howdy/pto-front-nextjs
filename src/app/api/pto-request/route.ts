import { NextRequest, NextResponse } from 'next/server';
import jsforce from 'jsforce';
import { ptoRequestLimiter } from '../../../lib/rateLimiter'; 

const SALESFORCE_CONFIG = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://test.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
};

interface SalesforceCandidate {
    Id: string;
    Howdy_Email__c: string;
}

interface SalesforceHoliday {
    Id: string;
    Date__c: string;
}

interface SalesforceInsertResult {
    id: string;
    success: boolean;
    errors: Array<{
        statusCode: string;
        message: string;
        fields: string[];
    }>;
}

export async function POST(request: NextRequest){
    try{
        const authEmail = request.headers.get('x-user-email');
        
        if (!authEmail) {
            return NextResponse.json(
                { error: 'Missing authentication' }, 
                { status: 401 }
            );
        }

        
        const userAgent = request.headers.get('user-agent');
        if (userAgent && userAgent.startsWith('curl/')) {
            return NextResponse.json({ error: 'Terminal access not allowed' }, { status: 401 });
        }

        if (!ptoRequestLimiter.isAllowed(authEmail)) {
            const resetTime = ptoRequestLimiter.getResetTime(authEmail);
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
            
            return NextResponse.json(
                { 
                    error: 'Too many PTO requests. Please try again later.',
                    retryAfter: retryAfter
                }, 
                { 
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': '5', 
                        'X-RateLimit-Remaining': ptoRequestLimiter.getRemainingRequests(authEmail).toString()
                    }
                }
            );
        }
        
        const formData = await request.json();

        if (!formData.candidateId || !formData.typeOfLicense) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        const conn = new jsforce.Connection({
            loginUrl: SALESFORCE_CONFIG.loginUrl,
        });

        await conn.login(
            SALESFORCE_CONFIG.username, 
            SALESFORCE_CONFIG.password + SALESFORCE_CONFIG.securityToken
        );

        const candidateCheck = await conn.sobject('Candidate__c')
            .select(['Id', 'Howdy_Email__c'])
            .where({
                Id: formData.candidateId,
                Howdy_Email__c: authEmail
            })
            .limit(1)
            .execute() as SalesforceCandidate[];
        
        if (candidateCheck.length === 0) {
            return NextResponse.json(
                { error: 'Unauthorized: You can only submit requests for your own profile' }, 
                { status: 403 }
            );
        }

        let ptoRequestData;
        
        if (formData.typeOfLicense === 'Switch holiday') {
            if (!/^[a-zA-Z0-9]{15,18}$/.test(formData.holiday)) {
                return NextResponse.json(
                    { error: 'Invalid holiday ID format' }, 
                    { status: 400 }
                );
            }

            const holidayResult = await conn.sobject('Holiday__c')
                .select(['Date__c'])
                .where({ Id: formData.holiday })
                .limit(1)
                .execute() as SalesforceHoliday[];

            if (holidayResult.length === 0) {
                return NextResponse.json(
                    { error: 'Holiday not found' }, 
                    { status: 404 }
                );
            }

            const holidayDate = holidayResult[0].Date__c;

            ptoRequestData = {
                StartDate__c: formData.switchDate,
                SwitchHolidayDate__c: holidayDate,
                Name: formData.typeOfLicense,
                Requested_By__c: formData.candidateId,
                Status__c: 'Pending'
            };
        } else {
            // Validate dates
            const startDate = new Date(formData.startDate);
            const endDate = formData.endDate ? new Date(formData.endDate) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
                return NextResponse.json(
                    { error: 'Start date cannot be in the past' }, 
                    { status: 400 }
                );
            }

            if (endDate && endDate < startDate) {
                return NextResponse.json(
                    { error: 'End date cannot be before start date' }, 
                    { status: 400 }
                );
            }

            ptoRequestData = {
                StartDate__c: formData.startDate,
                EndDate__c: formData.endDate,
                Name: formData.typeOfLicense,
                Requested_By__c: formData.candidateId,
                Status__c: 'Pending'
            };
        }

        const result = await conn.sobject('PTO_Request__c').insert(ptoRequestData) as SalesforceInsertResult;

        return NextResponse.json({ 
            success: true,
            message: 'PTO request submitted successfully',
            requestId: result.id
        });
    } catch (error) {
        console.error('Error submitting PTO request:', error);
    
        return NextResponse.json({ 
            success: false,
            message: 'Error submitting request. Please try again later.'
        }, { status: 500 });
    }
}
