import React, {useState} from 'react';
import styles from './index.module.scss';
import {ReactSVG} from 'react-svg';
import close from '../../assets/svg/close-gray.svg';
import share from '../../assets/svg/share.svg';
import more from '../../assets/svg/more.svg';
import coin from '../../assets/svg/coin.svg';
import danger from '../../assets/svg/danger.svg';
import {Dropdown} from '../../components/General/Dropdown';
import {Button} from "../../components/General/Button";
import {Modal} from "../../components/General/Modal";
import {Remove} from './Modals/Remove';
import {ApiTypes} from '../../types/api';
import {useHistory} from 'react-router-dom';

type Props = {
  nft: ApiTypes.Model.NFTInfo,
  title: string,
};

export const Buttons = ({nft, title}: Props) => {
  const [isRemoveOpen, setRemoveState] = useState(false);
  const history = useHistory();
  const toggleRemovePopup = () => {
    setRemoveState(!isRemoveOpen);
  }
  const handleBack = () => {
    if (history.action === "POP") {
      history.push('/marketplace');
      return;
    }
    history.goBack();
  }
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    //  TODO: add notification with success
  };
  return <div className={styles.buttons}>
    <button onClick={handleBack} className={styles.control}><ReactSVG src={close}/></button>
    <button onClick={handleShare} className={styles.control}><ReactSVG src={share}/></button>
    <Dropdown
      title={title}
      toggle={<button className={styles.control}><ReactSVG src={more}/></button>}
      options={[
        {
          label: 'Change price',
          action: () => {
          },
          icon: coin,
        },
        {
          label: 'Remove from sale',
          action: toggleRemovePopup,
          icon: danger,
          status: 'error',
        },
      ]}
    />
    <Modal toggleFn={toggleRemovePopup} isOpen={isRemoveOpen}
      toggle={<Button className={styles.action}>Purchase now</Button>}>
      <Remove togglePopup={toggleRemovePopup} nft={nft}/>
    </Modal>
  </div>
}
