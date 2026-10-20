import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Hash, 
  User as UserIcon, 
  IndianRupee, 
  ArrowRight,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    activeChannelId, 
    activeDirectUserId, 
    channels, 
    users, 
    chatMessages, 
    sendChatMessage, 
    setCurrentView,
    pendingCount,
    currentBalance
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current channel or direct recipient
  const currentChannel = channels.find((c) => c.id === activeChannelId);
  const directRecipient = users.find((u) => u.id === activeDirectUserId);

  // Filter messages for current channel or DM
  const currentMessages = chatMessages.filter((msg) => {
    if (activeDirectUserId) {
      return (
        (msg.senderId === currentUser.id && msg.recipientId === activeDirectUserId) ||
        (msg.senderId === activeDirectUserId && msg.recipientId === currentUser.id)
      );
    }
    return msg.channelId === activeChannelId;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          {activeDirectUserId ? (
            <div className="flex items-center gap-2.5">
              <img
                src={directRecipient?.avatar}
                alt={directRecipient?.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  {directRecipient?.name}
                  <span className="text-[10px] text-slate-500 font-medium capitalize bg-slate-100 px-1.5 py-0.5 rounded">
                    {directRecipient?.role.replace('_', ' ')}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">{directRecipient?.title}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  #{currentChannel?.name}
                </h2>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {currentChannel?.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Finance Work button if in finance-work channel or general */}
        {activeChannelId === 'finance-work' && (
          <button
            onClick={() => setCurrentView('finance')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Open Finance Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Finance pinned banner in finance-work channel */}
      {activeChannelId === 'finance-work' && (
        <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/90 px-5 py-2.5 border-b border-indigo-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-900">
            <span className="font-semibold flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
              Finance Summary:
            </span>
            <span className="text-slate-600">
              Current Balance: <strong className="text-slate-900">{formatINR(currentBalance)}</strong>
            </span>
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingCount} Pending Approvals
              </span>
            )}
          </div>
          <button
            onClick={() => setCurrentView('finance')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Manage Entries &rarr;
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {currentMessages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <p className="font-semibold text-slate-600">No messages here yet.</p>
            <p className="mt-1">Be the first to start the conversation in #{currentChannel?.name || 'this direct chat'}!</p>
          </div>
        ) : (
          currentMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const isFinanceBot = msg.content.startsWith('📋') || msg.content.startsWith('✅') || msg.content.startsWith('🎉') || msg.content.startsWith('⚠️');

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 text-xs ${isFinanceBot ? 'bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/70' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">
                      {msg.senderRole.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">· {msg.timestamp}</span>
                  </div>
                  <div className="text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-3.5 sm:p-4 border-t border-slate-200/80 bg-white shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${activeDirectUserId ? directRecipient?.name : '#' + currentChannel?.name}...`}
            className="w-full pl-4 pr-24 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Tip: Submit expenses from Finance Work to keep team records in sync.</span>
          <span>Role: <strong className="text-slate-600 capitalize">{currentUser.role.replace('_', ' ')}</strong></span>
        </div>
      </div>
    </div>
  );
};
