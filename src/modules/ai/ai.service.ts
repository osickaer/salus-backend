//src/modules/ai/ai.service.ts
import { ChatOpenAI } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import { GetNutrientAveragesTool } from "./tools/getNutritientAverages.tool";
import { setContextVariable } from "@langchain/core/context";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableLambda, RunnableParallel } from "@langchain/core/runnables";
import {
  AIMessage,
  SystemMessage,
  HumanMessage,
} from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { GetGoalsTool } from "./tools/getGoals.tool";
import { GetStrengthProgress } from "./tools/getStrengthProgress.tool";
import { GetLatestWorkout } from "./tools/getLatestWorkout.tool";
import { GetNutritionalContentTool } from "./tools/getNutritionalContent.tool";
import { timestamp } from "rxjs";
import { promises as fs } from "fs";
// import Configuration from "openai";

@Injectable()
export class AiService {
  constructor(
    private readonly nutritionalContentTool: GetNutritionalContentTool
  ) {}

  async getNutritionalContent(formattedInput: string): Promise<any> {
    return this.nutritionalContentTool.tool.invoke(
      { mealDescription: formattedInput },
      {}
    );
  }
}

// async generateChatResponse(
//   userId: string,
//   userFullName: string,
//   userQuery: string,
//   chatTimestamp: string
// ): Promise<AsyncGenerator<string>> {
//   // const { userId, userQuery } = input;
//   const tools = [
//     this.nutrientTool.tool,
//     this.goalsTool.tool,
//     this.strengthProgressTool.tool,
//     this.latestWorkoutTool.tool,
//   ];

//   const toolsByName = {
//     getAvgNutrients: this.nutrientTool.tool,
//     getGoals: this.goalsTool.tool,
//     getStrengthProgress: this.strengthProgressTool.tool,
//     getLatestWorkout: this.latestWorkoutTool.tool,
//   };

//   const handleRunTimeRequestRunnable = RunnableLambda.from(
//     async (params: { userId: string; query: string; llm: BaseChatModel }) => {
//       const { userId, query, llm } = params;
//       if (!llm.bindTools) {
//         throw new Error("Language model does not support tools.");
//       }
//       setContextVariable("userId", userId);
//       setContextVariable("userFullName", userFullName);

//       const llmWithTools = llm.bindTools(tools);
//       const messages = [
//         new SystemMessage(
//           await fs.readFile("prompts/toolCallerPrompt.md", "utf8")
//         ),
//         new HumanMessage(query),
//       ];
//       const modelResponse = await llmWithTools.invoke(messages);
//       const toolCalls = modelResponse.tool_calls || [];

//       // Add detailed logging for tool calls
//       console.log("\n=== Tool Calls ===");
//       if (toolCalls.length === 0) {
//         console.log("No tool calls made");
//       } else {
//         toolCalls.forEach((toolCall, index) => {
//           console.log(`\nTool Call ${index + 1}:`);
//           console.log(
//             JSON.stringify(
//               {
//                 name: toolCall.name,
//                 args: toolCall.args,
//               },
//               null,
//               2
//             )
//           );
//         });
//       }
//       console.log("================\n");

//       const toolExecutionChain = RunnableParallel.from(
//         toolCalls.map((toolCall) => {
//           const tool = toolsByName[toolCall.name];
//           if (!tool) {
//             throw new Error(`Tool "${toolCall.name}" not found.`);
//           }
//           return () => tool.invoke(toolCall.args);
//         })
//       );

//       const results = await toolExecutionChain.invoke({});

//       // Log tool execution results
//       console.log("\n=== Tool Results ===");
//       console.log(JSON.stringify(results, null, 2));
//       console.log("==================\n");

//       return results;
//     }
//   );
//   // Example tool invocation

//   const toolResults = await handleRunTimeRequestRunnable.invoke({
//     userId: userId,
//     query: userQuery,
//     llm: this.llm,
//   });

//   const toolResultsContext = Object.values(toolResults).join("\n");

//   // const user_prompt = `[${chatTimestamp}] ${userFullName}: ${userQuery}

//   // Athlete's additional information:
//   // ${toolResultsContext}`;

//   const messages = [
//     new SystemMessage(await fs.readFile("prompts/salusPrompt.md", "utf8")),
//     new HumanMessage(userQuery),
//   ];

//   const system_prompt = await fs.readFile("prompts/salusPrompt.md", "utf8");
//   const system_prompt_template = system_prompt.replace(
//     "{context}",
//     toolResultsContext
//   );

//   const promptTemplate = ChatPromptTemplate.fromMessages([
//     new SystemMessage(system_prompt_template),
//     new MessagesPlaceholder("messages"),
//   ]);

//   const chain = promptTemplate.pipe(this.llm);

//   const stream = await chain.stream({
//     messages: messages,
//     context: toolResultsContext,
//   });

//   // Convert stream to JSON chunks with metadata and pretty formatting
//   const jsonStream = (async function* () {
//     let fullResponse = ""; // Track complete response for debugging
//     for await (const chunk of stream) {
//       const jsonChunk = {
//         content: chunk.content,
//         chunkSource: "AI",
//         timestamp: new Date().toISOString(), // Optional: add timestamp for debugging
//       };

//       fullResponse += chunk.content; // Accumulate the response
//       yield JSON.stringify(jsonChunk) + "\n";
//     }

//     // Log complete response at the end
//     console.log("\n=== Complete Response ===");
//     console.log(fullResponse);
//     console.log("======================\n");
//   })();

//   return jsonStream;
// }
