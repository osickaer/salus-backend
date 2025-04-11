import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";

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

  const tools = [
    nutrientTool.tool,
    goalsTool.tool,
    strengthProgressTool.tool,
    latestWorkoutTool.tool,
  ];

  const llmWithTools = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    streaming: true,
  }).bindTools(tools);
  const response = await modelWithTools.invoke(messages);
  return { messages: response };
};

export function createChatGraph(modelWithTools: BaseChatModel, tools: Tool[]) {
  const toolNodeForGraph = new ToolNode(tools);

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNodeForGraph)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent");

  return workflow.compile();
}
