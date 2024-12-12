import React from "react";

type ModalProps = {
    width?: string;
    height?: string;
    onClose?: () => void;
    onOpen?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: any;
    ref?:any
};

export default function Modal({ width, height, onOpen, children, className, style,ref }: ModalProps) {
    const modalStyle = {
        width: `${width}`,
        height: `${height}`,
        ...style,
    };

    return onOpen ? (
        <div
            ref={ref}
            style={modalStyle}
            className={className}
        >
            {children}
        </div>
    ) : null;
}
