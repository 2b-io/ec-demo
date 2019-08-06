import styled from 'styled-components'

const Container = styled.div`
  margin: auto;
  padding: 16px;
  max-width: ${
    ({ allowFullWidth }) => allowFullWidth ? 'none' : '1024px'
  };
`

export default Container
