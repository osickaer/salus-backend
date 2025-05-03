import { tool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

@Injectable()
export class GetNutritionalContentTool {
  private structuredLlm: Runnable;

  constructor() {
    const outputSchema = z.object({
      foodDesc: z.string().describe("The food item description"),
      ingredients: z
        .array(z.string())
        .describe("List of ingredients in the food"),
      calories: z.number().describe("Total calories"),
      protein: z.number().describe("Protein in grams"),
      totalCarbs: z.number().describe("Total carbohydrates in grams"),
      totalFat: z.number().describe("Total fat in grams"),
      satFat: z.number().describe("Saturated fat in grams"),
      polyUnsatFat: z.number().describe("Polyunsaturated fat in grams"),
      monoUnsatFat: z.number().describe("Monounsaturated fat in grams"),
      transFat: z.number().describe("Trans fat in grams"),
      cholesterol: z.number().describe("Cholesterol in mg"),
      sodium: z.number().describe("Sodium in mg"),
      potassium: z.number().describe("Potassium in mg"),
      vitaminA: z.number().describe("Vitamin A in mcg"),
      vitaminC: z.number().describe("Vitamin C in mcg"),
      calcium: z.number().describe("Calcium in mg"),
      iron: z.number().describe("Iron in mg"),
      mealType: z
        .enum(["breakfast", "lunch", "dinner", "snack"])
        .describe("Type of meal"),
      vitaminB1: z.number().describe("Vitamin B1 (Thiamine) in mg"),
      vitaminB2: z.number().describe("Vitamin B2 (Riboflavin) in mg"),
      vitaminB3: z.number().describe("Vitamin B3 (Niacin) in mg"),
      vitaminB5: z.number().describe("Vitamin B5 (Pantothenic Acid) in mg"),
      vitaminB6: z.number().describe("Vitamin B6 (Pyridoxine) in mg"),
      vitaminB12: z.number().describe("Vitamin B12 (Cobalamin) in mcg"),
      folate: z.number().describe("Folate in mcg"),
      vitaminD: z.number().describe("Vitamin D in mcg"),
      vitaminE: z.number().describe("Vitamin E in mg"),
      vitaminK: z.number().describe("Vitamin K in mcg"),
      copper: z.number().describe("Copper in mcg"),
      magnesium: z.number().describe("Magnesium in mg"),
      manganese: z.number().describe("Manganese in mg"),
      phosphorus: z.number().describe("Phosphorus in mg"),
      selenium: z.number().describe("Selenium in mcg"),
      zinc: z.number().describe("Zinc in mg"),
      fiber: z.number().describe("Total fiber in grams"),
      fiberSoluble: z.number().describe("Soluble fiber in grams"),
      fiberInsoluble: z.number().describe("Insoluble fiber in grams"),
      netCarbs: z.number().describe("Net carbs in grams"),
      starch: z.number().describe("Starch in grams"),
      sugars: z.number().describe("Sugars in grams"),
      omega3: z.number().describe("Omega 3 in grams"),
      omega6: z.number().describe("Omega 6 in grams"),
      cystine: z.number().describe("Cystine in grams"),
      histidine: z.number().describe("Histidine in grams"),
      isoleucine: z.number().describe("Isoleucine in grams"),
      leucine: z.number().describe("Leucine in grams"),
      lysine: z.number().describe("Lysine in grams"),
      methionine: z.number().describe("Methionine in grams"),
      phenylalanine: z.number().describe("Phenylalanine in grams"),
      threonine: z.number().describe("Threonine in grams"),
      tryptophan: z.number().describe("Tryptophan in grams"),
      tyrosine: z.number().describe("Tyrosine in grams"),
      valine: z.number().describe("Valine in grams"),
    });
    const model = new ChatOpenAI({
      model: "gpt-4.1-mini",
      streaming: false,
      temperature: 0,
    });

    this.structuredLlm = model.withStructuredOutput(outputSchema);
  }

  // Function to fetch 2-week average nutrient data
  async getNutritionalContent(mealDescription: string): Promise<object> {
    try {
      const result = await this.structuredLlm.invoke(mealDescription);

      if (!result) {
        return {
          error: `Something went wrong when fetching nutritional content.\n`,
        };
      }

      return result;
    } catch (error) {
      console.error(`Error retrieving average nutrients: ${error.message}`);
      throw new Error("Failed to retrieve nutrient averages.");
    }
  }

  // Define the LangChain tool
  get tool() {
    const toolSchema = z.object({
      mealDescription: z
        .string()
        .describe("The natural language string that describes the meal"),
    });

    return tool(
      async (input, config: LangGraphRunnableConfig): Promise<object> => {
        const { mealDescription } = input;
        return this.getNutritionalContent(mealDescription);
      },
      {
        name: "getNutritionalContent",
        description:
          "Fetches the macro and micro nutrient data for a given meal description.",
        schema: toolSchema,
      }
    );
  }
}
