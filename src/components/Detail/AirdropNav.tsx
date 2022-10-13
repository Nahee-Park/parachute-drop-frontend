import { CurrentTab } from '@src/pages/detail/[id]';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface AirdropNavProps {
  currentTab: CurrentTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<CurrentTab>>;
}

function AirdropNav({ currentTab, setCurrentTab }: AirdropNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setCurrentTab(e.currentTarget.id as CurrentTab);
  };

  return (
    <ul className="flex flex-row mt-[37px] bg-transparent space-x-8  border-solid border-b-[1px] border-slate-500">
      <li>
        <a
          href="#airdrop"
          id="Airdrop"
          className={`block p-[12px]  ${
            currentTab === 'Airdrop'
              ? 'text-white border-solid border-b-[1px] border-white'
              : 'dark:hover:text-white text-slate-500'
          } md:bg-transparent `}
          aria-current="page"
          onClick={handleClick}
        >
          Airdrop
        </a>
      </li>
      <li>
        <a
          href="#portfolio"
          id="Portfolio"
          className={`block p-[12px]  ${
            currentTab === 'Portfolio'
              ? 'text-white border-solid border-b-[1px] border-white'
              : 'dark:hover:text-white text-slate-500'
          } md:bg-transparent `}
          onClick={handleClick}
        >
          Dashboard
        </a>
      </li>
    </ul>
  );
}

export default AirdropNav;
