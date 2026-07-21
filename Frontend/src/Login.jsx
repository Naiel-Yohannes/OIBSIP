import { useState } from 'react'
import { login } from './services/login'
import { setToken } from './services/interceptor'
import toast from 'react-hot-toast'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (!username || !password) {
        toast.error('Please fill in all required fields.')
        return
      }

      const data = await login({ username, password })
      setToken(data.token)
      toast.success('Login successful!')

      setUsername('')
      setPassword('')
    } catch(err){
      toast.error('Login failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label>Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>
  )
}

export default Login
