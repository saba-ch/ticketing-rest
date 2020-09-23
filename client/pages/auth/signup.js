import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/useRequest'

export default () => {
  const [email, setEmal] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({
    method: 'post',
    body: { email, password },
    url: '/api/users/signup',
    onSuccess: () => {
      Router.push('/')
    }
  })

  const handleSubmit = async e => {
    e.preventDefault()
    
    await doRequest()
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmal(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='Password'
          className='form-control'
        />
      </div>
      {errors && errors}
      <button className='btn btn-primary'>
        Sign Up
      </button>
    </form>
  )
}