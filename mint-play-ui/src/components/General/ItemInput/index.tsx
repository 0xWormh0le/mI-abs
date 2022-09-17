import InputForm from "../InputForm";
import styles from "./index.module.scss";

interface ItemInputProps {
  label?: string;
  placeholder?: string;
  textClass?: string;
  type?: "text" | "number";
  textarea?: boolean;
  value?: string | number;
  helperText?: string;
  marginTop?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ItemInput = ({
  label,
  placeholder,
  textClass,
  type,
  textarea,
  value,
  marginTop,
  helperText,
  onChange,
}: ItemInputProps) => {
  return (
    <div className={styles.wrapper} style={{ marginTop }}>
      <p className={styles.label}>{label}</p>
      <InputForm
        placeholder={placeholder}
        textClass={textClass}
        type={type}
        value={value}
        textarea={textarea}
        onChange={onChange}
      />
      {helperText && <p className={styles.helpertext}>{helperText}</p>}
    </div>
  );
};

export default ItemInput;
