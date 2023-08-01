import { Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
  apiKey: "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",
});

const openAIEngine = new OpenAIApi(openAIConfig);
const openAIModel = "text-davinci-002";

async function sendOpenAICommand(command: string) {
  let res;
  //console.log(command);
  res = await openAIEngine.createCompletion({
    model: openAIModel,
    prompt: command,
  });
  return res.data.choices[0].text;
}

export async function generateDaVinciResponse(prompt: string) {
    try {
      const res = await sendOpenAICommand(prompt);
      console.log("API Response:", res);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
    
//generateDaVinciResponse("Make an newpaper title for a stock crash");
  