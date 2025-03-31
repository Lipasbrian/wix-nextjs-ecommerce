export async function POST(request: Request) {
    const { email } = await request.json();
    
    // Add your database/email service logic here
    console.log('Email to save:', email);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }