import '../../styles/mint.scss';
import { Container } from 'react-bootstrap';
import ApiBTC from '../../assets/images/ApiBTC.png';
// import apiICR from '../../assets/images/apiICR2.png';
import ApiTron from '../../assets/images/ApiTron.png';
import Arrow from '../../assets/images/mintarrow.png';
import { ArbiNFTInfo, useAbiBotActionHandlers, useAbiBotMintInfo, useAbiBotState } from '../../state/abibot/hooks';
import { useCallback, useState } from 'react';
import MintModal from './MintModal';

// const getImageFromBaseURI = (uri: string): string => {
//   return `https://gateway.pinata.cloud/${uri}1.png`;
// };

const MINT: React.FC = () => {
  const mintInfos = useAbiBotMintInfo(['0x09D7BF82A90D5D4A5C5CB46C6D25989FC0373856']);
  const [selectedBot, setSelectedBot] = useState<ArbiNFTInfo | undefined>(mintInfos[0]);
  const { onUserInput, onTxHashChange } = useAbiBotActionHandlers();
  const { typedValue } = useAbiBotState();

  const [showMint, setShowMint] = useState(false);

  const handleDismissMint = useCallback(() => {
    setShowMint(false);
    onUserInput('1');
    onTxHashChange('');
  }, [showMint, selectedBot]);

  console.log('mintInfos: ', mintInfos, selectedBot);
  const increaseMintAmount = useCallback(() => {
    console.log('increasing mint amount');

    onUserInput((Number(typedValue) + 1).toString());
  }, [typedValue]);

  const decreaseMintAmount = useCallback(() => {
    if (Number(typedValue) > 1) {
      onUserInput((Number(typedValue) - 1).toString());
    }
  }, [typedValue]);

  return (
    <>
      <h2 className="title">Minting now open !</h2>
      <Container>
        <MintModal isOpen={showMint} onDismiss={handleDismissMint} mintInfo={selectedBot} />
        <div id="bot">
          <h3>Choose your Arbitrage Bot</h3>
          <div className="images">
            {mintInfos &&
              mintInfos.length > 0 &&
              mintInfos.map((info, index) => (
                <div key={index} className="imgparent">
                  <p>{info.maxMintAmount - info.totalSupply} Left</p>
                  <button onClick={() => setSelectedBot(info)}>
                    <img src={ApiTron} alt="" />
                  </button>
                  <div>
                    <img className="arrow" src={Arrow} alt="" />
                    <p>earn ICR</p>
                  </div>
                </div>
              ))}
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
              Max : <span style={{ color: '#E90A0E' }}>{selectedBot?.maxMintPerTransaction}</span>
            </p>
            <div className="plusminus">
              <button onClick={decreaseMintAmount}>-</button>
              <input type="number" placeholder={typedValue} value={typedValue} />
              <button onClick={increaseMintAmount}>+</button>
            </div>
            <div className="mintnft">
              <input type="text" placeholder={selectedBot?.cost.toSignificant() ?? '-'} />
              <button onClick={() => setShowMint(true)}>Mint NFT</button>
            </div>
            <p>Click on mint to Buy your NFT Token.</p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default MINT;
