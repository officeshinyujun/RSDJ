import styles from "./question2.module.scss"
import image from "../../../assets/question2.png"
import {useState} from "react";

type Props = {
    password: number,
}

export default function Question2({password}: Props) {
    const [judge, setJudge] = useState(false);
    const [answer, setAnswer] = useState("");
    const [inPassword, setInPassword] = useState(0);
    const result = 13;
    const answerFunction = () => {
        console.log(answer);
        if (Number(answer) === result) {
            setInPassword(password);
            setJudge(true);

        } else {
            console.log("wrong");
            setJudge(false);

        }
    }

    return (
        <div className={styles.container}>
            <img src={image} className={styles.questionImage}/>
            <div className={styles.box}>
                <input
                    onInput={(e) => {
                        setAnswer(e.target.value);
                    }}/>
                <button onClick={answerFunction}>answer</button>
            </div>
            {judge ? (
                <>
                    <p className={styles.answerText}>second password : {inPassword}</p>
                </>
            ) : (
                <>
                    <p className={styles.wrongText}>this is not answer</p>
                </>
            )}
        </div>
    )
}
