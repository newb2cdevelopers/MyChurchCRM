/* eslint-disable react/prop-types */
import styles from "./dropdown.module.css";
import Select from "react-select";

function Dropdown({ data, placeholder, multiple, color, value, onchange }) {
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: "black",
      backgroundColor: "white",
      cursor: "red",
      ":hover": {
        ...defaultStyles[":hover"],
        backgroundColor: "grey",
      },
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "white",
      padding: "10px",
      border: `2px solid ${color}`,
      boxShadow: "none !important",
      width: "350px",
      maxHeight: "65px",
      overflow: "scroll",
      "&:hover": {
        border: `2px solid ${color}`,
      },
    }),

    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "black" }),

    placeholder: (defaultStyles) => ({ ...defaultStyles, color: "black" }),

    menu: (defaultStyles) => ({
      ...defaultStyles,
      border: `2px solid ${color}`,
    }),
  };

  return (
    <div className={styles.dropdown}>
      <Select
        value={value}
        options={data}
        onChange={onchange}
        isMulti={multiple}
        placeholder={placeholder}
        styles={customStyles}
      />
    </div>
  );
}

export default Dropdown;
