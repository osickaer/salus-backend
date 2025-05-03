import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsIn,
} from "class-validator";

export class LogUserGoalDto {
  @IsNumber()
  @Min(1, { message: "Age must be at least 1 year" })
  @Max(120, { message: "Age must be less than 120 years" })
  age: number;

  @IsNumber()
  @Min(20, { message: "Height must be at least 20 inches" })
  @Max(100, { message: "Height must be less than 100 inches" })
  height: number;

  @IsNumber()
  @Min(50, { message: "Weight must be at least 50 pounds" })
  @Max(500, { message: "Weight must be less than 500 pounds" })
  weight: number;

  @IsString()
  @IsIn(["male", "female"], { message: "Sex must be either male or female" })
  sex: string;

  @IsNumber()
  @Min(1.2, { message: "Activity factor must be at least 1.2" })
  @Max(2.5, { message: "Activity factor must be less than 2.5" })
  activityFactor: number;

  @IsString()
  @IsIn(["lose", "maintain", "gain"], {
    message: "Weight goal must be lose, maintain, or gain",
  })
  weightGoal: string;

  @IsString()
  @IsIn(["build_muscle", "lose_fat", "maintain"], {
    message: "Body goal must be build_muscle, lose_fat, or maintain",
  })
  bodyGoal: string;

  @IsString()
  @IsOptional()
  weightNotes?: string;

  @IsString()
  @IsOptional()
  bodyNotes?: string;

  @IsString()
  @IsOptional()
  lifestyleNotes?: string;
}
