import Image from "next/image";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { colors, Tooltip } from "@mui/material";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl text-center pb-4">Chatbot</h1>
            <div className="h-8/12 w-8/12 bg-gray-500/20 border-2 border-gray-600/30 rounded-lg shadow-md mb-8 flex flex-col p-4 overflow-y-auto">
                <div className="flex mb-3">
                    <div className="bg-blue-300 rounded-lg py-2 px-3 max-w-[80%]">
                        <p className="text-sm text-gray-800">
                            Hola!. Cómo estás?.
                        </p>
                        <p className="text-xs text-gray-500 text-right mt-1">
                            Chat
                        </p>
                    </div>
                </div>

                <div className="flex mb-3 justify-end">
                    <div className="bg-blue-300 rounded-lg py-2 px-3 max-w-[80%]">
                        <p className="text-sm text-gray-800">
                            ¡Muy bien, gracias!
                        </p>
                        <p className="text-xs text-gray-500 text-right mt-1">
                            Diego
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-8/12">
                <div className="flex gap-2">
                    <TextField
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white w-full"
                        placeholder="Escribe un mensaje..."
                        variant="standard"
                    />
                    <Tooltip title="Send" placement="right" arrow>
                        <IconButton
                            aria-label="send"
                            style={{ color: "white" }}
                        >
                            <SendIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
