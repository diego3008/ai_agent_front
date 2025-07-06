import axios from "axios";

export const postPrompt = async (prompt: string) => {
    const response = await axios.post("/api/prompt", { prompt });
    return response.data;
};
