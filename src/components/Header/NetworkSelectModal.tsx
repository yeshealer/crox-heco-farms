import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Link, Button } from 'crox-new-uikit'
import networkList from './NetworkList'

const StyledModal = styled.div`
  background: radial-gradient( at center, #0f1c3c, #121827 );
  border: 1px solid darkslategrey;
  padding: 20px 0;
  border-radius: 10px;
  margin: 0 30px;
  text-align: center;
  width: 580px;
  transition: all ease 200ms;
  @media screen and (max-width: 580px) {
    width: 360px;
    .searchInput {
      width: 300px !important;
    }
  }
`

const NetworkSelector = styled.button`
  background: transparent;
  border: none;
  border-radius: 10px;
  text-align: center;
  transition: all 300ms;
  margin: 10px;
  margin-bottom: 0;
  padding: 10px 20px;
  cursor: pointer;
  &:hover{
    transform: scale(1.05)
  }
`

const LiveSign = styled.div`
  background-color: #01943f;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
`


const imagePath = "https://via.placeholder.com/10";

const NetworkSelectModal = ({ onDismiss }) => {

  return (
    <StyledModal>
      <Button style={{ position: "fixed", right: '50px', top: '20px', backgroundColor: 'transparent', boxShadow: 'none', width: '20px' }} onClick={onDismiss}>&#10006;</Button>
      <Text fontSize="18px" color="#2d74c4">Select Source Chain</Text>
      {networkList.map((entry) => (
        <a href={entry.link}>
          <NetworkSelector>
            <Flex alignItems="center" flexDirection='column'>
              <img src={`/images/network/${entry.img}_net.svg`} alt={`${entry.title} icon`} width='80px' height='80px' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = `images/network/${entry.img}_net.svg`
              }} />
              <Flex alignItems='center'>
                {entry.title === 'HECO' && <LiveSign />}
                <Text color={entry.color} ml='3px'>{entry.title}</Text>
              </Flex>
            </Flex>
          </NetworkSelector>
        </a>
      ))}
    </StyledModal>
  )
}

export default NetworkSelectModal
