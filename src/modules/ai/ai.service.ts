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
import { timestamp } from "rxjs";
import { promises as fs } from "fs";
// import Configuration from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;
  private llm: ChatOpenAI;

  constructor(
    private readonly nutrientTool: GetNutrientAveragesTool,
    private readonly goalsTool: GetGoalsTool,
    private readonly strengthProgressTool: GetStrengthProgress,
    private readonly latestWorkoutTool: GetLatestWorkout
  ) {
    // will be deprecated
    // this.openai = new OpenAI({
    //   apiKey: process.env["OPENAI_API_KEY"],
    // });

    this.llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      streaming: true,
    });
  }

  async generateChatResponse(
    userId: string,
    userFullName: string,
    userQuery: string,
    chatTimestamp: string
  ): Promise<AsyncGenerator<string>> {
    // const { userId, userQuery } = input;
    const tools = [
      this.nutrientTool.tool,
      this.goalsTool.tool,
      this.strengthProgressTool.tool,
      this.latestWorkoutTool.tool,
    ];

    const toolsByName = {
      getAvgNutrients: this.nutrientTool.tool,
      getGoals: this.goalsTool.tool,
      getStrengthProgress: this.strengthProgressTool.tool,
      getLatestWorkout: this.latestWorkoutTool.tool,
    };

    const handleRunTimeRequestRunnable = RunnableLambda.from(
      async (params: { userId: string; query: string; llm: BaseChatModel }) => {
        const { userId, query, llm } = params;
        if (!llm.bindTools) {
          throw new Error("Language model does not support tools.");
        }
        setContextVariable("userId", userId);
        setContextVariable("userFullName", userFullName);

        const llmWithTools = llm.bindTools(tools);
        const messages = [
          new SystemMessage(
            await fs.readFile("prompts/toolCallerPrompt.md", "utf8")
          ),
          new HumanMessage(query),
        ];
        const modelResponse = await llmWithTools.invoke(messages);
        const toolCalls = modelResponse.tool_calls || [];

        // Add detailed logging for tool calls
        console.log("\n=== Tool Calls ===");
        if (toolCalls.length === 0) {
          console.log("No tool calls made");
        } else {
          toolCalls.forEach((toolCall, index) => {
            console.log(`\nTool Call ${index + 1}:`);
            console.log(
              JSON.stringify(
                {
                  name: toolCall.name,
                  args: toolCall.args,
                },
                null,
                2
              )
            );
          });
        }
        console.log("================\n");

        const toolExecutionChain = RunnableParallel.from(
          toolCalls.map((toolCall) => {
            const tool = toolsByName[toolCall.name];
            if (!tool) {
              throw new Error(`Tool "${toolCall.name}" not found.`);
            }
            return () => tool.invoke(toolCall.args);
          })
        );

        const results = await toolExecutionChain.invoke({});

        // Log tool execution results
        console.log("\n=== Tool Results ===");
        console.log(JSON.stringify(results, null, 2));
        console.log("==================\n");

        return results;
      }
    );
    // Example tool invocation

    const toolResults = await handleRunTimeRequestRunnable.invoke({
      userId: userId,
      query: userQuery,
      llm: this.llm,
    });

    const toolResultsContext = Object.values(toolResults).join("\n");

    // const user_prompt = `[${chatTimestamp}] ${userFullName}: ${userQuery}

    // Athlete's additional information:
    // ${toolResultsContext}`;

    const messages = [
      new SystemMessage(await fs.readFile("prompts/salusPrompt.md", "utf8")),
      new HumanMessage(userQuery),
    ];

    const system_prompt = await fs.readFile("prompts/salusPrompt.md", "utf8");
    const system_prompt_template = system_prompt.replace(
      "{context}",
      toolResultsContext
    );

    const promptTemplate = ChatPromptTemplate.fromMessages([
      new SystemMessage(system_prompt_template),
      new MessagesPlaceholder("messages"),
    ]);

    const chain = promptTemplate.pipe(this.llm);

    const stream = await chain.stream({
      messages: messages,
      context: toolResultsContext,
    });

    // Convert stream to JSON chunks with metadata and pretty formatting
    const jsonStream = (async function* () {
      let fullResponse = ""; // Track complete response for debugging
      for await (const chunk of stream) {
        const jsonChunk = {
          content: chunk.content,
          chunkSource: "AI",
          timestamp: new Date().toISOString(), // Optional: add timestamp for debugging
        };

        fullResponse += chunk.content; // Accumulate the response
        yield JSON.stringify(jsonChunk) + "\n";
      }

      // Log complete response at the end
      console.log("\n=== Complete Response ===");
      console.log(fullResponse);
      console.log("======================\n");
    })();

    return jsonStream;
  }

  async getNutritionalContent(formattedInput: string): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the provided food description and return the nutritional content in the following JSON format. If the meal type is not provided, assume it based on the timestamp:
            {
                "foodDesc": "<food item>",
                "ingredients": [<ingredient 1>, <ingredient 2>, ...],
                "calories": <calories>,
                "protein": <protein in grams>,
                "totalCarbs": <carbs in grams>,
                "totalFat": <fat in grams>,
                "satFat": <saturated fat in grams>,
                "polyUnsatFat": <polyunsaturated fat in grams>,
                "monoUnsatFat": <monounsaturated fat in grams>,
                "transFat": <trans fat in grams>,
                "cholesterol": <cholesterol in mg>,
                "sodium": <sodium in mg>,
                "potassium": <potassium in mg>,
                "vitaminA": <vitamin A in mcg>,
                "vitaminC": <vitamin C in mcg>,
                "calcium": <calcium in mg>,
                "iron": <iron in mg>,
                "mealType": "<breakfast, lunch, dinner, or snack>",
                "vitaminB1": <vitamin B1 (Thiamine) in mg>,
                "vitaminB2": <vitamin B2 (Riboflavin) in mg>,
                "vitaminB3": <vitamin B3 (Niacin) in mg>,
                "vitaminB5": <vitamin B5 (Pantothenic Acid) in mg>,
                "vitaminB6": <vitamin B6 (Pyridoxine) in mg>,
                "vitaminB12": <vitamin B12 (Cobalamin) in mcg>,
                "folate": <folate in mcg>,
                "vitaminD": <vitamin D in mcg>,
                "vitaminE": <vitamin E in mg>,
                "vitaminK": <vitamin K in mcg>,
                "copper": <copper in mcg>,
                "magnesium": <magnesium in mg>,
                "manganese": <manganese in mg>,
                "phosphorus": <phosphorus in mg>,
                "selenium": <selenium in mcg>,
                "zinc": <zinc in mg>,
                "fiber": <fiber in g>,
                "fiberSoluble": <soluble fiber in g>,
                "fiberInsoluble": <insoluble fiber in g>,
                "netCarbs": <net carbs in g>,
                "starch": <starch in g>,
                "sugars": <sugar in grams>,
                "omega3": <omega 3 in g>,
                "omega6": <omega 6 in g>,
                "cystine": <cystine in g>,
                "histidine": <histidine in g>,
                "isoleucine": <isoleucine in g>,
                "leucine": <leucine in g>,
                "lysine": <lysine in g>,
                "methionine": <methionine in g>,
                "phenylalanine": <phenylalanine in g>,
                "threonine": <threonine in g>,
                "tryptophan": <tryptophan in g>,
                "tyrosine": <tyrosine in g>,
                "valine": <valine in g>
            }`,
        },
        { role: "user", content: formattedInput },
      ],
      temperature: 0,
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    return JSON.parse(content);
  }
}
