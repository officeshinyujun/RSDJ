import styles from "./startPage.module.scss";
import { Link } from 'react-router-dom';
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useEffect, useState } from "react";

export default function StartPage() {
    const [canvasWidth, setCanvasWidth] = useState(600);
    const [canvasHeight, setCanvasHeight] = useState(400);
    const [answerArray, setAnswerArray] = useState<number[]>([]);

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const loader = new GLTFLoader();
        const container = document.getElementById("three-container");
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);

        // 카메라 위치 설정
        camera.position.z = 1001;
        console.log("카메라 위치:", camera.position);

        // 조명 설정
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(200, 200, 200);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // GLTF 모델 로드
        loader.load(
            "/assets/computer.glb",
            (gltf) => {
                const scale = 7;
                gltf.scene.scale.set(scale, scale, scale);
                scene.add(gltf.scene);

                const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                gltf.scene.position.sub(center);

                const size = new THREE.Vector3();
                boundingBox.getSize(size);
                console.log("모델의 크기:", size);
                console.log("모델의 중앙:", center);

                const animate = () => {
                    requestAnimationFrame(animate);
                    gltf.scene.rotation.y += 0.01;
                    renderer.render(scene, camera);
                };
                animate();
            },
            undefined,
            (error) => {
                console.error("모델 로드 실패", error);
            }
        );

        // 렌더러 크기 설정
        renderer.setSize(canvasWidth, canvasHeight);
        if (container) {
            container.appendChild(renderer.domElement);
        }
        scene.background = new THREE.Color(0x090909);

        // 애니메이션 함수
        let animateId;
        const animate = () => {
            animateId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // 정리 함수
        return () => {
            cancelAnimationFrame(animateId);
            renderer.dispose();
            scene.clear();
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [canvasWidth, canvasHeight]);

    // 랜덤 숫자 생성 및 저장
    useEffect(() => {
        const randomNumber = () => {
            const newArray = [];
            for (let i = 0; i < 4; i++) {
                newArray.push(Math.floor(Math.random() * 10));
            }
            setAnswerArray(newArray);
        };

        randomNumber();
    }, []);

    useEffect(() => {
        if (answerArray.length > 0) {
            if (localStorage.getItem('qnsjfiw') === undefined) {
                localStorage.setItem('qnsjfiw', JSON.stringify(answerArray));
                console.log("저장된 값:", localStorage.getItem('qnsjfiw'));
            } else {
                console.log("already set!");
                console.log("저장된 값:", localStorage.getItem('qnsjfiw'));
            }
        }
    }, [answerArray]);

    return (
        <div className={styles.container}>
            <h6>escape in room</h6>
            <div className={styles.content}>
                <div className={styles.box}>
                    <Link to={"/ingame"}><p>start</p></Link>
                    <p onClick={() => {
                        alert("차후 준비 예정입니다.")
                    }}>tutorial</p>
                    <p onClick={() => {
                        alert("차후 준비 예정입니다.")
                    }}>setting</p>
                </div>
                <div
                    id="three-container"
                    style={{
                        width: `${canvasWidth}px`,
                        height: `${canvasHeight}px`,
                        backgroundColor: "var(--surface)",
                    }}
                ></div>
            </div>
        </div>
    );
}
