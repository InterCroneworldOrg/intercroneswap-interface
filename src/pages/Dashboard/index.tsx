import '../../styles/dashboard.scss';
import { Container, Row, Col } from 'react-bootstrap';
import cra from '../../assets/images/apiICR.png';
import crb from '../../assets/images/cr2.png';
import crc from '../../assets/images/cr3.png';
import trx from '../../assets/images/trxlogo.png';
import cc from '../../assets/images/cc.png';
import trxb from '../../assets/images/trx.png';
import ithumb from '../../assets/images/ithumb.png';
import eth from '../../assets/images/eth.png';

const Dashboard: React.FC = () => {
  return (
    <>
      <Container fluid id="dashboard">
        <div className="dbMain">
          <h2>InterCrone World ArbiSwap</h2>
          <div className="dbFirstElm">
            <div className="dbFirstTop">
              <div className="dbFirstChild1">
                <div className="dbfprice">
                  <img src={cra} alt="" />
                  <span>1 x NFT</span>
                </div>
                <div className="dbfprice">
                  <img src={crb} alt="" />
                  <span>1 x NFT</span>
                </div>
                <div className="dbfprice">
                  <img src={crc} alt="" />
                  <span>4 x NFT</span>
                </div>
              </div>
              <div className="dbFirstChild2">sdfds</div>
            </div>
            <div className="dbSecondTop">
              <div className="dbSecondChld">
                <div className="dbcpCircle">
                  <img src={trx} alt="" />
                </div>
                <div className="dbCp">
                  <h4>Current Profit</h4>
                  <div className="dbcpRow">
                    <span className="colrA">
                      <span></span> Win
                    </span>
                    <span className="yellowCol">61.151.151</span>
                  </div>
                  <div className="dbcpRow">
                    <span className="colrB">
                      <span></span> Trx
                    </span>
                    <span className="yellowCol">1570</span>
                  </div>
                  <div className="dbcpRow">
                    <span className="colrC">
                      <span></span> Bttc
                    </span>
                    <span className="yellowCol">157.000.021</span>
                  </div>
                  <div className="dbcpRow">
                    <span className="colrD">
                      <span></span> Usdt
                    </span>
                    <span className="yellowCol">1570</span>
                  </div>
                </div>
              </div>
              <div className="dbSecondChld">
                <div className="dbCp">
                  <h4>You will receive</h4>
                  <div className="dbcpRow">
                    <span className="receiveWhite">Icr</span>
                    <span className="yellowCol">1,694.15</span>
                  </div>
                  <div className="dbcpRow">
                    <span className="receiveWhite">Btc</span>
                    <span className="yellowCol">0.00148</span>
                  </div>
                  <div className="dbcpRow">
                    <span className="receiveWhite">Ussd</span>
                    <span className="yellowCol">1,150.15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5>LP Pool Overview</h5>
          <div className="poolOverview">
            <div className="poolBlock">
              <div className="poolHdn">
                <img src={cc} alt="" />
                Btc /<img src={trxb} alt="" /> Trx
              </div>
              <div className="poolTxt">
                <span>Intercrone </span>
                <span>USD 11,223.32</span>
              </div>
              <div className="poolTxt">
                <span>Sunswap </span>
                <span>USD 11,223,215.32</span>
              </div>
              <div className="profit">
                <small>Profit</small>
                <h2>$3,412.66</h2>
              </div>
            </div>
            <div className="poolBlock">
              <div className="poolHdn">
                <img src={ithumb} alt="" />
                Icr /<img src={eth} alt="" /> Eth
              </div>
              <div className="poolTxt">
                <span>Intercrone </span>
                <span>USD 11,223.32</span>
              </div>
              <div className="poolTxt">
                <span>Sunswap </span>
                <span>USD 11,223,215.32</span>
              </div>
              <div className="profit">
                <small>Profit</small>
                <h2>$1412.66</h2>
              </div>
            </div>
            <div className="poolBlock">
              <div className="poolHdn">
                <img src={ithumb} alt="" />
                Icr /<img src={trxb} alt="" /> Trx
              </div>
              <div className="poolTxt">
                <span>Intercrone </span>
                <span>USD 11,223.32</span>
              </div>
              <div className="poolTxt">
                <span>Sunswap </span>
                <span>USD 11,223,215.32</span>
              </div>
              <div className="profit">
                <small>Profit</small>
                <h2>$412.66</h2>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
