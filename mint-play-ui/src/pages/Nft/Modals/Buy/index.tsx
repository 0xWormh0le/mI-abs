import {useState} from 'react';
import {Processing, Start, Success} from './Screens';
import {ApiTypes} from 'types/api';
import {useBuyNftMutation} from 'store/api/nftApi';

type Props = {
  togglePopup?: () => void; //passed from Modal
  nft: ApiTypes.Model.NFTInfo
};
type buyModalState = "start" | "processing" | "success"

export const Buy = ({togglePopup, nft}: Props) => {
  //TODO: put real user id
  const [buyNft, {isLoading}] = useBuyNftMutation();
  const [screen, setScreen] = useState<buyModalState>('start');
  const handleNext = (nextName: buyModalState) => () => {
    setScreen(nextName)
  };
  const handleCancel = () => {
    setScreen('start');
    if (togglePopup) togglePopup();
  }
  const handleBuy = () => {
    handleNext('processing');
    buyNft({id: nft.id, userId: '1'});
  }
  switch (screen) {
    case 'start':
      return <Start nft={nft} onCancel={handleCancel} onNext={handleBuy}/>;
    case 'processing':
      return <Processing isLoading={isLoading} nft={nft} onCancel={handleCancel} onNext={handleNext('success')}/>;
    case 'success':
      // here just till we do backend and redux
      setTimeout(handleNext('start'), 3000);
      return <Success nft={nft}/>
  }
  return <Start nft={nft} onCancel={handleCancel} onNext={handleNext('processing')}/>
}
