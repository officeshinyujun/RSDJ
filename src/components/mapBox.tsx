import { useEffect, useRef, useState } from "react";
import Modal from "./modal/Modal.tsx"

type ObjectProps = { x: number; y: number; width: number; height: number };
type ObjectProps2 = { x: number; y: number; width: number; height: number; id: number };

type MapBoxProps = {
    inwalls: Array<ObjectProps>;
    width: number;
    height: number;
    doors: Array<ObjectProps>;
    item: Array<ObjectProps2>;
};

export default function MapBox({ inwalls, width, height, doors, item }: MapBoxProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [collectedItems, setCollectedItems] = useState<Set<number>>(new Set());
    const [isItemOpen, setIsItemOpen] = useState(false);

    const walls = inwalls;
    const items = item;
    const player = { x: 10, y: 250, width: 50, height: 150, speed: 5, dx: 0, dy: 0 };
    const exit = doors;
    const keys: Record<string, boolean> = { w: false, s: false, a: false, d: false };

    const gameLoop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // 키 입력에 따라 이동 방향 설정
        player.dx = keys.a ? -player.speed : keys.d ? player.speed : 0;
        player.dy = keys.w ? -player.speed : keys.s ? player.speed : 0;

        const nextPlayer = { ...player, x: player.x + player.dx, y: player.y + player.dy };

        // 화면 경계 확인
        nextPlayer.x = Math.max(0, Math.min(canvas.width - player.width, nextPlayer.x));
        nextPlayer.y = Math.max(0, Math.min(canvas.height - player.height, nextPlayer.y));

        // 벽 충돌 확인
        if (!isCollidingWithWalls(nextPlayer)) {
            player.x = nextPlayer.x;
            player.y = nextPlayer.y;
        }

        // exit 충돌 확인
        if (isCollidingWithExits(nextPlayer)) {
            console.log("탈출");
        }

        checkCollisionWithItems(nextPlayer);
        draw(context);
        requestAnimationFrame(gameLoop);
    };

    const isCollidingWithExits = (nextPlayer: typeof player) => {
        return exit.some((exit) => {
            return (
                nextPlayer.x < exit.x + exit.width &&
                nextPlayer.x + nextPlayer.width > exit.x &&
                nextPlayer.y < exit.y + exit.height &&
                nextPlayer.y + nextPlayer.height > exit.y
            );
        });
    };

    const isCollidingWithWalls = (nextPlayer: typeof player) => {
        return walls.some((wall) => {
            return (
                nextPlayer.x < wall.x + wall.width &&
                nextPlayer.x + nextPlayer.width > wall.x &&
                nextPlayer.y < wall.y + wall.height - 100 &&
                nextPlayer.y + nextPlayer.height > wall.y
            );
        });
    };

    const checkCollisionWithItems = (nextPlayer: typeof player) => {
        items.forEach((item) => {
            if (
                !collectedItems.has(item.id) &&
                nextPlayer.x < item.x + item.width &&
                nextPlayer.x + nextPlayer.width > item.x &&
                nextPlayer.y < item.y + item.height &&
                nextPlayer.y + nextPlayer.height > item.y
            ) {
                console.log(`아이템 ${item.id} 충돌!`);
                setIsItemOpen(true)
                setCollectedItems((prev) => new Set(prev).add(item.id));
            }
        });
    };

    const draw = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = "black";
        walls.forEach((wall) => {
            context.fillRect(wall.x, wall.y, wall.width, wall.height);
        });

        context.fillStyle = "blue";
        exit.forEach((door) => {
            context.fillRect(door.x, door.y, door.width, door.height);
        });

        context.fillStyle = "green";
        items.forEach((item) => {
            if (!collectedItems.has(item.id)) {
                context.fillRect(item.x, item.y, item.width, item.height);
            }
        });

        context.fillStyle = "red";
        context.fillRect(player.x, player.y, player.width, player.height);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const closeModal = () => {
        setIsItemOpen(false);
    };


    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <canvas ref={canvasRef} width={width} height={height} style={{ border: "1px solid black" }}></canvas>
            {isItemOpen && (
                <Modal
                    width="300px"
                    height="300px"
                    onOpen={isItemOpen}
                    onClose={closeModal}
                >
                    <p>asf</p>
                    <button onClick={closeModal}>asd</button>
                </Modal>
            )}
        </div>
    );
}
