import React, { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Zap, TrendingUp } from 'lucide-react';
import { UserPersonality } from '@/types/chat';

interface PersonalitySelectionProps {
  onPersonalitySelect: (personality: UserPersonality) => void;
}

export default function PersonalitySelection({ onPersonalitySelect }: PersonalitySelectionProps) {
  const { 
    personalities, 
    loadPersonalities, 
    loadingPersonalities,
    selectedPersonality 
  } = useChatStore();

  useEffect(() => {
    loadPersonalities();
  }, [loadPersonalities]);

  // Debug log to see loaded personalities
  console.log('Loaded personalities:', personalities);

  const handleSelectPersonality = (personality: UserPersonality) => {
    onPersonalitySelect(personality);
  };

  const getPersonalityIcon = (personalityId: string) => {
    switch (personalityId) {
      case 'alice':
        return <TrendingUp className="w-6 h-6" />;
      case 'bob':
        return <Zap className="w-6 h-6" />;
      case 'charlie':
        return <User className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getPersonalityColor = (personalityId: string) => {
    switch (personalityId) {
      case 'alice':
        return '#3b82f6'; // Blue
      case 'bob':
        return '#059669'; // Green
      case 'charlie':
        return '#dc2626'; // Red
      default:
        return '#3b82f6'; // Default to blue
    }
  };

  if (loadingPersonalities) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading personalities...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Choose Your AI Assistant
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Select a specialized AI personality to guide you through Arbitrum blockchain analytics
          </p>
        </div>

        {/* Perfectly centered container for cards */}
        <div className="flex justify-center items-center w-full mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-5xl mx-auto">
            {personalities.map((personality) => (
              <div key={personality.id} className="flex justify-center">
                <Card
                  className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 w-full max-w-sm"
                  style={{
                    backgroundColor: "hsl(var(--crypto-card))",
                    borderColor: selectedPersonality?.id === personality.id 
                      ? getPersonalityColor(personality.id)
                      : "hsl(var(--crypto-border))",
                    minHeight: '520px'
                  }}
                  onClick={() => handleSelectPersonality(personality)}
                >
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-white">
                      <AvatarImage src={personality.avatar} alt={personality.name} />
                      <AvatarFallback style={{ backgroundColor: getPersonalityColor(personality.id) }}>
                        {personality.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: getPersonalityColor(personality.id) }}
                    >
                      {getPersonalityIcon(personality.id)}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white mb-2">
                    {personality.name}
                  </CardTitle>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: getPersonalityColor(personality.id) }}
                  >
                    {personality.title}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {personality.description}
                  </p>

                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">EXPERTISE</p>
                    <div className="flex flex-wrap gap-1">
                      {personality.expertise.slice(0, 3).map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${getPersonalityColor(personality.id)}20`,
                            color: getPersonalityColor(personality.id)
                          }}
                        >
                          {skill.replace('_', ' ')}
                        </Badge>
                      ))}
                      {personality.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs text-slate-400">
                          +{personality.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">FOCUS AREAS</p>
                    <p className="text-sm text-slate-300">{personality.focusAreas}</p>
                  </div>

                  <Button
                    className="w-full mt-6"
                    style={{
                      backgroundColor: getPersonalityColor(personality.id),
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = getPersonalityColor(personality.id);
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = getPersonalityColor(personality.id);
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Chat with {personality.name}
                  </Button>
                </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            You can switch personalities anytime during your conversation
          </p>
        </div>
      </div>
    </div>
  );
}
