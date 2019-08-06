import styled from 'styled-components'

const Break = styled.div`
  height: ${
    ({ double }) => double ? 32 : 16
  }px;
`

export default Break
