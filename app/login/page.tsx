'use client'

import { useState } from 'react'
import { sendOtp, verifyOtp } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')

  async function handleSend() {
    await sendOtp(email)
    setStep('otp')
  }

  async function handleVerify() {
    const session = await verifyOtp(email, token)
    console.log('ログイン成功', session)
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ padding: 20 }}>
      {step === 'email' && (
        <>
          <h2>ログイン</h2>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSend}>コードを送信</button>
        </>
      )}

      {step === 'otp' && (
        <>
          <h2>届いたコードを入力</h2>
          <input
            type="text"
            placeholder="6桁のコード"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={handleVerify}>ログイン</button>
        </>
      )}
    </div>
  )
}