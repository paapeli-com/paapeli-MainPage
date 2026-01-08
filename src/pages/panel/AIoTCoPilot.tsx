import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic, Send, Plus, Bot, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasChart?: boolean;
  chartData?: unknown[];
}

const AIoTCoPilot = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Co-Pilot. I can help you analyze device data, generate reports, predict trends, and answer questions about your IoT infrastructure. How can I assist you today?',
      timestamp: '10:00 AM'
    }
  ]);

  const chatHistory = [
    { id: 1, title: 'Device Performance Analysis', date: 'Today, 9:30 AM' },
    { id: 2, title: 'Energy Usage Report', date: 'Yesterday, 4:15 PM' },
    { id: 3, title: 'Anomaly Investigation', date: 'Jan 14, 2:30 PM' },
  ];

  const sampleChartData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 42 },
    { time: '08:00', value: 58 },
    { time: '12:00', value: 72 },
    { time: '16:00', value: 51 },
    { time: '20:00', value: 47 },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    // Simulate AI response with chart
    const aiMessage: ChatMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Based on the analysis of your temperature sensors over the past 24 hours, I\'ve identified a significant spike between 08:00-14:00. Here\'s the visualization:',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      hasChart: true,
      chartData: sampleChartData
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput('');
  };

  return (
    <PanelLayout pageTitle="AI Co-Pilot">
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat History Sidebar */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chat History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b"
                >
                  <p className="font-medium text-sm line-clamp-1">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">{chat.date}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Co-Pilot</CardTitle>
                    <p className="text-sm text-muted-foreground">Powered by AI • Always learning</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  New Chat
                </Button>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.hasChart && message.chartData && (
                        <div className="mt-4 p-4 bg-background rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-foreground">Temperature Analysis - Last 24 Hours</p>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Dashboard
                            </Button>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={message.chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ask me anything about your IoT devices..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Show device performance
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Analyze energy usage
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Find anomalies
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Generate report
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
};

export default AIoTCoPilot;
