"use client";

import IconButton from "@mui/material/IconButton";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useState } from "react";
import { ArrowUpward } from "@mui/icons-material";
import axios from "axios";
import { QuestionModel } from "./models/question.model";

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
    const [prompt, setPrompt] = useState<QuestionModel>({
        question_text: "",
    });
    const [response, setResponse] = useState<Array<string>>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const question_text = e.target.value;
        setPrompt((prev) => ({
            ...prev,
            question_text,
        }));
    };

    const handlePrompt = async (data: QuestionModel): Promise<string> => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/agent/question",
                data
            );
            return response.data; // ← Cambio aquí
        } catch (error: any) {
            console.log(error);
            throw error; // ← Mejor lanzar el error en lugar de retornarlo
        }
    };

    const handleSubmit = async () => {
        console.log(prompt.question_text);
        if (prompt.question_text.trim() === "") return;

        try {
            const result = await handlePrompt(prompt);
            setResponse((prev) => [...prev, result]);
            // Limpiar el input después del envío
            setPrompt({ question_text: "" });
        } catch (error) {
            console.error("Error sending prompt:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-screen">
                <div>
                    {response.map((resp, index) => (
                        <h1 key={index}>{resp}</h1>
                    ))}
                </div>
                <h1 className="text-4xl text-center pb-4">AI Agent</h1>
                <div
                    className="h-2/12 w-6/12 messagesBackground border-2 
                border-gray-600/30 rounded-xl shadow-md mb-8 flex flex-col p-4 overflow-y-auto"
                >
                    <div className="grid grid-cols-12">
                        <input
                            type="text"
                            placeholder="How can I help you today?"
                            className="col-span-11 focus:outline-none mt-4"
                            onChange={handleInputChange}
                            value={prompt.question_text}
                        />
                        <BootstrapTooltip
                            title={
                                prompt.question_text === ""
                                    ? "Message empty."
                                    : ""
                            }
                            placement="right"
                        >
                            <div
                                className={
                                    prompt.question_text === ""
                                        ? "rounded-full bg-gray-300 mx-auto mt-4"
                                        : "rounded-full buttonBackground mx-auto mt-4"
                                }
                            >
                                <IconButton
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    <ArrowUpward
                                        fontSize="medium"
                                        sx={{
                                            color:
                                                prompt.question_text === ""
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
