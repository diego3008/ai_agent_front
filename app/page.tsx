"use client";

import Image from "next/image";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import {
    colors,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps,
} from "@mui/material";
import { useState } from "react";
import { ArrowUpward } from "@mui/icons-material";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

export default function Home() {
    const [prompt, setPrompt] = useState("");

    const onDisableSend = (): boolean => {
        if (prompt.trim() === "") {
            return true;
        }
        return false;
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl text-center pb-4">Chatbot</h1>
                <div
                    className="h-2/12 w-6/12 messagesBackground border-2 
                border-gray-600/30 rounded-xl shadow-md mb-8 flex flex-col p-4 overflow-y-auto"
                >
                    <div className="grid grid-cols-12">
                        <input
                            type="text"
                            placeholder="How can I help you today?"
                            className="col-span-11 focus:outline-none mt-4"
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                        />
                        <BootstrapTooltip
                            title={prompt === "" ? "Message empty." : ""}
                            placement="right"
                        >
                            <div
                                className={
                                    prompt === ""
                                        ? "rounded-full bg-gray-300 mx-auto mt-4"
                                        : "rounded-full bg-blue-500 mx-auto mt-4"
                                }
                            >
                                <IconButton>
                                    <ArrowUpward
                                        fontSize="medium"
                                        sx={{
                                            color:
                                                prompt === ""
                                                    ? "disabled"
                                                    : "white",
                                        }}
                                    />
                                </IconButton>
                            </div>
                        </BootstrapTooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
