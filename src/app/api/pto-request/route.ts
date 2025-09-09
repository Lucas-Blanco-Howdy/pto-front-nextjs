import { NextRequest, NextResponse } from 'next/server';
import jsforce from 'jsforce';

const SALESFORCE_CONFIG = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://test.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
};

export async function POST(request: NextRequest){
    try{
        const authEmail = request.headers.get('x-user-email');
        
        if (!authEmail) {
            return NextResponse.json(
                { error: 'Missing authentication' }, 
                { status: 401 }
            );
        }
        
        const formData = await request.json();

        console.log('Form data:', formData);

        const conn = new jsforce.Connection({
            loginUrl: SALESFORCE_CONFIG.loginUrl,
        });

        await conn.login(
            SALESFORCE_CONFIG.username, 
            SALESFORCE_CONFIG.password + SALESFORCE_CONFIG.securityToken
        );

        console.log('conexion success');
        console.log('User info:', conn.userInfo);

        const candidateCheck = await conn.query(
            `SELECT Id, Howdy_Email__c 
             FROM Candidate__c 
             WHERE Id = '${formData.candidateId}' AND Howdy_Email__c = '${authEmail}' 
             LIMIT 1`
        );
        
        if (candidateCheck.records.length === 0) {
            return NextResponse.json(
                { error: 'Unauthorized: You can only submit requests for your own profile' }, 
                { status: 403 }
            );
        }

        let ptoRequestData;
        
        if (formData.typeOfLicense === 'Switch holiday') {

            const holidayResult = await conn.query(`
                SELECT Date__c
                FROM Holiday__c
                WHERE Id = '${formData.holiday}'
                LIMIT 1
            `);

            const holidayDate = holidayResult.records[0].Date__c;

            ptoRequestData = {
                StartDate__c: formData.switchDate,
                SwitchHolidayDate__c: holidayDate,
                Name: formData.typeOfLicense,
                Requested_By__c: formData.candidateId,
                Status__c: 'Pending'
            };
        } else {
            ptoRequestData = {
                StartDate__c: formData.startDate,
                EndDate__c: formData.endDate,
                Name: formData.typeOfLicense,
                Requested_By__c: formData.candidateId,
                Status__c: 'Pending'
            };
        }

        const result = await conn.sobject('PTO_Request__c').insert(ptoRequestData);

        console.log('PTO request inserted:', result);
        

        return NextResponse.json({ 
            success: true,
            message: 'Form sent correctly',
            data: formData
        });
    } catch (error) {
        console.error('Error form:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error sengind form',
            error: error
        }, { status: 500 });
    }
}
