import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle } from 'crox-new-uikit'
import useI18n from 'hooks/useI18n'
import './farmtab.scss'

const FarmTabButtons = ({ stakedOnly, setStakedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  const history = useHistory();

  return (
    <Wrapper>
      <ToggleWrapper>
        <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
        <Text> {TranslateString(699, 'Staked only')}</Text>
      </ToggleWrapper>
      <label>
        <input type='checkbox' />
        <span className='base-color'>
          <span className='toggle-slider' />
          <span className='cash' onClick={() => { history.replace(url) }}>Active</span>
          <span className='token' onClick={() => { history.replace(`${url}/history`) }}>Finished</span>
        </span>
      </label>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1000px) {
    display: flex;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
  @media screen and (max-width: 1000px) {
    margin-right: 35;
  }
`