import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { UserGoals } from "src/entities/UserGoals";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

@Injectable()
export class AnswerQuestionTool {
  constructor() {}

  // Define the LangChain tool
  get tool() {
    return tool(
      async (_, config: LangGraphRunnableConfig): Promise<string> => {
        return "";
      },
      {
        name: "answer_question",
        description:
          "Routes to the responder that will directly answer the user query.",
        schema: null, // No schema needed
      }
    );
  }
}
