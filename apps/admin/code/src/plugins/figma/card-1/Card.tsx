import React from "react";
import previewUrl from "./Card.png";
import styles from "./Card.module.scss";

export { previewUrl };

const defaults = {
    cardImage: "https://static.overlay-tech.com/assets/f3b2c2d7-fda0-41ee-bac8-84f7e3a7d0b0.png",
    description:
        "Lectus eget amet at a, sit. Suspendisse nec, elementum sollicitudin turpis quisque sem in.",
    title: "Write a title here"
};

export const Card = props => {
    return (
        <div className={styles.card}>
            <img alt="" className={styles.cardImage} src={props.cardImage || defaults.cardImage} />
            <div className={styles.content}>
                <p className={styles.title}>{props.title || defaults.title}</p>
                <p className={styles.description}>{props.description || defaults.description}</p>
            </div>
        </div>
    );
};
