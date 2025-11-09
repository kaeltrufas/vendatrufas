// Netlify Function: proxy para o Google Apps Script
// Recebe query params (celular, mes) e repassa para o Web App do Apps Script
// Retorna a resposta original adicionando cabeçalhos CORS

exports.handler = async (event, context) => {
  // Responder preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS'
      },
      body: ''
    };
  }

  const params = event.queryStringParameters || {};
  const celular = params.celular || '';
  const mes = params.mes || '';

  // Substitua pela sua URL do Apps Script se precisar
  const appsScriptUrl = `https://script.google.com/macros/s/AKfycbxpa-ZCZxlrMUjiTKteQ0ETmxnlZr3iDpTH-S7TOv5mRlcXiiXz9ywP0z-MI34-R5YguA/exec?celular=${encodeURIComponent(celular)}&mes=${encodeURIComponent(mes)}`;

  try {
    // Node 18+ em Netlify Functions tem fetch global disponível
    const res = await fetch(appsScriptUrl);
    const text = await res.text();

    // Repasse do status do Apps Script não é crítico aqui; retornamos 200 com o body
    return {
      statusCode: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ erro: 'Erro ao acessar o serviço remoto.' })
    };
  }
};
