import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!configuration.apiKey) {
    res.status(500).json({ error: "No API key set." });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.length === 0) {
    res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 3500,
    })

    res.status(200).json({ result: response.data.choices[0].text });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}