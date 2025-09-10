import { NextRequest, NextResponse } from 'next/server';
import  jsforce  from 'jsforce';


const SALESFORCE_CONFIG = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://test.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
};


export async function GET(request: NextRequest) {
    try {
        const authEmail = request.headers.get('x-user-email');
        const { searchParams } = new URL(request.url);
        const requestedEmail = searchParams.get('email');
        
        if (!authEmail || authEmail !== requestedEmail) {
            return NextResponse.json(
                { error: 'Unauthorized: You can only access your own data' }, 
                { status: 403 }
            );
        }
        
        
        const conn = new jsforce.Connection({
            loginUrl: SALESFORCE_CONFIG.loginUrl,
        });

        await conn.login(
            SALESFORCE_CONFIG.username, 
            SALESFORCE_CONFIG.password + SALESFORCE_CONFIG.securityToken
        );
        
        
        const result =  await conn.query(`
            SELECT Id, Howdy_Email__c, Name, Vacation_Days__c, Country__c, Type_of_contract__c, Sick_Days__c
            FROM Candidate__c 
            WHERE Howdy_Email__c = '${requestedEmail}'
            LIMIT 1
            `);


        if(result.records.length === 0){
            return NextResponse.json({ 
                success: false,
                message: 'Candidate not found'
            });
        }

        const candidate = result.records[0];

        const ptoRequests = await conn.query(`
            SELECT Id, Name, StartDate__c, EndDate__c, Status__c, CreatedDate, SwitchHolidayDate__c
            FROM PTO_Request__c
            WHERE Requested_By__c = '${candidate.Id}'
            ORDER BY CreatedDate DESC
            LIMIT 10
        `);

        
        const today = new Date();
        const limitDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const limitDateString = limitDate.toISOString().split('T')[0];
        
        const holidays = await conn.query(`
            SELECT Id, Name, Date__c, Country__c
            FROM Holiday__c
            WHERE Country__c = '${candidate.Country__c}'
            AND Type_of_contract__c = '${candidate.Type_of_contract__c}'
            AND CALENDAR_YEAR(Date__c) = ${new Date().getFullYear()}
            AND Date__c >= ${limitDateString}
        `);
        
        return NextResponse.json({
            success: true,
            message: 'Candidate found',
            candidate: result.records[0],
            ptoRequests: ptoRequests.records,
            holidays: holidays.records
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
