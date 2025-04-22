import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
  messagesStateReducer,
  CompiledStateGraph,
  LangGraphRunnableConfig,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { DynamicTool, StructuredTool, tool, Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { GetGoalsTool } from "../tools/getGoals.tool";
import { GetLatestWorkout } from "../tools/getLatestWorkout.tool";
import { GetStrengthProgress } from "../tools/getStrengthProgress.tool";
import { GetNutrientAveragesTool } from "../tools/getNutritientAverages.tool";
import { Injectable } from "@nestjs/common";
import { AiService } from "../ai.service";
import { EntityManager } from "@mikro-orm/postgresql";
import {
  SystemMessage,
  HumanMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { promises as fs } from "fs";
import { AnswerQuestionTool } from "../tools/answerQuestion.tool";

@Injectable()
export class ChatGraphService {
  private workflow: any; // Type this better based on StateGraph return type
  private toolCallerLlm: ChatOpenAI;
  private chatLlm: ChatOpenAI;
  private tools: (StructuredTool | DynamicTool)[];

  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService,
    // private readonly llm: ChatOpenAI,
    private readonly nutrientTool: GetNutrientAveragesTool,
    private readonly goalsTool: GetGoalsTool,
    private readonly strengthProgressTool: GetStrengthProgress,
    private readonly latestWorkoutTool: GetLatestWorkout,
    private readonly answerQuestionTool: AnswerQuestionTool
  ) {
    this.toolCallerLlm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
      streaming: false,
    });
    this.chatLlm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      streaming: true,
    });
    this.tools = [
      this.nutrientTool.tool,
      this.goalsTool.tool,
      this.strengthProgressTool.tool,
      this.latestWorkoutTool.tool,
      this.answerQuestionTool.tool,
    ];
    this.initializeGraph();
  }

  private async initializeGraph() {
    // Initialize model with tools

    const toolCaller = async (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const inputMessages = [
        new SystemMessage(
          await fs.readFile("prompts/toolCallerPrompt.md", "utf8")
        ),
        ...messages,
      ];
      const modelWithTools = this.toolCallerLlm.bindTools(this.tools);
      const response = await modelWithTools.invoke(inputMessages);
      // console.log("TEST MESSAGE ", response);

      if (
        "tool_calls" in response &&
        Array.isArray(response.tool_calls) &&
        response.tool_calls?.length
      ) {
        // console.log(response);
        return { messages: [response] };
      } else {
        return {};
      }
    };

    const routeTools = (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1];
      if (
        "tool_calls" in lastMessage &&
        Array.isArray(lastMessage.tool_calls) &&
        lastMessage.tool_calls?.length
      ) {
        return "toolExecutor";
      }
      return "chat";
    };

    const toolExecutor = new ToolNode(this.tools);

    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;

      const inputMessages = [
        new SystemMessage(await fs.readFile("prompts/salusPrompt2.md", "utf8")),
        ...messages,
      ];
      const response = await this.chatLlm.invoke(inputMessages);

      return { messages: [response] };
    };

    const workflow = new StateGraph(MessagesAnnotation)
      // .addNode("agent", callModel)
      // .addNode("tools", toolNodeForGraph)
      // .addEdge(START, "agent")
      // .addConditionalEdges("agent", shouldContinue, ["tools", END])
      // .addEdge("tools", "agent");
      .addNode("toolCaller", toolCaller)
      .addNode("toolExecutor", toolExecutor)
      .addNode("chat", callModel)
      .addEdge(START, "toolCaller")
      .addConditionalEdges("toolCaller", routeTools, ["toolExecutor", "chat"])
      .addEdge("toolExecutor", "chat")
      .addEdge("chat", END);

    this.workflow = workflow.compile();
  }

  async generateResponse(
    userId: string,
    userFullName: string,
    messages: BaseMessage[]
  ) {
    // const systemPrompt = await fs.readFile("prompts/salusPrompt2.md", "utf8");

    let config = {
      streamMode: ["messages", "updates"],
      // streamMode: "messages",
      stream_options: {
        include_usage: true,
      },
      configurable: {
        // thread_id: "1",
        userId: userId,
        userFullName: userFullName,
      },
    };

    return await this.workflow.stream({ messages }, config);
  }
}
