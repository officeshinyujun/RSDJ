import React, { useState, useEffect, useRef } from "react";
import styles from "./File.module.scss";
import folder from "../../assets/folder.svg";
import useDoubleClick from "../../feature/useDoubleClick.tsx";
import Modal from "../modal/Modal.tsx";

type Props = {
    image: string;
    name: string;
    isFolder: boolean;
    children?: any;
    modalWidth?: string;
    modalHeight?: string;
    initalX?: number;
    initalY?: number;
    modalInitalX?: number;
    modalInitalY?: number;
    modalLimitedX?: Array<number>;
    modalLimitedY?: Array<number>;
};

export default function File({ image, name, isFolder, children, modalHeight, modalWidth ,initalX,initalY, modalLimitedY, modalLimitedX, modalInitalX, modalInitalY}: Props) {
    const [xy, setXY] = useState({ x: initalX, y: initalY });
    const [modalPosition, setModalPosition] = useState({ x: modalInitalX, y: modalInitalY });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [draggingModal, setDraggingModal] = useState(false);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [initialModalPosition, setInitialModalPosition] = useState({ x: 0, y: 0 });
    const fileRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // 파일 드래그 이벤트 핸들러
    const handleFileMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setInitialPosition({ x: e.clientX - xy.x, y: e.clientY - xy.y });
        if (fileRef.current) {
            fileRef.current.style.background = "rgba(0,0,0,0.3)";
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        // 드래그 종료 시 배경 원래대로 복원
        if (fileRef.current) {
            fileRef.current.style.background = "none";
        }
    };

    const onFileMouseMove = (e: React.MouseEvent) => {
        if (dragging) {
            const newX = e.clientX - initialPosition.x;
            const newY = e.clientY - initialPosition.y;

            let limitedX = Math.min(Math.max(newX, 25), 788);
            let limitedY = Math.min(Math.max(newY, 26), 459);

            setXY({ x: limitedX, y: limitedY });
        }
    };

    // 모달 드래그 이벤트 핸들러
    const handleModalMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDraggingModal(true);
        if(modalRef){
            console.log(modalRef.current?.style.zIndex)
        }
        setInitialModalPosition({ x: e.clientX - modalPosition.x, y: e.clientY - modalPosition.y });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (draggingModal) {
                const newModalX = e.clientX - initialModalPosition.x;
                const newModalY = e.clientY - initialModalPosition.y;

                const limitedModalX = Math.min(Math.max(newModalX, modalLimitedX[0]), modalLimitedX[1]);
                const limitedModalY = Math.min(Math.max(newModalY, modalLimitedY[0]), modalLimitedY[1]);

                setModalPosition({ x: limitedModalX, y: limitedModalY });
            }
        };

        const handleMouseUp = () => {
            setDraggingModal(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingModal, initialModalPosition, modalWidth, modalHeight]);

    const oneClicked = () => {
        console.log("clicked");
    };

    const doubleClicked = () => {
        console.log("double clicked");
        setIsModalOpen(true);
    };

    const modalClose = () => {
        setIsModalOpen(false);
    };

    const handleClick = useDoubleClick({ oneClick: oneClicked, doubleClick: doubleClicked });

    return (
        <>
            <div
                ref={fileRef}
                className={styles.container}
                style={{
                    left: `${xy.x}px`,
                    top: `${xy.y}px`,
                    position: "absolute",
                }}
            >
                <div
                    className={styles.overlay}
                    onMouseDown={handleFileMouseDown}
                    onMouseMove={onFileMouseMove}
                    onMouseUp={handleMouseUp}
                    onClick={handleClick}
                ></div>
                <img src={isFolder ? folder : image} className={styles.img} />
                <p>{name}</p>
            </div>
            {isModalOpen && (
                <Modal
                    ref = {modalRef}
                    className={styles.modalContainer}
                    onOpen={isModalOpen}
                    onClose={modalClose}
                    style={{
                        left: `${modalPosition.x}px`,
                        top: `${modalPosition.y}px`,
                        position: "absolute",
                    }}
                    width={modalWidth}
                    height={modalHeight}
                >
                    <div
                        className={styles.modalHeader}
                        onMouseDown={handleModalMouseDown}
                    >
                        <button onClick={modalClose}>X</button>
                        <p>{name}</p>
                    </div>
                    <div className={styles.modalContent}>
                        {children}
                    </div>
                </Modal>
            )}
        </>
    );
}
