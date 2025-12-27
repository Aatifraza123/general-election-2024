import { useState } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getAIAnswer } from '@/data/electionContext';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

// Format AI response with better structure
function formatAIResponse(content: string) {
  // Split by double newlines for paragraphs
  const sections = content.split(/\n\n+/);
  
  return sections.map((section, idx) => {
    const trimmed = section.trim();
    if (!trimmed) return null;
    
    // Check if it's a header (starts with === or ### or **)
    if (trimmed.startsWith('===') || trimmed.startsWith('###')) {
      const headerText = trimmed.replace(/^[=#]+\s*/, '').replace(/\s*[=#]+$/, '');
      return (
        <h4 key={idx} className="font-bold text-primary mt-3 mb-2 text-sm border-b border-border/50 pb-1">
          {headerText}
        </h4>
      );
    }
    
    // Check if it's a list (lines starting with - or •)
    const lines = trimmed.split('\n');
    const isList = lines.every(line => /^[-•*]\s/.test(line.trim()) || line.trim() === '');
    
    if (isList) {
      return (
        <ul key={idx} className="space-y-1.5 my-2">
          {lines.filter(l => l.trim()).map((line, lineIdx) => {
            const text = line.replace(/^[-•*]\s*/, '').trim();
            // Parse bold text within list items
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return (
              <li key={lineIdx} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1.5 text-xs">●</span>
                <span>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={pIdx}>{part}</span>;
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    // Check if it's a numbered list
    const isNumberedList = lines.every(line => /^\d+[\.\)]\s/.test(line.trim()) || line.trim() === '');
    
    if (isNumberedList) {
      return (
        <ol key={idx} className="space-y-1.5 my-2">
          {lines.filter(l => l.trim()).map((line, lineIdx) => {
            const text = line.replace(/^\d+[\.\)]\s*/, '').trim();
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return (
              <li key={lineIdx} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-semibold min-w-[1.5rem]">{lineIdx + 1}.</span>
                <span>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={pIdx}>{part}</span>;
                  })}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }
    
    // Regular paragraph - parse for bold text and line breaks
    const processedLines = lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={lineIdx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
    
    return (
      <p key={idx} className="text-sm leading-relaxed my-2">
        {processedLines}
      </p>
    );
  }).filter(Boolean);
}

const EXAMPLE_QUESTIONS = [
  "What was the highest victory margin in 2024?",
  "How many seats did BJP win?",
  "Compare BJP's 2024 performance with 2019",
  "Which states did Congress gain the most seats?",
  "What was SP's performance in Uttar Pradesh?",
  "Who won from Varanasi?",
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
      // Use Groq AI directly - no local fallback
      const aiResponse = await getAIAnswer(questionText.trim());
      const aiMessage: Message = { type: 'ai', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI error:', error);
      
      toast({
        title: "Error",
        description: "Could not get AI response. Please try again.",
        variant: "destructive",
      });

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `Sorry, I encountered an error. Please try asking your question again.`
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
          Ask questions about the 2024 Indian General Elections. 
          Get instant answers about party performance, victory margins, and state-wise results.
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
                  {message.type === 'ai' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {formatAIResponse(message.content)}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
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
          Powered by Gemini AI (with Groq fallback). Results based on 2024 election data.
        </p>
      </div>
    </div>
  );
}
