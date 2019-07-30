import React, { Fragment } from 'react'
import { Field } from 'redux-form'

export default WrappedComponent => {
  const Input = ({
    hasValidator,
    input,
    ...props
  }) => (
    <Fragment>
      <WrappedComponent
        { ...props }
        { ...input }
        valid={ hasValidator && props.meta.touched && props.meta.valid }
        invalid={ hasValidator && props.meta.touched && props.meta.error }
      />
    </Fragment>
  )

  const ReduxField = props => (
    <Field
      component={ Input }
      hasValidator={ !!props.validate }
      { ...props }
    />
  )

  return ReduxField
}
