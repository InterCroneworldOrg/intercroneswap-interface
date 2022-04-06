import styled from 'styled-components';
import Banner from '../../assets/images/rocket.png';
import Rectangle from '../../assets/images/rectangle.png';

const BannerWrapper = styled.div`
  background-image: url(${Banner});
  height: 800px;
  background-size: cover;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
`;
const BannerBottom = styled.div`
  background-image: url(${Rectangle});
  height: 240px;
  background-size: cover;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: -190px;
`;

const BannerContent = styled.div`
  padding: 50px;
`;

const BannerHeading = styled.h1`
  font-family: Jost;
  font-size: 40px;
  font-weight: 800;
  line-height: 72px;
  letter-spacing: 0em;
  text-align: left;
  background: -webkit-linear-gradient(360deg, #ffb807 38.83%, #ffea00 79.17%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BannerDescription = styled.p`
  font-family: Poppins;
  font-size: 18px;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(255, 255, 255, 1);
`;

const Home = () => {
  return (
    <>
      <BannerWrapper>
        <BannerContent>
          <BannerHeading>Welcome to InterCrone!</BannerHeading>
          <BannerDescription>Join the coolest multichain swapping platform in the whole universe!</BannerDescription>
        </BannerContent>
      </BannerWrapper>
      <BannerBottom></BannerBottom>
    </>
  );
};

export default Home;
