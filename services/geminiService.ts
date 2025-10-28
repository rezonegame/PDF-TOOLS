
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function queryPdfContent(pdfText: string, query: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        You are an expert AI assistant specialized in analyzing PDF documents.
        Based *only* on the content of the document provided below, answer the user's question.
        Be precise and quote relevant parts of the document if possible.
        If the answer cannot be found in the document, state that clearly. Do not use external knowledge.

        DOCUMENT CONTENT:
        ---
        ${pdfText}
        ---

        USER'S QUESTION:
        ${query}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to get a response from the AI model. Please check your API key and network connection.");
    }
}
