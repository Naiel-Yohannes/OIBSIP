import { useState } from 'react'
import { createUser } from './services/user'
import toast from 'react-hot-toast'

const Regisster = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState('customer')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (!name || !username || !email || !password || !address) {
        toast.error('Please fill in all required fields.')
        return
      }

      const hasMinLength = password.length >= 8
      const hasLowercase = /[a-z]/.test(password)
      const hasUppercase = /[A-Z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecial = /[^A-Za-z0-9]/.test(password)

      if(!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecial){
        toast.error(
          'Password must be at least 8 characters and contain: ' +
          'an uppercase letter, a lowercase letter, a number, and a special character.'
        )
        return
      }

      const newUser = { name, username, email, password, address, role }
      await createUser(newUser)
      toast.success('Registration successful!')
      
      setName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setAddress('')
      setRole('customer')
    } catch(err) {
      toast.error('Registration failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      
      <div>
        <label>Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
        <label>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div>
        <label>Address</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit">Register</button>
    </form>
  )
}

export default Regisster
