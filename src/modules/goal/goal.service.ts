import { EntityManager } from "@mikro-orm/postgresql";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UserGoals } from "src/entities/UserGoals";
import { Users } from "src/entities/Users";

@Injectable()
export class GoalService {
  constructor(private readonly em: EntityManager) {}

  async getUserGoal(userId: string): Promise<UserGoals> {
    const goal = await this.em.findOne(
      UserGoals,
      { user: userId },
      { orderBy: { goalTimestamp: "DESC" } }
    );

    if (!goal) {
      throw new NotFoundException(`Goal for user ID ${userId} not found`);
    }

    return goal;
  }

  async logUserGoal(
    userId: string,
    data: {
      age: number;
      height: number;
      weight: number;
      sex: string;
      activityFactor: number;
      weightGoal: string;
      bodyGoal: string;
      weightNotes?: string;
      bodyNotes?: string;
      lifestyleNotes?: string;
    }
  ): Promise<UserGoals> {
    // Find the user
    const user = await this.em.findOne(Users, { user: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Calculate all metrics
    const metrics = this.calculateUserMetrics(data);

    // Create new goal record
    const goal = this.em.create(UserGoals, {
      user: userId,
      goalTimestamp: new Date(),
      ...metrics,
      weightNotes: data.weightNotes,
      bodyNotes: data.bodyNotes,
      lifestyleNotes: data.lifestyleNotes,
    });

    await this.em.persistAndFlush(goal);
    return goal;
  }

  private calculateTDEE(data: {
    age: number;
    height: number;
    weight: number;
    sex: string;
    activityFactor: number;
  }): number {
    // Convert units
    const weightKg = data.weight * 0.453592; // Convert pounds to kg
    const heightCm = data.height * 2.54; // Convert inches to cm
    const sexConstant = data.sex.toLowerCase() === "male" ? 5 : -161;

    // BMR calculation using Mifflin-St Jeor Equation
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age + sexConstant;

    // TDEE = BMR * Activity Factor
    return Math.round(bmr * data.activityFactor);
  }

  private calculateCalorieGoal(
    tdee: number,
    data: {
      sex: string;
      weightGoal: string;
      bodyGoal: string;
    }
  ): number {
    let calorieGoal = tdee;

    if (data.bodyGoal === "Max Calories") {
      calorieGoal = tdee + (data.sex.toLowerCase() === "male" ? 700 : 500);
    } else if (data.weightGoal === "Lose Weight") {
      calorieGoal = tdee - (data.sex.toLowerCase() === "male" ? 400 : 250);
    } else if (data.weightGoal === "Gain Weight") {
      calorieGoal = tdee + (data.sex.toLowerCase() === "male" ? 400 : 300);
    }

    return Math.round(calorieGoal);
  }

  private calculateUserMetrics(data: {
    age: number;
    height: number;
    weight: number;
    sex: string;
    activityFactor: number;
    weightGoal: string;
    bodyGoal: string;
  }) {
    const tdee = this.calculateTDEE(data);
    const calorieGoal = this.calculateCalorieGoal(tdee, data);

    // Calculate protein and fat based on goals
    let proteinGrams: number;
    let fatGrams: number;

    if (data.bodyGoal === "Gain Muscle") {
      proteinGrams = 0.9 * data.weight;
      fatGrams = 0.45 * data.weight;
    } else if (data.bodyGoal === "Lose Fat") {
      proteinGrams = 0.9 * data.weight;
      fatGrams = 0.35 * data.weight;
    } else {
      proteinGrams = 0.63 * data.weight;
      fatGrams = 0.4 * data.weight;
    }

    const proteinCals = 4 * proteinGrams;
    const fatCals = 9 * fatGrams;
    const carbCals = calorieGoal - (proteinCals + fatCals);
    const carbGrams = carbCals / 4;

    // Calculate potassium based on age and sex
    let potassium = 2300; // base case for female age <= 18
    if (data.sex.toLowerCase() === "male") {
      potassium = data.age > 18 ? 3400 : 3000;
    } else if (data.age > 18) {
      potassium = 2600;
    }

    // Calculate micronutrients
    const isMale = data.sex.toLowerCase() === "male";
    const isOver50 = data.age > 50;
    const isFemaleUnder50 = !isMale && data.age <= 50;

    return {
      measureSys: "USCS",
      activityFactor: data.activityFactor,
      weightGoal: data.weightGoal,
      bodyGoal: data.bodyGoal,
      surgery: 1,
      trauma: 1,
      burns: 1,
      infection: 1,
      tdee: BigInt(Math.round(tdee)),
      proteinGoal: Math.round(proteinGrams),
      fatGoal: Math.round(fatGrams),
      carbGoal: Math.round(carbGrams),
      satFatGoal: Math.round(fatGrams / 3),
      polyUnsatFatGoal: Math.round(fatGrams / 3),
      monoSatFatGoal: Math.round(fatGrams / 3),
      transFatGoal: 1,
      cholesterolGoal: 250,
      sodiumGoal: 1500,
      potassiumGoal: potassium,
      vitAGoal: isMale ? 900 : 700,
      vitCGoal: isMale ? 90 : 75,
      calciumGoal: isOver50 ? 1200 : 1000,
      ironGoal: isFemaleUnder50 ? 18 : 8,
      proteinCalsGoal: Math.round(proteinCals),
      fatCalsGoal: Math.round(fatCals),
      carbCalsGoal: Math.round(carbCals),
      calsGoal: Math.round(calorieGoal),
      satFatCalsGoal: Math.round(fatCals / 3),
      vitaminB1Goal: 1.2,
      vitaminB2Goal: isMale ? 1.3 : 1.1,
      vitaminB3Goal: isMale ? 16 : 14,
      vitaminB5Goal: 5,
      vitaminB6Goal: isOver50 ? 1.6 : 1.3,
      vitaminB12Goal: 2.4,
      folateGoal: 400,
      vitaminDGoal: 15,
      vitaminEGoal: 15,
      vitaminKGoal: isMale ? 120 : 90,
      copperGoal: 0.9,
      magnesiumGoal: isMale ? 400 : 310,
      manganeseGoal: isMale ? 2.3 : 1.8,
      phosphorusGoal: 700,
      seleniumGoal: 55,
      zincGoal: isMale ? 11 : 8,
      fiberGoal: isMale ? 38 : 25,
      sugarGoal: isMale ? 36 : 25,
      omega3Goal: isMale ? 1.6 : 1.1,
      omega6Goal: isMale ? 17 : 11,
    };
  }
}
