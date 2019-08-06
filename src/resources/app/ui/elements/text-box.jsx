import React from 'react'
import styled from 'styled-components'

import { AssistiveTextLine, DescriptionTextLine } from 'app/ui/typo'

const easingFunc = 'cubic-bezier(.4, 0, .2, 1)'

const Container = styled.div`
  display: grid;
  & > * {
    min-width: 0;
    min-height: 0;
  }

  position: relative;
  background: transparent;
  color: ${ ({ theme }) => theme.white.on.base };
  grid-template-columns:
    1fr
    ${ ({ hasTrailing }) => hasTrailing && '40px' };
`

const Input = styled.input.attrs({
  type: 'text'
})`
  display: block;
  appearance: none;
  -moz-appearance: textfield; /*hiding the spinners in moz based browsers*/
  border: none;
  border-radius: 0;
  outline: none;
  width: auto;
  line-height: 40px;
  height: 40px;
  background: transparent;
  color: ${
    ({ disabled, theme }) => disabled ?
      theme.secondary.base :
      theme.black.base
  };
  padding-left: 8px;
  ${ ({ hasTrailing }) => !hasTrailing && 'padding-right: 8px;' }
  cursor: ${
    ({ disabled, readOnly }) => (disabled || readOnly) ? 'not-allowed' : 'inherit'
  };

  &::placeholder {
    color: ${ ({ theme }) => theme.secondary.limpid.base };
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
`

const Wrapper = styled.div`
`

const Indicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${
    ({ disabled, theme }) => disabled ?
      theme.secondary.base :
      theme.black.base
  };
`

const Assistive = styled.div`
  display: grid;
  height: 24px;
  & > * {
    min-height: 0;
    min-width: 0;
  }
  grid-template-columns: 1fr min-content;
`

const Label = styled.div`
  transition: transform .3s ${ easingFunc };
  height: 24px;
  transform: ${
    ({ hasValue }) => hasValue ?
      'translate3d(0, 0, 0)' :
      'translate3d(0, 32px, 0)'
  };
`

const TextBox = ({
  invalid,
  trailing,
  ...props
}) => (
  <Wrapper>
    <Label hasValue={ !!props.value }>
      <DescriptionTextLine mostLeft mostRight>{ props.label }</DescriptionTextLine>
    </Label>
    <Container
      hasTrailing={ !!trailing }
    >
      <Input
        hasTrailing={ !!trailing }
        { ...props }
      />
      { trailing && trailing() }
      <Indicator disabled={ props.disabled } />
    </Container>
    <Assistive>
      { props.readOnly &&
        <AssistiveTextLine mostLeft mostRight>
          Read only
        </AssistiveTextLine> ||
        <AssistiveTextLine mostLeft mostRight variant="error">
          { invalid }
        </AssistiveTextLine>
      }
      { props.maxLength &&
        <AssistiveTextLine mostLeft mostRight>
          { props.value.length }/{ props.maxLength }
        </AssistiveTextLine>
      }
    </Assistive>
  </Wrapper>
)

export default TextBox
