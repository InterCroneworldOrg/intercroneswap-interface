import { GreyCard, LightCard } from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import { AutoRow } from '../../components/Row';
import { useActiveWeb3React } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import { Divider, isMobile, TYPE } from '../../theme';
import { ETHER, Token, TokenAmount, WETH } from '@intercroneswap/v2-sdk';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import Input, { StyledInput } from '../../components/NumericalInput';
import { ButtonPrimary } from '../../components/Button';
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency';
import { AbitrageDetail } from '../../components/Abitrage/BotDetail';
import { BACKEND_URL } from '../../constants';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import useInterval from '../../hooks/useInterval';
import { getTokenFromDefaults, ICR } from '../../constants/tokens';
import CurrencyLogo from '../../components/CurrencyLogo';
import EarnModal from '../../components/Abitrage/EarnModal';
import { useEarningInfo } from '../../state/abibot/hooks';

export interface EarningData {
  token_address: string;
  freq_seconds: number;
  active: boolean;
}

export interface EarningConfig {
  token: Token;
  freq_seconds: number;
  active: boolean;
}

export interface QueueData {
  token: Token;
  profit: TokenAmount;
}

const configToRequest = (config: EarningConfig): EarningData => {
  return {
    token_address: config.token.address,
    freq_seconds: config.freq_seconds,
    active: config.active,
  };
};

