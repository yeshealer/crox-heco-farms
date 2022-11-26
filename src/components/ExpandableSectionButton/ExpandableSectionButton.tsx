import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from 'crox-new-uikit'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 1%;
  margin-bottom: 1%;
  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
  @media screen and (max-width: 1000px) {
    display: inline-block;
    width: 8%;
    padding-top: 2%;
  }
  @media screen and (max-width: 550px) {
    padding-top: 4%;
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded = false }) => {
  return (
    <Wrapper aria-label="Hide or show expandable content" role="button" onClick={() => onClick()}>
      <Text color="primary" bold>
        {expanded ? '' : ''}
      </Text>
      {/* <img src="/images/farms/arrowup.png" alt=""/> */}
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

export default ExpandableSectionButton
