import styles from './index.module.scss';
import {ApiTypes} from 'types/api';
import {Button} from 'components/General/Button';
import {useRemoveFromSaleMutation} from 'store/api/nftApi';

type Props = {
  togglePopup: () => void; //passed from Modal
  nft: ApiTypes.Model.NFTInfo
};

export const Remove = ({togglePopup, nft}: Props) => {
  const [removeNft] = useRemoveFromSaleMutation();
  const handleRemove = () => {
    removeNft({id: nft.id});
    //TODO: some indication that nft is removed from sale
    togglePopup();
  }
  return <div className={styles.wrap}>
    <h3 className={styles.title}>Remove from sale</h3>
    <div className={styles.content}>
      <p>Do you really want to remove your item from sale? You can put it on sale anytime</p>
    </div>
    <div className={styles.buttons}>
      <Button size="big" onClick={handleRemove}>Remove now</Button>
      <Button size="big" onClick={togglePopup} outlined={true}>Cancel</Button>
    </div>
  </div>
}