export const AbitrageBots: React.FC = () => {
  const { chainId } = useActiveWeb3React();

  const [bots, setBots] = useState<EarningData[]>([]);
  const [currentWallet, setCurrentWallet] = useState('');
  const [tronPk, setTronPk] = useState('');
  const [walletInfo, setWalletInfo] = useState<any>(undefined);
  const [queue, setQueue] = useState<QueueData[]>([]);
  const [showEarning, setShowEarning] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
  const { isOwner } = useEarningInfo();
  const [selectedConfig, setSelectedConfig] = useState<EarningConfig>({
    token: wrappedCurrency(ETHER, chainId) ?? WETH[chainId ?? 11111],
    freq_seconds: 0,
    active: true,
  });

  const handleEarning = (token: Token) => {
    setShowEarning(true);
    setSelectedToken(token);
  };

  const handleDismissEarning = useCallback(() => {
    setShowEarning(false);
    setSelectedToken(undefined);
  }, [selectedToken, showEarning]);

  const getCurrentWallet = async () => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/currentwallet?chainId=${chainId}`, {
      method: 'GET',
      mode: 'cors',
    });
    if (response.status == 200) {
      const json = await response.json();
      setCurrentWallet(json.data);
    }
  };

  const getWalletInfo = async () => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/walletinfo?chainId=${chainId}`, {
      method: 'GET',
      mode: 'cors',
    });
    if (response.status == 200) {
      const json = await response.json();
      setWalletInfo(json.data);
    }
  };

  const getLastQueue = async () => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/lastqueue?chainId=${chainId}`, {
      method: 'GET',
      mode: 'cors',
    });
    if (response.status == 200) {
      const json = await response.json();
      const q: QueueData[] = json.data.map((data: any) => {
        return {
          token: getTokenFromDefaults(data.token),
          profit: new TokenAmount(ICR, data.response.profit),
        };
      });
      setQueue(q);
    }
  };

  useInterval(() => {
    getWalletInfo();
    getLastQueue();
  }, 10 * 1000);

  useEffect(() => {
    getAllBots();
    getCurrentWallet();
  }, []);

  const createBot = async (config: EarningConfig) => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/create?chainId=${chainId}`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(configToRequest(config)),
    });
    if (response.status == 200) {
      setBots([...bots, configToRequest(config)]);
    }
  };
  const deleteBot = async (config: EarningData) => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/delete?chainId=${chainId}`, {
      method: 'DELETE',
      mode: 'cors',
      body: JSON.stringify(config),
    });
    if (response.status == 200) {
      const newBots = bots.filter((value) => value.token_address === config.token_address);
      setBots(newBots);
    }
  };

  const CreateBots = useCallback(() => {
    return isOwner ? (
      <GreyCard>
        <StyledHeading>Create bot</StyledHeading>
        <AutoColumn justify="center">
          <CurrencyInputPanel
            hideInput={true}
            hideBalance={true}
            value=""
            onUserInput={() => {
              console.log('disabled');
            }}
            onCurrencySelect={(c) => {
              setSelectedConfig({
                ...selectedConfig,
                token: wrappedCurrency(c, chainId ?? 11111) ?? WETH[11111],
              });
            }}
            showMaxButton={false}
            currency={unwrappedToken(selectedConfig.token)}
            id="nft-payout-token"
            showCommonBases
          />
          <AutoRow justify="space-around">
            <TYPE.white>Frequency Seconds</TYPE.white>
            <Input
              style={{ width: '25%' }}
              className="recipient-address-input"
              type="number"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Frequency Seconds"
              error={false}
              onUserInput={(value) =>
                setSelectedConfig({
                  ...selectedConfig,
                  freq_seconds: Number(value),
                })
              }
              value={selectedConfig?.freq_seconds}
            />
          </AutoRow>
          <ButtonPrimary onClick={() => createBot(selectedConfig)}>Create Bot</ButtonPrimary>
        </AutoColumn>
      </GreyCard>
    ) : undefined;
  }, [isOwner, selectedToken, selectedConfig]);

  const WalletInfo = useCallback(() => {
    return isOwner ? (
      <GreyCard>
        <StyledHeading>Info</StyledHeading>
        <AutoRow justify="space-between">
          <TYPE.yellow>Wallet info</TYPE.yellow>
          <TYPE.yellow>{ethAddress.toTron(currentWallet)}</TYPE.yellow>
          <AutoColumn>
            <AutoRow justify="space-between">
              <TYPE.white>BW :</TYPE.white>
              <TYPE.yellow>{walletInfo?.Resources?.Bandwidth}</TYPE.yellow>
            </AutoRow>
            <AutoRow justify="space-between">
              <TYPE.white>Energy :</TYPE.white>
              <TYPE.yellow>{walletInfo?.Resources?.Energy}</TYPE.yellow>
            </AutoRow>
            <AutoRow justify="space-between">
              <TYPE.white>Max poss trades :</TYPE.white>
              <TYPE.yellow>{walletInfo?.MaxPossibleTrades}</TYPE.yellow>
            </AutoRow>
          </AutoColumn>
        </AutoRow>
        <AutoRow>
          <TYPE.white>Change wallet</TYPE.white>
          <StyledInput
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            pattern="*."
            placeholder="Tron Primary Key"
            onChange={(event) => setTronPk(event.target.value)}
            value={tronPk}
          />
          <ButtonPrimary onClick={updatePk}>Change PK</ButtonPrimary>
        </AutoRow>
      </GreyCard>
    ) : undefined;
  }, [isOwner]);

  const DetailsView = useCallback(() => {
    return isOwner ? (
      <>
        <AutoRow justify="space-around">
          <TYPE.white>Token</TYPE.white>
          <TYPE.white>Frequency</TYPE.white>
          <TYPE.white>Active</TYPE.white>
          <TYPE.white>Activate</TYPE.white>
        </AutoRow>
        {bots.map((bot, index) => (
          <AbitrageDetail key={index} bot={bot} updateBot={updateBot} deleteBot={deleteBot} />
        ))}
      </>
    ) : undefined;
  }, [bots, isOwner]);

  const updateBot = async (config: EarningData) => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/update?chainId=${chainId}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(config),
    });
    if (response.status == 200) {
      const newBots = bots.map((value) => {
        if (value.token_address === config.token_address) {
          value = config;
        }
        return value;
      });
      setBots(newBots);
    }
  };

  const updatePk = async () => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/setwallet?chainId=${chainId}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({
        private_key: tronPk,
      }),
    });
    if (response.status == 200) {
      await getCurrentWallet();
      setTronPk('');
    }
  };

  const getAllBots = async () => {
    const response = await fetch(`${BACKEND_URL}/abitrage/earning/getall?chainId=${chainId}`, {
      mode: 'cors',
    });
    const data = await response.json();

    const fetchedBots: EarningData[] = data.data.map((earning: any) => {
      return {
        token_address: earning.token_address,
        freq_seconds: earning.freq_seconds,
        active: earning.active,
      };
    });

    setBots(fetchedBots);
  };

  return (
    <>
      <StyledHeading>Open Abitrage Slots</StyledHeading>
      <TYPE.white padding={30}>
        We are out of energy! But that does not keep us away from searching for arbitrages! Hit the button and grab your
        profits!
      </TYPE.white>
      <PageWrapper gap="24px">
        <EarnModal isOpen={showEarning} onDismiss={handleDismissEarning} token={selectedToken} />
        <LightCard>
          <AutoColumn gap="24px">
            <AutoRow justify="space-evenly" style={{ paddingRight: '8rem' }}>
              <TYPE.white>Name</TYPE.white>
              <TYPE.white>Exchange</TYPE.white>
              <TYPE.white>Profit</TYPE.white>
            </AutoRow>
            <Divider />
            {queue.map((item, index) => {
              return (
                <GreyCard key={index}>
                  <AutoRow justify="space-between" gap="1rem">
                    <TYPE.white>{index}</TYPE.white>
                    <AutoColumn>
                      <AutoRow justify={isMobile ? 'center' : undefined}>
                        <CurrencyLogo currency={unwrappedToken(ICR)} size="1.2rem" />
                        &nbsp;
                        <TYPE.white fontWeight={500} fontSize="1rem">
                          {ICR.symbol}&nbsp;/
                        </TYPE.white>
                        &nbsp;
                        <CurrencyLogo currency={unwrappedToken(item.token)} size="1.2rem" />
                        &nbsp;
                        <TYPE.white fontWeight={500} fontSize="1rem">
                          {item.token.symbol}
                        </TYPE.white>
                      </AutoRow>
                    </AutoColumn>
                    <TYPE.white>Sunswap</TYPE.white>
                    <AutoColumn justify="center">
                      <AutoRow>
                        <TYPE.white>{item.profit.toSignificant()}</TYPE.white>
                        <CurrencyLogo currency={unwrappedToken(ICR)} />
                      </AutoRow>
                    </AutoColumn>
                    <ButtonPrimary onClick={() => handleEarning(item.token)} width="10rem" style={{ margin: 0 }}>
                      Take Profit
                    </ButtonPrimary>
                  </AutoRow>
                </GreyCard>
              );
            })}
          </AutoColumn>
          <AutoColumn gap="24px">
            {WalletInfo()}
            {CreateBots()}
            {DetailsView()}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
};
