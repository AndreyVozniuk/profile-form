import React from 'react'
import {useForm} from './useForm'
import * as Y from 'yup'

const initialInputs = {
  username: '',
  email: '', 
  about: ''
}

const schema = Y.object().shape({
  username: Y.string().required().min(3).max(25),
  email: Y.string().required().email(),
  about: Y.string().required().min(5).max(200)
})

function Form(){
  const {inputs, errors, busy, onChange, onSubmit} = useForm(initialInputs, schema)

  async function handleSubmit() {
    await delay(500)
    console.log('some logic code...')
  }

  return <> 
  <h1>Edit Profile</h1>
  <form onSubmit={onSubmit(handleSubmit)}>
    <div className='form-group'>
      <label>Username</label> {`(${errors.username || '*'})`}<br />
      <input name='username' className='form-control' type='text' placeholder='enter username here' 
      onChange={onChange}
      value={inputs.username}
      />
    </div>
    
    <div className='form-group'>
      <label>Email</label> {`(${errors.email || '*'})`}<br />
      <input name='email' className='form-control' type='text' placeholder='enter email here' 
      onChange={onChange}
      value={inputs.email}
      />
    </div>

    <div className='form-group'>
      <label>About</label>  {`(${errors.about || '*'})`}<br />
      <textarea name='about' className='form-control' type='text' placeholder='...'  
      style={{minHeight: '300px'}} 
      onChange={onChange}
      value={inputs.about}
      />
    </div>

    <button className='btn btn-primary' type='submit' disabled={busy}>Submit</button>
  </form>
  </>
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export default Form