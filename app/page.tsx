"use client";

import IconButton from "@mui/material/IconButton";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React, { useRef, useState } from "react";
import { ArrowUpward } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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

    const fileRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
            const result = await handlePrompt(prompt);
            const newMessage: Message = {
                id: Date.now().toString(),
                question: currentQuestion,
                response: result,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newMessage]);
            setPrompt({ question_text: "" });
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
            console.log(file);
            // Handle file upload logic here
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
                                        {message.response}
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
                            className="text-gray-400 hover:text-white"
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
                        accept=".py"
                    />

                    {/* Text Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="How can I help you today?"
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
                                    className={
                                        prompt.question_text === "" || isLoading
                                            ? "text-gray-500"
                                            : "text-blue-500 hover:text-blue-400"
                                    }
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
