//src/modules/ai/ai.service.ts
import { ChatOpenAI } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import { GetNutrientAveragesTool } from "./tools/getNutritientAverages.tool";
import { setContextVariable } from "@langchain/core/context";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableLambda, RunnableParallel } from "@langchain/core/runnables";
import { AIMessage } from "@langchain/core/messages";
import { GetGoalsTool } from "./tools/getGoals.tool";
import { GetStrengthProgress } from "./tools/getStrengthProgress.tool";
import { GetLatestWorkout } from "./tools/getLatestWorkout.tool";
import { timestamp } from "rxjs";
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
    });
  }

  async generateChatResponse(
    userId: string,
    userFullName: string,
    userQuery: string,
    chatTimestamp: string,
  ): Promise<any> {
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
        const modelResponse = await llmWithTools.invoke(query);
        const toolCalls = modelResponse.tool_calls || [];

        const toolExecutionChain = RunnableParallel.from(
          toolCalls.map((toolCall) => {
            const tool = toolsByName[toolCall.name];
            if (!tool) {
              throw new Error(`Tool "${toolCall.name}" not found.`);
            }
            return () => tool.invoke(toolCall.args);
          })
        );

        return toolExecutionChain.invoke({});
      }
    );
    // Example tool invocation

    const toolResults = await handleRunTimeRequestRunnable.invoke({
      userId: userId,
      query: userQuery,
      llm: this.llm,
    });

    const toolResultsContext = Object.values(toolResults).join("\n")

//     const systemPrompt = `The assistant is Salus, a personal trainer created by Ransom Inc.
// It answers questions about fitness and nutrition the way a personal trainer with many years of experience would. If provided scientific research, Salus carefully thinks through it and applies it to the conversation.
// Salus carefully considers the athlete's question, and if additional information is needed, Salus asks follow-up questions.
// However, right now Salus cannot take any agentic actions like updating the Athlete's meal log or workout schedule. Salus can only analyze them as provided.
// It clearly thinks through information provided and informs the athlete what data or research was used to form the response. E.g. "Based on your goals of x,y,z you should do ..." or "Because you haven't been meeting your nutrition goals you should do..."
// Salus also considers the timestamps of each chat that is provided and uses these to greet the athlete appropriately. Salus never includes actual timestamps in the response though.
// It always keeps any advice focused on personal training and nutrition. If the conversation veers away from fitness, Salus subtly steers it back on track.
// Rather than giving a long response, it gives a concise response and offers to elaborate if further information may be helpful.
// Salus is happy to help with fitness advice, nutritional advice, and deep analysis of the athlete's metrics.
// Salus responds directly to all human messages without unnecessary affirmations or filler phrases like “Certainly!”, “Of course!”, “Absolutely!”, “Great!”, “Sure!”, etc. Specifically, Salus avoids starting responses with the word “Certainly” in any way.

// Salus is now being connected with an athlete.`

    const user_prompt = `[${chatTimestamp}] ${userFullName}: ${userQuery}

    Athlete's additional information:
    ${toolResultsContext}`

    // const result = await llmWithTools.invoke(userQuery);
    // console.log("RESULT:\n", result);
    // console.log("TOOL CALLS:\n", result.tool_calls);
    // Placeholder for other logic (e.g., LLM calls)
    return user_prompt;
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
