import React, {useState} from 'react';
import {Tab} from './Tab';
import {TabContent} from './TabContent';
import styles from './index.module.scss';

type Props = {
  defaultTabIndex?: number;
  tabs: {
    title: string;
    content: any;
  }[];
};

export const Tabs = ({defaultTabIndex = 0, tabs}: Props) => {
  const [currentTab, setCurrentTab] = useState(defaultTabIndex);
  const handleClick = (index: number) => () => {
    setCurrentTab(index)
  };
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        {tabs.map((tab, index) => (
          <Tab onClick={handleClick(index)} active={index === currentTab} title={tab.title}/>
        ))}
      </header>
      <div className={styles.content}>
        {tabs.map((tab, index) => (
          <TabContent active={index === currentTab}>{tab.content}</TabContent>
        ))}
      </div>
    </div>
  )
}
