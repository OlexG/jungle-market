import { OpenAI } from 'https://deno.land/x/openai/mod.ts'
import getGPT35TurboMessage from './getGPT3.5TurboMessage.ts';
import { config } from "mod";
let { OPENAI_KEY } = config();
if (!OPENAI_KEY) {
  OPENAI_KEY = Deno.env.get("OPENAI_KEY") || "";
} 

const openai = new OpenAI(
  OPENAI_KEY
);

const GPT35Turbo = async (message:any) => {
  const response: any = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });

  if(response.choices[0].message.content){
    return (response.choices[0].message.content);
  }
  console.log("Something went wrong")
  return "Something went wrong";
};

export default async function runGPT35Turbo(input: string) {
  const message = getGPT35TurboMessage(input);
  const result = await GPT35Turbo(message);
  //console.log(result); 
  return result; 
}

//runGPT35Turbo("Replace this with company details for testing") 
