import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import styles from "./mainPage.module.scss";
import classNames from 'classnames';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import windowLogo from "../../assets/pixil-frame-0(74).png"
import File from "../../components/File/File.tsx";
import Question1 from "../../components/questions/question1.tsx";
import Question2 from "../../components/questions/question2/question2.tsx";
import Modal from "../../components/modal/Modal.tsx";
import underArrow from "../../assets/underArrow.png"
import leftArrow from "../../assets/leftArrow.png"
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기

export default function MainPage() {
    const [isMainOpen, setIsMainOpen] = useState(false);
    const [inputAnswer, setInputAnswer] = useState("");
    const [userCorrect, setUserCorrect] = useState(false);
    const [isExitCamera, setIsExitCamera] = useState(false);
    const [isCameraFocusing, setIsCameraFocusing] = useState(false);
    const [boxSize, setBoxSize] = useState<THREE.Vector3 | null>(null);
    const [boxDistance, setBoxDistance] = useState<number | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const centerRef = useRef<THREE.Vector3 | null>(null);
    const [isModalopen, setIsModalopen] = useState(false);
    const needsUpdateRef = useRef(true);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
    const initialCameraLookAt = useRef<THREE.Vector3 | null>(null);
    const screenTransitionRef = useRef(null);
    const navigate = useNavigate()



    // localStorage에서 answer 가져오기
    const [answer, setAnswer] = useState<string[] | null>(null);

    useEffect(() => {
        const storedAnswer = localStorage.getItem("qnsjfiw");
        if (storedAnswer) {
            try {
                const parsedAnswer = JSON.parse(storedAnswer); // JSON으로 파싱
                if (Array.isArray(parsedAnswer)) {
                    setAnswer(parsedAnswer); // 배열로 상태 업데이트
                } else {
                    console.error("Stored answer is not an array:", parsedAnswer);
                }
            } catch (error) {
                console.error("Failed to parse stored answer:", error);
            }
        } else {
            console.warn("No answer found in localStorage");
        }
    }, []);

    const mainMonitorCameraSet = () => {
        if (!isExitCamera) {
            setIsMainOpen(true);
            const camera = cameraRef.current;
            const center = centerRef.current;
            if (camera && center) {
                const targetPosition = new THREE.Vector3(center.x, 797, -766);
                animateCamera(camera.position, targetPosition, 1200);
                document.getElementsByClassName(styles.mainMonitor)[0].style.display = "none";
                needsUpdateRef.current = true;
            }
        }

    };

    const resetCameraToInitial = () => {
        const camera = cameraRef.current;
        if (camera && initialCameraPosition.current && initialCameraLookAt.current) {
            animateCamera(camera.position, initialCameraPosition.current, 1200);
                camera.lookAt(initialCameraLookAt.current!);
        }
        setIsExitCamera(false)
    };

    const exitCameraFocusing = () => {
        console.log("clicked")
        setIsMainOpen(false);
        setIsExitCamera(true);
        setIsCameraFocusing(true)
        const camera = cameraRef.current;
        const center = centerRef.current;
        const size = boxSize;
        const distance = boxDistance;
        if (camera && center && size && distance) {
            const targetPosition = new THREE.Vector3(center.x-240, size.y - 1210, center.z+1200);
            console.log(targetPosition)
            const lookAtPoint = new THREE.Vector3(center.x, 750, 100)
            console.log()
            animateCamera(camera.position, targetPosition, 1200);
            camera.lookAt(lookAtPoint);
        }
        console.log(
            classNames(styles.doorLock, {
                [styles.boxVisible]: !isCameraFocusing,
                [styles.boxHidden]: isCameraFocusing,
            })
        );
    }

    const extiCameraSet = () => {
        setIsMainOpen(false);
        setIsExitCamera(true)
        const camera = cameraRef.current;
        const center = centerRef.current;
        const size = boxSize;
        const distance = boxDistance;
        if (camera && center && size && distance) {
            const targetPosition = new THREE.Vector3(center.x, size.y - 1000, center.z + distance);
            console.log(targetPosition)
            const lookAtPoint = new THREE.Vector3(center.x, 750, 100)
            console.log()
            animateCamera(camera.position, targetPosition, 1200);
            camera.lookAt(lookAtPoint);
        }
    }

    const mainMonitorCameraOut = () => {
        setIsModalopen(false)
        setIsMainOpen(false);
        const camera = cameraRef.current;
        const center = centerRef.current;
        const size = boxSize;
        const distance = boxDistance;
        if (camera && center && size && distance) {
            const targetPosition = new THREE.Vector3(center.x, size.y - 1000, center.z + distance);
            animateCamera(camera.position, targetPosition, 1200);
            document.getElementsByClassName(styles.mainMonitor)[0].style.display = "block";
            needsUpdateRef.current = true;
        }
    };

    const animateCamera = (startPosition: THREE.Vector3, targetPosition: THREE.Vector3, duration: number) => {
        const startTime = performance.now();
        const currentPosition = startPosition.clone();

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const interpolatedPosition = currentPosition.clone().lerp(targetPosition, progress);
            startPosition.set(interpolatedPosition.x, interpolatedPosition.y, interpolatedPosition.z);

            needsUpdateRef.current = true;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer;
        const loader = new GLTFLoader();
        const container = document.getElementById("three-container");

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
        cameraRef.current = camera;

        const lightPosition = new THREE.Vector3(8, 795, -1000);
        const rectLight = new THREE.RectAreaLight(0xffffff, 2, 250, 190);
        rectLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
        scene.add(rectLight);

        const lightPosition2 = new THREE.Vector3(-385.5, 670, -848.3128760982725);
        const rectLight2 = new THREE.RectAreaLight(0xffffff, 1, 220, 170);
        rectLight2.rotation.y = -5.5;
        rectLight2.position.set(lightPosition2.x, lightPosition2.y, lightPosition2.z);
        scene.add(rectLight2);

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1); // 성능을 위해 픽셀 비율을 1로 고정
        if (container && !container.contains(renderer.domElement)) {
            container.appendChild(renderer.domElement);
        }

        scene.background = new THREE.Color(0x808080);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0, 1500, 200);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const doorHighLight = new THREE.DirectionalLight(0xffffff, 1);
        const lightPosition3 = new THREE.Vector3(7.5, 770, -800)
        doorHighLight.position.set(lightPosition3.x, lightPosition3.y, lightPosition3.z);
        scene.add(doorHighLight);

        let animationId: number;

        loader.load(
            "/assets/ROcOM.glb",
            (gltf) => {
                const scale = 15;
                gltf.scene.scale.set(scale, scale, scale);
                scene.add(gltf.scene);

                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                centerRef.current = center;
                const size = box.getSize(new THREE.Vector3());
                const distance = size.length() - 4800;

                setBoxSize(size);
                setBoxDistance(distance);

                if (cameraRef.current) {
                    const initialPosition = new THREE.Vector3(
                        center.x,
                        size.y - 1000,
                        center.z + distance
                    );
                    cameraRef.current.position.copy(initialPosition);
                    initialCameraPosition.current = initialPosition.clone(); // 초기 위치 저장

                    const initialLookAt = new THREE.Vector3(center.x, 750, -2400);
                    cameraRef.current.lookAt(initialLookAt);
                    initialCameraLookAt.current = initialLookAt.clone(); // 초기 방향 저장
                }
                needsUpdateRef.current = true;
            },
            undefined,
            (error) => console.error("Error loading GLTF:", error)
        );

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (cameraRef.current) {
                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();
                renderer.setSize(width, height);
                needsUpdateRef.current = true;
            }
        };

        window.addEventListener("resize", handleResize);

        const animate = () => {
            if (needsUpdateRef.current) {
                renderer.render(scene, camera);
                needsUpdateRef.current = false;
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            scene.clear();
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const modalOpen =() => {
        setIsModalopen(true)
    }

    const modalClose = () => {
        setIsModalopen(false)
    }


    const inputAnswerFunction = (e) => {
        const newValue = e.currentTarget.textContent || "";
        setInputAnswer((prev) => prev + newValue); // 상태 업데이트
    };

    const judgeAnswer = () => {
        if (!answer) {
            console.log("Answer is not available");
            return;
        }
        const correctAnswer = `${answer[0]}${answer[1]}`; // 배열을 문자열로 변환
        console.log(`User input: ${inputAnswer}, Correct answer: ${correctAnswer}`);

        if (correctAnswer === inputAnswer) {
            console.log("correct");
            setUserCorrect(true)
            screenTransitionFunction()
        } else {
            console.log("incorrect");
            setUserCorrect(false)
        }
    };


    const screenTransitionFunction = () => {
        if (!screenTransitionRef.current) return;
        const transitionElement = screenTransitionRef.current;
        let opacity = 0;

        const interval = setInterval(() => {
            opacity += 0.02; // opacity 증가 속도
            if (opacity >= 1) {
                clearInterval(interval);
                navigate("/end"); // `/end`로 이동
            } else {
                transitionElement.style.opacity = opacity.toString();
            }
        }, 30); // 30ms 간격으로 업데이트
    };

    useEffect(() => {
        console.log("Updated inputAnswer:", inputAnswer); // 상태 변경 이후 최신 값 출력
    }, [inputAnswer]);


    return (
        <div id="three-container" style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <div className={styles.mainMonitor} onClick={
                mainMonitorCameraSet
            } />
            <div
                className={classNames(styles.box, {
                    [styles.boxVisible]: isMainOpen,
                    [styles.boxHidden]: !isMainOpen,
                })}
            >
                <div className={styles.boxOverlay} />
                <div className={styles.content}>
                    <File
                        image={windowLogo}
                        name={"question1"}
                        isFolder={true}
                        modalWidth="700px"
                        modalHeight="500px"
                        initalX={25}
                        initalY={26}
                        modalLimitedX={[30, 160]}
                        modalLimitedY={[25, 35]}
                        modalInitalX={30}
                        modalInitalY={25}
                    >
                        <div>
                            <Question1 password={answer?.[0]} />
                        </div>
                    </File>
                    <File
                        image={windowLogo}
                        name={"question2"}
                        isFolder={true}
                        modalWidth="700px"
                        modalHeight="500px"
                        initalX={105}
                        initalY={26}
                        modalLimitedX={[30, 160]}
                        modalLimitedY={[25, 35]}
                        modalInitalX={30}
                        modalInitalY={25}
                    >
                        <div>
                            <Question2 password={answer?.[1]} />
                        </div>
                    </File>
                </div>
                <div className={styles.footer}>
                    <img src={windowLogo} alt="windowLogo" className={styles.windowLogo} onClick={modalOpen}/>
                </div>
                <Modal width="60px" height="150px" onOpen={isModalopen} className={styles.mainModal}>
                    <p onClick={mainMonitorCameraOut}>exit</p>
                    <button onClick={modalClose}>
                        <img src={underArrow}/>
                    </button>
                </Modal>
            </div>
            {!isExitCamera ? (
                <button className={styles.exitButton} onClick={extiCameraSet}>
                    <img src={leftArrow}/>
                    <p>exit</p>
                </button>
            ) : (
                <button className={styles.exitButton} onClick={resetCameraToInitial}>
                    <img src={leftArrow}/>
                    <p>main</p>
                </button>
            )}
            {isExitCamera && !isCameraFocusing && (
                <div className={styles.door} onClick={exitCameraFocusing}>
                </div>
            )}
            {isCameraFocusing && (
                <div
                    className={classNames(styles.doorLock, {
                        [styles.doorLockVisible]: isCameraFocusing,
                        [styles.doorLockNone]: !isCameraFocusing,
                    })}
                >
                    <div className={styles.doorLockButtonCon}>
                        <div className={styles.doorLockButtons}>
                            <button onClick={inputAnswerFunction}>1</button>
                            <button onClick={inputAnswerFunction}>2</button>
                            <button onClick={inputAnswerFunction}>3</button>
                        </div>
                        <div className={styles.doorLockButtons}>
                            <button onClick={inputAnswerFunction}>4</button>
                            <button onClick={inputAnswerFunction}>5</button>
                            <button onClick={inputAnswerFunction}>6</button>
                        </div>
                        <div className={styles.doorLockButtons}>
                            <button onClick={inputAnswerFunction}>7</button>
                            <button onClick={inputAnswerFunction}>8</button>
                            <button onClick={inputAnswerFunction}>9</button>
                        </div>
                        <div className={styles.doorLockButtons}>
                            <button onClick={inputAnswerFunction}>0</button>
                        </div>
                    </div>
                    <button onClick={judgeAnswer}>Enter</button>
                    {userCorrect ? (
                        <>
                            <p>Correct!</p>
                        </>
                    ) : (
                        <>
                            <p>nope</p>
                        </>
                    )}
                </div>
            )}
            <div className={styles.screenTransition} ref={screenTransitionRef}>

            </div>

        </div>
    );
}
