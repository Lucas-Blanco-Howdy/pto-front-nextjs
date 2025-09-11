import { NextRequest, NextResponse } from 'next/server';
import jsforce from 'jsforce';
import { candidateLimiter } from '../../../lib/rateLimiter';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-12345-para-jwt';

const SALESFORCE_CONFIG = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://test.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
};


export async function GET(request: NextRequest) {
    try {
        // Validar JWT token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        let decoded: { email: string };
        
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const authenticatedEmail = decoded.email;
        const { searchParams } = new URL(request.url);
        const requestedEmail = searchParams.get('email');
        
        if (authenticatedEmail !== requestedEmail) {
            return NextResponse.json(
                { error: 'Unauthorized: You can only access your own data' }, 
                { status: 403 }
            );
        }

        if (!candidateLimiter.isAllowed(authenticatedEmail)) {
            const resetTime = candidateLimiter.getResetTime(authenticatedEmail);
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
            
            return NextResponse.json(
                { 
                    error: 'Too many requests. Please try again later.',
                    retryAfter: retryAfter
                }, 
                { 
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': '5',
                        'X-RateLimit-Remaining': candidateLimiter.getRemainingRequests(authenticatedEmail).toString()
                    }
                }
            );
        }
        
        const conn = new jsforce.Connection({
            loginUrl: SALESFORCE_CONFIG.loginUrl,
        });

        await conn.login(
            SALESFORCE_CONFIG.username, 
            SALESFORCE_CONFIG.password + SALESFORCE_CONFIG.securityToken
        );
        
        const candidates = await conn.sobject('Candidate__c')
            .select(['Id', 'Howdy_Email__c', 'Name', 'Vacation_Days__c', 
                    'Country__c', 'Type_of_contract__c', 'Sick_Days__c', 
                    'Country_Formula__c'])
            .where({ Howdy_Email__c: requestedEmail })
            .limit(1)
            .execute();

        if(candidates.length === 0){
            return NextResponse.json({ 
                success: false,
                message: 'Candidate not found'
            });
        }

        const candidate = candidates[0];

        const ptoRequests = await conn.sobject('PTO_Request__c')
            .select(['Id', 'Name', 'StartDate__c', 'EndDate__c', 'Status__c', 'CreatedDate', 'SwitchHolidayDate__c'])
            .where({ Requested_By__c: candidate.Id })
            .orderby('CreatedDate', 'DESC')
            .limit(10)
            .execute();

        const today = new Date();
        const limitDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const limitDateString = limitDate.toISOString().split('T')[0];
        
        const holidaysQuery = `
            SELECT Id, Name, Date__c, Country__c
            FROM Holiday__c
            WHERE Country__c = '${candidate.Country__c}'
            AND Type_of_contract__c = '${candidate.Type_of_contract__c}'
            AND CALENDAR_YEAR(Date__c) = ${new Date().getFullYear()}
            AND Date__c >= ${limitDateString}
        `;

        const holidaysResult = await conn.query(holidaysQuery);
        

        //Clean sensitive data
        const cleanCandidate = {
            id: candidate.Id,
            name: candidate.Name,
            email: candidate.Howdy_Email__c,
            vacationDays: candidate.Vacation_Days__c,
            sickDays: candidate.Sick_Days__c,
            typeOfContract: candidate.Type_of_contract__c,
            country: candidate.Country_Formula__c,
            countryId: candidate.Country__c
        };

        interface SalesforcePtoRequest {
            Id: string;
            Name: string;
            StartDate__c: string;
            EndDate__c: string;
            Status__c: string;
        }

        const cleanPtoRequests = ptoRequests.map((req: SalesforcePtoRequest) => ({
            id: req.Id,
            name: req.Name,
            startDate: req.StartDate__c,
            endDate: req.EndDate__c,
            status: req.Status__c
        }));

        const cleanHolidays = holidaysResult.records.map((hol: Record<string, unknown>) => ({
            id: String(hol.Id || ''),
            name: String(hol.Name || ''),
            date: String(hol.Date__c || '')
        }));

        return NextResponse.json({
            success: true,
            message: 'Candidate found',
            candidate: cleanCandidate,
            ptoRequests: cleanPtoRequests,
            holidays: cleanHolidays
        });

    } catch (error) {
        console.error('error getting professional:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json({ 
            success: false,
            message: 'Error getting professional',
            error: (error as Error).message || 'Unknown error'
        }, { status: 500 });
    }
}
