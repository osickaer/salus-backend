import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import Configuration from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });
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
