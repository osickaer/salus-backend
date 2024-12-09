import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Meals } from "src/entities/Meals";
import { AiService } from "../ai/ai.service";

@Injectable()
export class MealService {
  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService
  ) {}

  async getMealHistory(userId: string): Promise<Partial<Meals>[]> {
    const meals = await this.em.find(
      Meals,
      { user: userId },
      {
        fields: ["mealId", "foodDesc", "mealType", "calories", "mealTimestamp"], // Specify the fields to query
        orderBy: { mealTimestamp: "DESC" },
        limit: 14,
      }
    );

    return meals || [];
  }

  async getMealDetail(userId: string, mealId: string): Promise<Meals> {
    const mealDetail = await this.em.findOne(Meals, {
      user: userId,
      mealId: mealId,
    });

    if (!mealDetail) {
      throw new NotFoundException(`Meal detail with ID ${mealId} not found`);
    }

    return mealDetail;
  }

  async logMeal(
    userId: string,
    foodDescription: string,
    timestamp: string,
    mealType?: string
  ): Promise<string> {
    // Validate foodDescription is a string
    if (typeof foodDescription !== "string" || foodDescription.trim() === "") {
      throw new BadRequestException(
        "Food description must be a non-empty string."
      );
    }

    // Validate timestamp is a valid ISO 8601 format
    const mealTimestamp = new Date(timestamp);
    if (isNaN(mealTimestamp.getTime())) {
      throw new BadRequestException(
        "Invalid timestamp format. Provide a valid ISO 8601 timestamp."
      );
    }

    const formattedInput = `Food Description: ${foodDescription}\nTimestamp: ${mealTimestamp}\nMeal Type: ${mealType}`;

    // Fetch nutritional content
    const nutritionalContent =
      await this.aiService.getNutritionalContent(formattedInput);

    if (!nutritionalContent) {
      throw new BadRequestException("Failed to fetch nutritional content.");
    }

    const meal = this.em.create(Meals, {
      user: userId,
      mealTimestamp: timestamp,
      ...nutritionalContent,
    });

    await this.em.persistAndFlush(meal);

    return `Logged ${foodDescription} in the meal log.`;
  }
}
