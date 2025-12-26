import { useState } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const EXAMPLE_QUESTIONS = [
  "Which party won the most seats in South India?",
  "Compare BJP's 2024 performance with 2019",
  "Who were the top candidates with highest victory margins?",
  "Which states did Congress gain the most seats?",
  "How did Rahul Gandhi and Modi perform in their constituencies?",
  "What was SP's performance in Uttar Pradesh?",
  "Explain the NDA vs INDIA bloc seat distribution",
  "Which parties gained and lost the most seats?",
];

export function AIQueryPanel() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (questionText: string = question) => {
    if (!questionText.trim() || isLoading) return;

    const userMessage: Message = { type: 'user', content: questionText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('election-query', {
        body: { question: questionText.trim() }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = { type: 'ai', content: data.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Query error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    handleSubmit(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 border-l-4 border-l-purple-500">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI Election Analyst
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Ask questions about the 2024 Indian General Elections in natural language. 
          Get insights about party performance, regional analysis, comparisons with 2019, and more.
        </p>
      </div>

      {/* Example Questions */}
      {messages.length === 0 && (
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Try asking:</h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(q)}
                className="filter-chip hover:bg-purple-500/10 hover:text-purple-500 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="chart-container max-h-[500px] overflow-y-auto scrollbar-thin">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 animate-slide-up",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
                style={{ animationDelay: '0ms' }}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
                <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                  <span className="text-sm text-muted-foreground">Analyzing election data...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="glass-card p-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="flex gap-3"
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about election results, party performance, regional trends..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Powered by AI. Results are based on 2024 election data.
        </p>
      </div>
    </div>
  );
}
