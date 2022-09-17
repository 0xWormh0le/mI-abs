import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import termsImage from '../../../assets/img/terms-image.png'
import { Button } from '../../General/Button'
import { Checkbox } from '../../General/Checkbox'

interface Props {
  isAgree: boolean
  onSetAgree: (value: boolean) => void
  onCancel?: () => void
  onProceed?: () => void
}

export const TermsOfService = ({ isAgree, onSetAgree, onCancel, onProceed }: Props) => {
  return (
    <div className={styles.termsWrapper}>
      <h2 className={styles.termsTitle}>Terms of service</h2>
      <p className={styles.termsTitleNote}>Please take a few minutes to read and understand <Link className={styles.link} to="/">PlayerMint’sTerms of Service.</Link> To continue, you’ll need to accept the terms of services by checking the boxes.</p>
      <img className={styles.termsImage} src={termsImage} alt="terms" />
      <Checkbox name="agree" isChecked={isAgree} onChange={onSetAgree}>I agree to the terms of service</Checkbox>
      <div className={styles.buttons}>
        <Button
          outlined
          className={styles.cancelButton}
          onClick={onCancel}>
          Cancel
        </Button>
        {isAgree ?
          <Link className={styles.link} to="/wallets/congratulations">
            <Button onClick={onProceed}>
              Get started now
            </Button>
          </Link>
          :
          <Button disabled={true}>
            Get started now
          </Button>
        }
      </div>
    </div >
  )
}