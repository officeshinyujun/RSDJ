import { useState, useEffect } from "react";
import styles from "./endPage.module.scss";
import { useNavigate } from "react-router-dom";

export default function EndPage() {
    const [text, setText] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false); // Track typing completion
    const fullText = ["Congratulations", " Now you are free"];
    let i = 0;
    const navigate = useNavigate();

    useEffect(() => {
        let currentIndex = 0;
        let currentText = "";

        const typeEffect = () => {
            if (currentIndex < fullText.length) {
                let currentSentence = fullText[currentIndex];
                let charIndex = 0;

                const typeCharacter = () => {
                    if (charIndex < currentSentence.length) {
                        currentText += currentSentence[charIndex];
                        setText(currentText);
                        charIndex++;
                        setTimeout(typeCharacter, 100);
                    } else {
                        currentIndex++;
                        setTimeout(typeEffect, 500);
                    }
                };

                typeCharacter();
            } else {
                // Mark typing complete
                setIsTypingComplete(true);
            }
        };

        typeEffect();
    }, []); // This useEffect runs only once on mount

    // Second useEffect for the interval, triggered when typing is complete
    useEffect(() => {
        if (isTypingComplete) {
            const interval = setInterval(() => {
                i += 0.02;
                if (i >= 1) {
                    clearInterval(interval);
                    navigate("/"); // Redirect after interval complete
                } else {
                    console.log("loading...");
                }
            }, 30);
        }
    }, [isTypingComplete]); // This useEffect runs when isTypingComplete changes

    return (
        <div className={styles.container}>
            <p>{text}</p>
        </div>
    );
}
