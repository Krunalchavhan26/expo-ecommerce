import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function LoginPage() {
  return (
    <div>
      <h1>LoginPage</h1>
      <SignIn />
    </div>
  )
}

export default LoginPage