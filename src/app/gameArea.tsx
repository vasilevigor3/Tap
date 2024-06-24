"use client";
import { Button } from "./components/ui/Button";

export default function GameComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] bg-[url('/texture.svg')] bg-repeat p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
            {/* <h1 className="text-2xl font-bold text-white text-center">Cosmic Crusaders</h1> */}
                <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-[#262626] rounded-lg">
                    <div className="text-white text-4xl font-bold text-center">Game Area</div>
                </div>
                <div className="flex items-center justify-center gap-4 w-full">
                    <Button variant="outline" size="lg" className="text-white">
                        Start
                    </Button>
                    <Button variant="outline" size="lg" className="text-white">
                        Pause
                    </Button>
                    <Button variant="outline" size="lg" className="text-white">
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}