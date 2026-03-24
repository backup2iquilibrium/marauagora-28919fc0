import { fetch } from 'node-fetch';

export default async function handler(req: any, res: any) {
  // Chamada via Cron ou Manual para atualizar os horóscopos
  // Verifique o cabeçalho de autorização se desejar segurança extra
  
  try {
    console.log("Iniciando cron de atualização de horóscopo...");
    
    // Invocando a Edge Function do Supabase
    // A URL é a da sua instância do Supabase
    const supabaseUrl = "https://drgyofnpaaatarqydagr.supabase.co";
    const functionUrl = `${supabaseUrl}/functions/v1/scrape-horoscope`;
    
    // Usamos a chave anon ou service_role se disponível no ambiente
    const authKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4";

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Falha ao invocar função: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Cron finalizado com sucesso:", result);
    
    return res.status(200).json({ 
      success: true, 
      message: "Horóscopos atualizados", 
      data: result 
    });
  } catch (error: any) {
    console.error("Erro no Cron de Horóscopo:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
