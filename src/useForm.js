import {useState} from 'react'

export function useForm(initialInputs, schema) {
  const [inputs, setInputs] = useState(initialInputs)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  async function onChange(event) {
    let {target: {type, name, value, checked}} = event
    value = type === 'checkbox' ? checked : value

    let inputErrors = await schema.validateAt(name, {[name]: value}, {abortEarly: false})
      .then(_ => ({[name]: ''}))
      .catch(convert)

    setInputs(inputs => ({...inputs, [name]: value}))
    setErrors({...errors, ...inputErrors})
  }

  function onSubmit(afterSubmit) {
    return async function (event) {
      event.preventDefault()
      setBusy(true)
      let errors = await schema.validate(inputs, {abortEarly: false})
        .then(_ => ({}))
        .catch(convert)
      setErrors(errors)
      if (Object.keys(errors).length) {
        setBusy(false)
      } else {
        await afterSubmit()
        setInputs(initialInputs)
        setBusy(false)
        alert('validation was successfull!')
        alert(JSON.stringify(inputs))
      }
    }
  }

  return {inputs, errors, busy, onChange, onSubmit}
}

function convert(errors){
  if (errors.inner) {
    return errors.inner.reduce((z, item) => {
      const name = (item.path || '').includes('.')
        ? item.path.split('.')[0]
        : item.path || ''
      return z[item.path || ''] ? z : {...z, [name]: item.message}
    }, {})
  } else {
    throw errors
  }
}