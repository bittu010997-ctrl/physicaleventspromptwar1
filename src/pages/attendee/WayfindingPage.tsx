import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Bot, User, Mic, Navigation2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService } from '../../lib/firebase';
import { DynamicNavigationCard } from '../../components/attendee/DynamicNavigationCard';
import type { RouteGoal } from '../../components/attendee/DynamicNavigationCard';

const MOCK_UID = 'user-1';

type ChatOption = {
  label: string;
  goalParams: RouteGoal;
};

type ChatMessage = {
  id: number;
  role: 'ai' | 'user';
  text: string;
  options?: ChatOption[];
};

const WayfindingPage: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeGoal, setActiveGoal] = useState<RouteGoal | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    "How do I get to my seat?",
    "Nearest open restroom?",
    "Shortest food queue?"
  ];

  useEffect(() => {
    const loadData = async () => {
      const history = await chatService.loadHistory(MOCK_UID);
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        const welcome: ChatMessage = { id: 1, role: 'ai', text: 'Hi! I am your StadiumIQ assistant. Need help finding your seat, the nearest restroom, or food?' };
        setMessages([welcome]);
        await chatService.appendMessage(MOCK_UID, welcome);
      }
    };
    loadData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processLocalQuery = async (query: string) => {
    const lower = query.toLowerCase();
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (lower.includes('restroom')) {
      return {
        text: "Here are the closest restrooms based on line wait times and walking distance. Which would you prefer?",
        options: [
          {
            label: "Restroom A (2 min walk, 15 min wait)",
            goalParams: { type: 'restroom', name: 'Restroom A', lat: 34.0416, lng: -118.2661, crowdWaitMins: 15, walkTimeMins: 2, reason: 'Closest physical distance.' }
          },
          {
            label: "Restroom B (4 min walk, 0 min wait) ✨ Optimal",
            goalParams: { type: 'restroom', name: 'Restroom B', lat: 34.0420, lng: -118.2655, crowdWaitMins: 0, walkTimeMins: 4, reason: 'Chosen to avoid 15 min wait at Restroom A, walking 2 mins further for zero queue.' }
          }
        ]
      };
    }

    if (lower.includes('food')) {
      return {
        text: "I found two food courts nearby. One has a much shorter line:",
        options: [
          {
            label: "Main Concourse Food (1 min walk, 25 min wait)",
            goalParams: { type: 'food', name: 'Main Concourse Food', lat: 34.0412, lng: -118.2665, crowdWaitMins: 25, walkTimeMins: 1, reason: 'Extremely high wait time during intermission.' }
          },
          {
            label: "Upper Level Grill (5 min walk, 2 min wait) ✨ Optimal",
            goalParams: { type: 'food', name: 'Upper Level Grill', lat: 34.0425, lng: -118.2670, crowdWaitMins: 2, walkTimeMins: 5, reason: 'Chosen to save you 20 mins overall by sacrificing a few minutes of walking.' }
          }
        ]
      };
    }

    if (lower.includes('seat')) {
      setActiveGoal({ type: 'seat', name: 'Your Seat', lat: 34.0415, lng: -118.2660, crowdWaitMins: 0, walkTimeMins: 0 });
      return { text: "I'm pulling up the fastest route to your seat now!" };
    }

    return { text: "I'm your intelligent guide. I can find the optimal path to restrooms, food, or your seat while actively avoiding crowd bottlenecks! What are you looking for?" };
  };

  const sendMessageToBackend = async (userText: string) => {
    setActiveGoal(null); // hide map on new query
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await chatService.appendMessage(MOCK_UID, userMsg);

    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', text: 'Typing...' }]);

    // Determine mock response
    const responseData = await processLocalQuery(userText);

    const finalAiMsg: ChatMessage = {
      id: aiMessageId,
      role: 'ai',
      text: responseData.text,
      options: responseData.options as ChatOption[] | undefined
    };

    setMessages(prev => prev.map(m => m.id === aiMessageId ? finalAiMsg : m));
    setIsTyping(false);
    await chatService.appendMessage(MOCK_UID, finalAiMsg);
  };

  useEffect(() => {
    if (location.state?.autoShowSeatNav && messages.length > 0) {
      const seatLocatorStr = location.state.seatLocation || 'your seat';
      setActiveGoal({ type: 'seat', name: `Seat: ${seatLocatorStr}`, lat: 34.0415, lng: -118.2660, crowdWaitMins: 0, walkTimeMins: 0 });
      sendMessageToBackend(`I just scanned my ticket for ${seatLocatorStr}. Please route me there.`);
      window.history.replaceState({}, document.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessageToBackend(input);
  };

  const handleOptionSelect = (opt: ChatOption) => {
    if (isTyping) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: `I selected: ${opt.label}` }]);
    setTimeout(() => {
      setActiveGoal(opt.goalParams);
      scrollToBottom();
    }, 500);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg, index) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', gap: '1rem',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div style={{ 
              width: 36, height: 36, borderRadius: '50%', 
              backgroundColor: msg.role === 'ai' ? 'var(--accent-glow)' : 'var(--glass-bg)',
              border: `1px solid ${msg.role === 'ai' ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {msg.role === 'ai' ? <Bot size={20} color="var(--accent-primary)" /> : <User size={20} color="var(--text-secondary)" />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className="glass-panel" style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)',
                borderTopLeftRadius: msg.role === 'ai' ? 0 : 'var(--radius-md)',
                borderTopRightRadius: msg.role === 'user' ? 0 : 'var(--radius-md)',
                maxWidth: '85%',
                backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--glass-bg)'
              }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </p>
              </div>

              {msg.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', width: '100%' }}>
                  {msg.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      style={{
                        padding: '0.75rem 1rem', 
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--accent-primary)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    >
                      <Navigation2 size={16} color="var(--accent-primary)" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        <AnimatePresence>
          {activeGoal && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <DynamicNavigationCard uid={MOCK_UID} goal={activeGoal} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Chips */}
      <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-primary)' }}>
        {promptChips.map(chip => (
          <button 
            key={chip}
            onClick={() => !isTyping && sendMessageToBackend(chip)}
            disabled={isTyping}
            style={{ 
              whiteSpace: 'nowrap', padding: '0.5rem 1rem', 
              borderRadius: 'var(--radius-full)', backgroundColor: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
              fontSize: '0.85rem', cursor: isTyping ? 'not-allowed' : 'pointer'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" disabled={isTyping} style={{ 
            width: 48, height: 48, borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
          }}>
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask anything (e.g. 'nearest restroom')..." 
            style={{ 
              flex: 1, padding: '0 1rem', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)', outline: 'none'
            }}
          />
          <button type="submit" disabled={isTyping} style={{ 
            width: 48, height: 48, borderRadius: 'var(--radius-md)', 
            backgroundColor: isTyping ? 'var(--text-muted)' : 'var(--accent-primary)', 
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WayfindingPage;
