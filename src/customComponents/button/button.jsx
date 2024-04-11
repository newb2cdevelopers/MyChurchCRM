import styles from "./button.module.css";

function Button({ color, disable, onClick, buttonText }) {
  return (
    <div className={styles.button}>
      <button
        disabled={disable}
        onClick={onClick}
        style={{ backgroundColor: color }}>
        {buttonText}
      </button>
    </div>
  );
}

export default Button;
