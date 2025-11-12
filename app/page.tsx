'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('userId', data.userId)

        if (data.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/client')
        }
      } else {
        setError(data.error || 'Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-orange))',
        padding: '30px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        boxShadow: '0 4px 20px rgba(0, 243, 255, 0.3)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#00f3ff',
          border: '3px solid white',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}>
          AA
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            margin: 0
          }}>
            Adalberto Alves
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
            margin: '5px 0 0 0'
          }}>
            Personal Dog Training
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          padding: '40px',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '400px',
          border: '2px solid var(--neon-blue)',
          boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '30px',
            textAlign: 'center',
            color: 'var(--neon-blue)',
            textShadow: '0 0 10px var(--neon-blue)'
          }}>
            Entrar no Sistema
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--neon-blue)',
                fontSize: '14px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--neon-blue)',
                  background: '#0a0a0a',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="seu@email.com"
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--neon-blue)',
                fontSize: '14px'
              }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--neon-blue)',
                  background: '#0a0a0a',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Sua senha"
              />
            </div>

            {error && (
              <div style={{
                padding: '10px',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid red',
                borderRadius: '8px',
                color: '#ff6b6b',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="button-neon"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(0, 243, 255, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#888'
          }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Admin:</strong> admin@dogtraining.com / admin123
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Cliente:</strong> cliente@exemplo.com / cliente123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
