import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Mock database
const users = [
  {
    id: '1',
    email: 'admin@dogtraining.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    name: 'Adalberto Alves'
  },
  {
    id: '2',
    email: 'cliente@exemplo.com',
    password: bcrypt.hashSync('cliente123', 10),
    role: 'client',
    name: 'Cliente Exemplo',
    clientId: 'c1'
  }
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      role: user.role,
      userId: user.id,
      name: user.name
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro no servidor' },
      { status: 500 }
    )
  }
}
