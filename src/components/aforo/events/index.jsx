import React from "react";
import Card from "../../Card";
import dataCards from "../../dataCards";
import styles from '../../home/home.module.css'

export default function Events() {
  const cards = dataCards[0].options[1].options.map((card) => {
    return (
      <div key={card.id}>
        <Card name={card.name} iconName={card.iconName} path={card.path} />
      </div>
    );
  });

  return <div className={styles.containerHome}>{cards}</div>;
}
