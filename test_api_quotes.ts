import handler from './api/quotes.ts';

const mockReq: any = { method: 'GET' };
const mockRes: any = {
    status: (code: number) => {
        console.log('Status:', code);
        return mockRes;
    },
    json: (data: any) => {
        console.log('JSON Output:', JSON.stringify(data, null, 2));
        return mockRes;
    }
};

async function test() {
    process.env.VITE_SUPABASE_URL = 'https://drgyofnpaaatarqydagr.supabase.co';
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4';
    
    console.log('Calling handler...');
    try {
        await handler(mockReq, mockRes);
    } catch (e) {
        console.error('Error in handler:', e);
    }
}

test();
