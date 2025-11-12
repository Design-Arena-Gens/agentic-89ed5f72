import { NextResponse } from 'next/server'

// Import clients from the clients route (in a real app, this would be a shared database)
// For this demo, we'll make an API call to update the client

export async function POST(request: Request) {
  try {
    const { clientId, date } = await request.json()

    // In a real application, you would update the database here
    // For this demo, we'll return success

    return NextResponse.json({
      success: true,
      clientId,
      paymentDate: date
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao registrar pagamento' },
      { status: 500 }
    )
  }
}
