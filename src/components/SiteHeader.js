import styled from 'styled-components';
import SiteLogo from '../assets/svg/site-logo.svg';

const $SiteHeader = styled.div`
  background-color: #324a5f;
  color: white;
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const $SiteLogo = styled.img`
  height: 25px;
  margin-left: 5px;
`;

export const SiteHeader = () => {
  return (
    <$SiteHeader>
      <$SiteLogo src={SiteLogo} />
    </$SiteHeader>
  );
};
