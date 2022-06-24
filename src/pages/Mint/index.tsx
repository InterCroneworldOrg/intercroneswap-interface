import '../../styles/mint.scss';
import { Container } from 'react-bootstrap';
import ApiBTC from '../../assets/images/ApiBTC.png';
import apiICR from '../../assets/images/apiICR2.png';
import ApiTron from '../../assets/images/ApiTron.png';
import Arrow from '../../assets/images/mintarrow.png';

const MINT: React.FC = () => {
  return (
    <>
      <h2 className="title">Minting now open !</h2>
      <Container>
        <div id="bot">
          <h3>Choose your Arbitrage Bot</h3>
          <div className="images">
            <div className="imgparent">
              <p>1204 Left</p>
              <img src={apiICR} alt="" />
              <div>
                <img className="arrow" src={Arrow} alt="" />
                <p>earn ICR</p>
              </div>
            </div>
            <div className="imgparent">
              <img src={ApiTron} alt="" />
            </div>
            <div className="imgparent">
              <img src={ApiBTC} alt="" />
            </div>
            <div className="imgparent">
              <img src={ApiBTC} alt="" />
            </div>
            <div className="imgparent">
              <img src={ApiBTC} alt="" />
            </div>
          </div>
          <div className="buymint">
            <p>
              Max : <span style={{ color: '#E90A0E' }}>20</span>
            </p>
            <div className="plusminus">
              <button>-</button>
              <input type="number" placeholder="1" />
              <button>+</button>
            </div>
            <div className="mintnft">
              <input type="text" placeholder="1500 TRX" />
              <button>Mint NFT</button>
            </div>
            <p>Click on mint to Buy your NFT Token.</p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default MINT;
