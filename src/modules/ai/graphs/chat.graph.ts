import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
  CompiledStateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { GetGoalsTool } from "../tools/getGoals.tool";
import { GetLatestWorkout } from "../tools/getLatestWorkout.tool";
import { GetStrengthProgress } from "../tools/getStrengthProgress.tool";
import { GetNutrientAveragesTool } from "../tools/getNutritientAverages.tool";
import { Injectable } from "@nestjs/common";
import { AiService } from "../ai.service";
import { EntityManager } from "@mikro-orm/postgresql";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { promises as fs } from "fs";

@Injectable()
export class ChatGraphService {
  private workflow: any; // Type this better based on StateGraph return type
  private llm: ChatOpenAI;

  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService,
    // private readonly llm: ChatOpenAI,
    private readonly nutrientTool: GetNutrientAveragesTool,
    private readonly goalsTool: GetGoalsTool,
    private readonly strengthProgressTool: GetStrengthProgress,
    private readonly latestWorkoutTool: GetLatestWorkout
  ) {
    this.llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      streaming: true,
    });
    this.initializeGraph();
  }

  private async initializeGraph() {
    // Initialize model with tools
    const tools = [
      // this.nutrientTool.tool,
      this.goalsTool.tool,
      // this.strengthProgressTool.tool,
      // this.latestWorkoutTool.tool,
    ];

    const modelWithTools = this.llm.bindTools(tools);
    const toolNodeForGraph = new ToolNode(tools);

    const shouldContinue = (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1];
      if (
        "tool_calls" in lastMessage &&
        Array.isArray(lastMessage.tool_calls) &&
        lastMessage.tool_calls?.length
      ) {
        return "tools";
      }
      return END;
    };

    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const response = await modelWithTools.invoke(messages);
      return { messages: response };
    };

    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", callModel)
      .addNode("tools", toolNodeForGraph)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", shouldContinue, ["tools", END])
      .addEdge("tools", "agent");

    this.workflow = workflow.compile();
  }

  async generateResponse(
    userId: string,
    userFullName: string,
    userQuery: string
  ) {
    const systemPrompt = await fs.readFile("prompts/salusPrompt2.md", "utf8");

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userQuery),
    ];

    let config = {
      streamMode: "messages",
      configurable: {
        // thread_id: "1",
        userId: userId,
        userFullName: userFullName,
      },
    };

    return await this.workflow.stream({ messages }, config);
  }
}
