import useMounted from '@src/hooks/useMounted';
import { findAllEligibleAirdroppedTokenByUser } from '@src/utils/findAllEligibleAirdroppedTokenByUser';
import { getAirdropAmountsPerRound } from '@src/utils/getAirdropAmounts';
import { getAirdropSnapshotTimestamps } from '@src/utils/getAirdropSnapshotTimestamps';
import { getAirdropTargetAddresses } from '@src/utils/getAirdropTargetAddresses';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import CommonError from '../common/ComomonError';
import ErrorBoundary from '../common/ErrorBoundary';
import NextBtn from '../common/NextBtn';
import SSRSafeSuspense from '../common/SSRSafeSuspense';

{
  /* claim 대상자의 경우 airdrop info */
}

const AirdropInfo = () => {
  return (
    <ErrorBoundary
      renderFallback={({ error, reset }) => <CommonError error={error} reset={reset} />}
    >
      {/*  TODO skeleton 추가 */}
      <SSRSafeSuspense fallback={<ClipLoader size={50} color={'#ffffff'} />}>
        <Resolved />
      </SSRSafeSuspense>
    </ErrorBoundary>
  );
};

function Resolved() {
  const isMounted = useMounted();

  const router = useRouter();
  const [isAirdropContractOpened, setIsAirdropContractOpened] = useState<RouterQuery>();
  const [airdropTokenAddress, setAirdropTokenAddress] = useState<RouterQuery>();
  const [governanceToken, setGovernanceToken] = useState<RouterQuery>();
  const [tokenSupply, setTokenSupply] = useState<RouterQuery>();

  const userAddress = isMounted ? localStorage?.getItem('ownerAddress') : false;
  const [userEligibleTokenList, setUserEligibleTokenList] = useState();

  useLayoutEffect(() => {
    const { isAirdropContractOpened, airdropTokenAddress, governanceToken, tokenSupply } =
      router.query;

    setIsAirdropContractOpened(isAirdropContractOpened);
    setAirdropTokenAddress(airdropTokenAddress);
    setGovernanceToken(governanceToken);
    setTokenSupply(tokenSupply);
  }, [router?.query]);

  const getList = async () => {
    if (userAddress === false) {
      return;
    }
    const data = await findAllEligibleAirdroppedTokenByUser(userAddress);

    setUserEligibleTokenList(data);
  };

  useEffect(() => {
    getList();
  }, []);

  const total = parseInt(tokenSupply?.toString());

  const [nowAirdropTimestamp, setNewAirdropTimestamp] = useState('');
  const [AirdropPerRoundAmount, SetAirdropPerRoundAmount] = useState(0);
  const [airdropTargetAddr, setAirdropTargetAddr] = useState([]);
  const [nowAddrWhiteListed, setNowAddrWhiteListed] = useState(false);

  const getData = async () => {
    // airdropTokenAddress
    const zeroAddr = '0x0000000000000000000000000000000000000000';
    const sample = '0xF76cb57df586D9DdEb2BB20652CF633417887Ca3';

    // if (airdropTokenAddress === zeroAddr) {
    //   airdropTokenAddress = sample;
    // }

    if (airdropTokenAddress === zeroAddr) {
      return;
    }

    if (typeof airdropTokenAddress === 'string') {
      // const airdropTimestamps = await getAirdropSnapshotTimestamps(airdropTokenAddress);
      // const airdropAmountsPerRound = await getAirdropAmountsPerRound(airdropTokenAddress);
      // const airdropWhiteList = await getAirdropTargetAddresses(airdropTokenAddress);
      // setNewAirdropTimestamp(airdropTimestamps);
      // SetAirdropPerRoundAmount(airdropAmountsPerRound);
      // setAirdropTargetAddr(airdropWhiteList);
      // console.log('airdropWhiteList >>>>>>>>> ', airdropWhiteList);
    }
    const airdropTimestamps = await getAirdropSnapshotTimestamps(airdropTokenAddress);
    const airdropAmountsPerRound = await getAirdropAmountsPerRound(airdropTokenAddress);
    const airdropWhiteList = await getAirdropTargetAddresses(airdropTokenAddress);

    setNewAirdropTimestamp(airdropTimestamps);
    SetAirdropPerRoundAmount(airdropAmountsPerRound);
    setAirdropTargetAddr(airdropWhiteList);
    console.log('airdropWhiteList >>>>>>>>> ', airdropWhiteList);
    setNowAddrWhiteListed(
      airdropTargetAddr.some((whiteAddr) => whiteAddr.toLowerCase() === userAddress),
    );

    console.log('nowAddrWhiteListed >>>>>>>>>>> ', nowAddrWhiteListed);
  };

  useEffect(() => {
    // TODO: ^^;;
    if (isAirdropContractOpened === 'true') {
      getData();
    } else {
      console.log('airdrop contract is not opened');

      return;
    }
  }, [isAirdropContractOpened]);

  /**
   * case 1 : owner address === dao space owner address && airdrop 컨트랙트 deploy X
   * case 2 : claim 대상자
   * case 3 : claim 비대상자
   */

  // Airdrop Contract가 열려있지 않다면 별도 메시지를 반환한다.
  if (isAirdropContractOpened === 'false') {
    return (
      <>
        <div className="pb-8">
          <div className="flex items-center">
            <div className="grow">
              <h2 className="font-bold text-lg mt-8 mb-2">
                The owner has not initialized Airdrop Contract for the Governance Token yet.
              </h2>
            </div>
          </div>
        </div>
      </>
    );
    // if ownerAddress does not include in nowAddrWhiteListed
  } else if (!nowAddrWhiteListed) {
    return (
      <>
        <div className="pb-8">
          <div className="flex items-center">
            <div className="grow">
              <h2 className="font-bold text-lg mt-8 mb-2">
                You are not eligible to claim the Governance Token since you are not on the
                whitelist.
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    // iterate userEligibleTokenList and check whether there is no matched address with airdropTokenAddress
    // if (!nowAddrWhiteListed) {
    //   return (
    //     <>
    //       <div className="pb-8">
    //         <div className="flex items-center">
    //           <div className="grow">
    //             <h2 className="font-bold text-lg mt-8 mb-2">
    //               The page has fetched the whitelist addresses to analyze your availability to be
    //               airdropped.
    //             </h2>
    //             <h2 className="font-bold text-lg mt-8 mb-2">
    //               If the page does not change, it means that you are not eligible to claim for the
    //               token. Please check again.
    //             </h2>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   );
    // }

    // Airdrop Contract의 Claim 대상자인지 확인하고, 대상자가 아니라면 별도 메시지를 반환한다.

    const airdrop_timestamps = nowAirdropTimestamp;

    const date1 = dayjs(airdrop_timestamps[1]);
    const date2 = dayjs(airdrop_timestamps[0]);
    // const airBalance = AirdropPerRoundAmount;
    const airBalance = 100;

    const airdropDetails = [
      { label: 'Start Date', value: airdrop_timestamps[0] },
      { label: 'Rounds', value: airdrop_timestamps.length },
      { label: 'Interval', value: date1.diff(date2, 'day') + ' Days' },
    ];

    return (
      <>
        <div className="pb-8">
          <div className="flex items-center">
            <div className="grow">
              <h2 className="font-bold text-2xl mt-8 mb-8">My Airdrop</h2>
            </div>
            <div className="flex-none">
              <div className="flex items-center">
                {/* <div>
                <span>100.00</span>
                <span> TEL</span>
              </div>{' '} */}
                <h2 className="font-bold text-2xl mt-8 mb-8 mr-4">{airBalance} TEL</h2>
                <div>
                  <NextBtn
                    className="max-w-[100px] max-h-8"
                    onClick={() => {
                      router.push({
                        pathname: '/claim_token',
                        query: {
                          balance: airBalance,
                        },
                      });
                    }}
                  >
                    Claim
                  </NextBtn>
                </div>
              </div>
            </div>
            {/* {airWhiteList?.includes(ownerAddress) && (
              <div className="flex-none">
                <div className="flex items-center">
                  <div>
                    <span>100.00</span>
                    <span> ENS</span>
                  </div> *
                  <div>
                    <NextBtn>Claim</NextBtn>
                  </div>
                </div>
              </div>
            )} */}
          </div>

          <div className="bg-[#191919] p-8 mb-3 rounded-lg">
            {/* {amounts.map((amount, index) => {
              return (
                <>
                  <div className="mb-4">
                    <span className="opacity-50 w-40 inline-block">{amount.label}</span>
                    <span>{amount.amount}</span>
                  </div>
                  <div
                    className="rounded-full"
                    style={{
                      backgroundColor: amount.color,
                      height: '16px',
                      width: `${(amount.amount / total) * 100}%`,
                    }}
                  />
                </>
              );
            })} */}
            <>
              <div className="mb-4">
                <span className="opacity-50 w-40 inline-block">Total Amounts</span>
                <span>{airBalance}</span>
              </div>
              <div
                className="rounded-full"
                style={{
                  backgroundColor: '#FFE55C',
                  height: '16px',
                  width: `${(airBalance / total) * 100}%`,
                }}
              />
            </>
          </div>

          <div className="bg-[#191919] p-8 rounded-lg">
            {airdropDetails.map((airdrop, index) => (
              <div className="mb-4" key={airdrop.value}>
                <span className="opacity-50 w-40 inline-block">{airdrop.label}</span>
                <span>{airdrop.value}</span>
              </div>
            ))}
            <h5 className="text-base mb-4 mt-8 ">Vest Events</h5>
            {/* <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Round</th>
                </tr>
              </thead>
              <tbody>
                {airdrop_timestamps?.map((airdrop, index) => (
                  <tr>
                    <td>{dayjs(airdrop).format('DD/MM/YYYY')}</td>
                    <td>{index + 1} Round</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          </div>
        </div>
      </>
    );
  }
}

export default AirdropInfo;
