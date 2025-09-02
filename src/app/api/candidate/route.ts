import { NextRequest, NextResponse } from 'next/server';
import  jsforce  from 'jsforce';


const SALESFORCE_CONFIG = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://test.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
    
};


export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        const conn = new jsforce.Connection({
            loginUrl: SALESFORCE_CONFIG.loginUrl,
        });

        await conn.login(
            SALESFORCE_CONFIG.username, 
            SALESFORCE_CONFIG.password + SALESFORCE_CONFIG.securityToken
        );
        
        console.log('Conexión exitosa a Salesforce');
        console.log('Usuario autenticado:', conn.userInfo);
        
        const result =  await conn.query(`
            SELECT Id, Howdy_Email__c, Name 
            FROM Candidate__c 
            WHERE Howdy_Email__c = '${email}'
            LIMIT 1
            `);
            
        console.log('Query result:', result);
        console.log('Records found:', result.records.length);
        console.log('Records:', result.records);

            

        if(result.records.length === 0){
            return NextResponse.json({ 
                success: false,
                message: 'Candidate not found'
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Candidate found',
            candidate: result.records[0]
        });

    } catch (error) {
        console.error('Error al obtener el candidato:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json({ 
            success: false,
            message: 'Error al obtener el candidato',
            
        }, { status: 500 });
    }
}
