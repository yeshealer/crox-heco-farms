import React from "react";
import styled from "styled-components";
import { Card, CardBody, Button, Flex, Text } from "crox-new-uikit";
import useFarmsWithBalance from "hooks/useFarmsWithBalance";

const StyledFourWayCard = styled(Card)`
  background: #3b3c4e;
  max-width: 4000px;
  width: 240px;
  margin: 0 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const CardNumber = styled(Text)`
  border-radius: 10px;
  width: 36px;
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  position: absolute;
  margin-top: -15px;
  margin-left: -15px;
  background-color: #2c2d3a;
`;

const PercentText = styled.div`
  color: #2d74c4;
  border-top: 1px solid #2c2d3a;
  font-weight: 900;
  font-size: 27px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const TypeText = styled(Text)`
  font-size: 14px;
  text-align: center;
  padding-bottom: 8px;
  font-weight: bold;
`;

const DescText = styled(Text)`
  font-size: 14.5px;
  text-align: center;
  width: 180px;
`;

const Actions = styled.div`
  margin-top: 4px;
  text-align: center;
`;

const FourWayCard = (props) => {
  const { number, desc, percent, type, buttonText, onClick } = props;

  return (
    <StyledFourWayCard>
      <CardNumber color='white'>{number}</CardNumber>
      <Flex p='15px 10px 10px' mt='5px' justifyContent='center' style={{ height: '55px' }} alignItems='center'>
        <DescText bold color='textSubtle'>{desc}</DescText>
      </Flex>

      <PercentText>{percent}%</PercentText>
      <TypeText color='textSubtle'>{type}</TypeText>

      <Actions>
        <Button onClick={onClick} style={{ padding: '10px 15px', height: 'auto', fontSize: '15px', borderRadius: '8px', backgroundColor: '#2d74c4' }}> {buttonText} </Button>
      </Actions>
    </StyledFourWayCard>
  );
};

export default FourWayCard;
