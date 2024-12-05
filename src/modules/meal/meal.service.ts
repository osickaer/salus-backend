import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Meals } from "src/entities/Meals";

@Injectable()
export class MealService {
  constructor(private readonly em: EntityManager) {}

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
}
