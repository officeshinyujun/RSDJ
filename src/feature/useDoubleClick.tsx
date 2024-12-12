import { useEffect, useState } from "react";

type Props = {
    oneClick: Function;
    doubleClick: Function;
};

export default function useDoubleClick({ oneClick, doubleClick }: Props) {
    const [click, setClick] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (click === 1) {
                oneClick(); // Call oneClick when single-click
                setClick(0); // Reset click count after 250ms
            }
        }, 200);

        if (click === 2) {
            doubleClick(); // Call doubleClick on double-click
            setClick(0); // Reset click count after double-click
        }

        return () => clearTimeout(timer); // Clean up the timer on component unmount
    }, [click, oneClick, doubleClick]);

    const handleClick = () => {
        setClick((prevClick) => prevClick + 1); // Increment click count
    };

    return handleClick; // Return the click handler to use in File component
}
