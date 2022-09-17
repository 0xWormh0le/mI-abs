import "./toggle.css";

interface ToggleProps {
  size?: "default" | "large";
  checked: boolean;
  disabled?: boolean;
  onChange: (e: any) => void;
}

function Toggle({ size, checked, disabled, onChange }: ToggleProps) {
  const offstyle = "switch-danger";
  const onstyle = "switch-success";

  let displayStyle = checked ? onstyle : offstyle;
  return (
    <>
      <label>
        <span className={`${displayStyle} switch-wrapper`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e)}
          />
          <span className={`${displayStyle} switch`}>
            <span className="switch-handle" />
          </span>
        </span>
      </label>
    </>
  );
}

export default Toggle;
