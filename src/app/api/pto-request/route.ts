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

        const ptoRequestData = {
            StartDate__c: formData.startDate,
            EndDate__c: formData.endDate,
            Type_of_License__c: formData.typeOfLicense,
            Requested_By__c: formData.candidateId,
        };

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
