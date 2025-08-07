"use client";

import IconButton from "@mui/material/IconButton";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React, { useRef, useState } from "react";
import { ArrowUpward } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import { QuestionModel } from "./models/question.model";
import { Typewriter } from "./components/typewriter";

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

interface Message {
    id: string;
    question: string;
    response: string;
    timestamp: Date;
}

export default function Home() {
    const [prompt, setPrompt] = useState<QuestionModel>({
        question_text: "",
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Enhanced handleInputChange for text input only
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Handle text input
        setPrompt((prev) => ({
            ...prev,
            question_text: value,
        }));
    };

    // Enhanced handlePrompt to support both text and files
    const handlePrompt = async (
        data: QuestionModel,
        file?: File
    ): Promise<string> => {
        try {
            // Create FormData object to handle both text and file
            const formData = new FormData();

            // Append text data
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append file if provided
            if (file) {
                formData.append("file", file);
            }

            // Send request with FormData
            const response = await axios.post(
                "http://localhost:8000/api/agent/question-form",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (prompt.question_text.trim() === "" || isLoading) return;

        const currentQuestion = prompt.question_text;
        setIsLoading(true);

        try {
            // Pass both the prompt and file to handlePrompt
            const result = await handlePrompt(prompt, file || undefined);
            const newMessage: Message = {
                id: Date.now().toString(),
                question: currentQuestion,
                response: result,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newMessage]);
            setPrompt({ question_text: "" });
            // Clear the file after submission
            setFile(null);
        } catch (error) {
            console.error("Error sending prompt:", error);
            // Add error message to chat
            const errorMessage: Message = {
                id: Date.now().toString(),
                question: currentQuestion,
                response:
                    "Sorry, there was an error processing your request. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleButtonClick = (): void => {
        fileRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit");
                // Clear the file input
                if (fileRef.current) {
                    fileRef.current.value = "";
                }
                return;
            }

            // Set the file in state
            setFile(file);
            console.log("File selected:", file.name);
        }
    };

    // Scroll to bottom when new messages are added
    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white text-center">
                    AI Agent
                </h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400">
                            <h2 className="text-xl font-semibold mb-2">
                                Welcome to AI Agent
                            </h2>
                            <p>
                                Start a conversation by typing a message below.
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="space-y-3">
                            {/* User Message */}
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                                    <p className="text-sm">
                                        {message.question}
                                    </p>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex justify-start">
                                <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                                    <p className="text-sm whitespace-pre-wrap">
                                        <Typewriter
                                            text={message.response}
                                            speed={20}
                                            className="text-sm"
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-white rounded-lg px-4 py-2">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span className="text-sm">
                                    AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                    {/* File Upload Button */}
                    <BootstrapTooltip title="Upload file" placement="top">
                        <IconButton
                            type="button"
                            onClick={handleButtonClick}
                            sx={{
                                color: "#60A5FA",
                                backgroundColor: "rgba(37, 99, 235, 0.2)",
                                borderRadius: "8px",
                                padding: "8px",
                                marginRight: "8px",
                                "&:hover": {
                                    color: "#93C5FD",
                                    backgroundColor: "rgba(37, 99, 235, 0.3)",
                                },
                            }}
                        >
                            <AttachFileIcon />
                        </IconButton>
                    </BootstrapTooltip>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".py,.xlsx,.xls,.csv"
                    />

                    {/* Text Input */}
                    <div className="flex-1 relative">
                        {/* File indicator */}
                        {file && (
                            <div className="flex items-center text-sm text-blue-400 mb-1">
                                <span className="truncate max-w-xs">
                                    File attached: {file.name}
                                </span>
                                <BootstrapTooltip title="Remove file" placement="top">
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="ml-2 text-gray-400 hover:text-white"
                                        aria-label="Remove file"
                                    >
                                        X
                                    </button>
                                </BootstrapTooltip>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="How can I assist you today?"
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            value={prompt.question_text}
                            disabled={isLoading}
                        />

                        {/* Send Button */}
                        <BootstrapTooltip
                            title={
                                prompt.question_text === "" || isLoading
                                    ? "Message empty."
                                    : "Send message"
                            }
                            placement="top"
                        >
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <IconButton
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={
                                        prompt.question_text === "" || isLoading
                                    }
                                    sx={{
                                        color:
                                            prompt.question_text === "" ||
                                            isLoading
                                                ? "#6B7280"
                                                : "#FFFFFF",
                                        backgroundColor:
                                            prompt.question_text === "" ||
                                            isLoading
                                                ? "rgba(75, 85, 99, 0.2)"
                                                : "#16A34A",
                                        borderRadius: "8px",
                                        padding: "8px",
                                        "&:hover": {
                                            color:
                                                prompt.question_text === "" ||
                                                isLoading
                                                    ? "#6B7280"
                                                    : "#F0FDF4",
                                            backgroundColor:
                                                prompt.question_text === "" ||
                                                isLoading
                                                    ? "rgba(75, 85, 99, 0.2)"
                                                    : "#15803D",
                                        },
                                        "&.Mui-disabled": {
                                            color: "#6B7280",
                                            backgroundColor:
                                                "rgba(75, 85, 99, 0.2)",
                                        },
                                    }}
                                >
                                    <ArrowUpward fontSize="small" />
                                </IconButton>
                            </div>
                        </BootstrapTooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
