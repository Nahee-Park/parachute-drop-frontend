import { JSONRPC_PROVIDER } from '@src/constants';
import { postAirdropInfo } from '@src/lib/api';
import { airdropAbi } from '@src/lib/klaytnAbi';
import { postAirdropInfoInfoParams } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';

const useMintingToken = ({
  name,
  ticker,
  DAOName,
  intro,
  image,
  link,
  initial_supply,
  owner,
  airdrop_timestamps,
  airdrop_target_addresses,
  airdrop_round_airdrop_amounts,
}: postAirdropInfoInfoParams) => {
  // const queryKeys = [flag] as string[];

  return useMutation(
    async () =>
      postAirdropInfo({
        name,
        ticker,
        DAOName,
        intro,
        image,
        link,
        initial_supply,
        owner,
        airdrop_timestamps,
        airdrop_target_addresses,
        airdrop_round_airdrop_amounts,
      }),
    {
      onSuccess: async ({ data }) => {
        localStorage.setItem('airdropInfo', JSON.stringify(data));
        try {
          const provider = new ethers.providers.JsonRpcProvider(JSONRPC_PROVIDER);
          const signer = new ethers.Wallet(
            'd8f5d2f82fcceb4f7564364d25b23fc9fca1ad48d2570aceb376f738cf4b970c',
            provider,
          );
          const airdropContract = new ethers.Contract(
            data?.airdropContract.contractAddress,
            airdropAbi,
            signer,
          );

          const receipt = await airdropContract.executeAirdropRound(
            data?.governanceToken.contractAddress,
          );

          console.log('>>receipt', receipt);
          localStorage.setItem('excuteAfterInfo', JSON.stringify(receipt));
        } catch (err) {
          console.log(err);
        }
      },
    },
  );
};

export default useMintingToken;
