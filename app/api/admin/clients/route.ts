import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock database
let clients = [
  {
    id: 'c1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    dogName: 'Rex',
    phone: '(11) 98765-4321',
    plan: 'premium',
    status: 'active',
    paymentStatus: 'paid',
    lastPaymentDate: new Date().toISOString()
  },
  {
    id: 'c2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    dogName: 'Bella',
    phone: '(11) 91234-5678',
    plan: 'basic',
    status: 'active',
    paymentStatus: 'pending',
    lastPaymentDate: undefined
  },
  {
    id: 'c3',
    name: 'Carlos Oliveira',
    email: 'carlos@exemplo.com',
    dogName: 'Thor',
    phone: '(11) 99876-5432',
    plan: 'vip',
    status: 'active',
    paymentStatus: 'paid',
    lastPaymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET() {
  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newClient = {
      id: uuidv4(),
      ...data,
      paymentStatus: 'pending',
      lastPaymentDate: undefined
    }

    clients.push(newClient)

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
}
