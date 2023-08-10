import Prompt from "@models/prompt";
import { connectDB } from "@utils/database";

// get read

export const GET = async (req, { params }) => {
  try {
    await connectDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to load prompts", { status: 500 });
  }
};

// update prompt

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();
  try {
    await connectDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to Update the prompt", { status: 500 });
  }
};

// delete prompt

export const DELETE = async (req, { params }) => {
  try {
    await connectDB();

    const existingPrompt = await Prompt.findByIdAndRemove(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response("Promt deleted successfully ", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete the prompt", { status: 500 });
  }
};
