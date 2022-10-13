import styled from '@emotion/styled';
import BackBtn from '@src/components/common/BackBtn';
import NextBtn from '@src/components/common/NextBtn';
import { Step } from '@src/pages/create_space';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { createSpace } from '../../../utils/createSpace';
import CreateToken from './CreateToken';
import SpaceDetail from './SpaceDetail';

interface CreateSpaceFormProps {
  step: Step;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}

function CreateSpaceForm({ step, setStep }: CreateSpaceFormProps) {
  const [isFirstStepDone, setIsFirstStepDone] = useState(false);
  const [isFinalStepDone, setIsFinalStepDone] = useState(false);
  const router = useRouter();
  const handleCreateSpace = () => {
    // 1. 정보들 컨트랙트로 넘김
    const data = getValues();

    console.log(data);
    createSpace(data);
    // 2. 페이지 로드
    router.push({
      pathname: `/detail/${getValues()?.tokenName}#airdrop`,
      query: getValues(),
    });
  };

  const { getValues } = useFormContext();

  useEffect(() => {
    const currentValue = getValues();

    console.log('**', currentValue);

    if (
      currentValue?.image !== '' &&
      currentValue?.homepage !== '' &&
      currentValue?.intro !== '' &&
      currentValue?.spaceName !== ''
    ) {
      setIsFirstStepDone(true);
    } else {
      setIsFirstStepDone(false);
    }

    if (
      currentValue?.tokenName !== '' &&
      currentValue?.tokenSupply !== '' &&
      currentValue?.tokenSymbol !== '' &&
      currentValue?.ownerAddress !== ''
    ) {
      setIsFinalStepDone(true);
    } else {
      setIsFinalStepDone(false);
    }
  }, [getValues()]);

  switch (step) {
    case 'SPACE_DETAIL':
      return (
        <>
          <SpaceDetail />
          <div className="flex items-center justify-between mt-[30px] mb-[66px]">
            <div />
            <NextBtn
              onClick={(e) => {
                e.preventDefault();
                setStep('CREATE_TOKEN');
              }}
              isAbled={isFirstStepDone}
            />
          </div>
        </>
      );
    default:
      return (
        <>
          <CreateToken />
          <div className="flex items-center justify-between mt-[30px] mb-[66px]">
            <BackBtn
              onClick={() => {
                setStep('SPACE_DETAIL');
              }}
            />
            <NextBtn onClick={handleCreateSpace} isAbled={isFinalStepDone} />
          </div>
        </>
      );
  }
}

export default CreateSpaceForm;
