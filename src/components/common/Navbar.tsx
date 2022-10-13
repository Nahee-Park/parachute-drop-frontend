import { MetaMaskInpageProvider } from '@metamask/providers';
import Logo from '@src/assets/logo.svg';
import useMounted from '@src/hooks/useMounted';
// import TestEvmos from '@src/components/main/TestEvmos';
import { communicateWithWallet, isLogout, walletIdType } from '@src/utils/connectWallet';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
function Navbar() {
  const router = useRouter();
  const isMounted = useMounted();
  const [ownerAddress, setOwnerAddress] = useState<string | undefined | null>('');

  useEffect(() => {
    if (isMounted) {
      setOwnerAddress(localStorage.getItem('ownerAddress'));
    }
  }, [ownerAddress, isMounted]);

  const handleClick = () => {
    router.push('/');
  };

  const ownerAddressShort = ownerAddress?.substring(0, 5);
  const ownerAddressShort2 = ownerAddress?.substring(ownerAddress.length - 5, ownerAddress.length);

  const handleWalletClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const targetId = e.currentTarget.id as walletIdType;
    const address = await communicateWithWallet(targetId);

    setOwnerAddress(address);
  };

  const handleConnect = () => {
    if (isLogout()) {
      return;
    }
    setOwnerAddress('');
    localStorage.removeItem('ownerAddress');
  };

  return (
    <div className="navbar bg-[#000]">
      <div className="flex-1">
        <button className="btn btn-ghost normal-case text-xl" onClick={handleClick}>
          <Logo />
        </button>
      </div>

      {ownerAddress ? (
        <>
          <button className="btn btn-sm" onClick={handleConnect}>
            {ownerAddressShort}...{ownerAddressShort2}
          </button>
        </>
      ) : (
        <div className="flex-none">
          <label htmlFor="my-modal-4" className="btn btn-sm modal-button">
            Connect Wallet
          </label>

          <input type="checkbox" id="my-modal-4" className="modal-toggle" />
          <label htmlFor="my-modal-4" className="modal cursor-pointer">
            <div className="modal-box relative">
              <h3 className="font-bold text-lg text-center">Connect Wallet</h3>
              <p className="py-4 text-center">Choose wallet to connect to the blockchain.</p>
              <div className="grid gap-4">
                <button
                  className="btn btn-block"
                  onClick={handleWalletClick}
                  type="button"
                  id="metamask"
                >
                  Metamask Wallet
                </button>

                <button
                  className="btn btn-block "
                  onClick={handleWalletClick}
                  type="button"
                  id="kaikas"
                >
                  Kaikas Wallet
                </button>
              </div>
            </div>
          </label>

          {/* <TestEvmos ownerAddress={ownerAddress} /> */}
        </div>
      )}
    </div>
  );
}

export default Navbar;
