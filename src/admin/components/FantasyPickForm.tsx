
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage } from '@/integrations/supabase/client';

type Match = {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  match_time: string;
};

type FantasyPickItem = {
  id?: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  match: string;
  match_id?: string;
  reason: string;
  points_prediction: number;
  image_url?: string;
  stats?: string;
  created_at?: string;
  updated_at?: string;
};

interface FantasyPickFormProps {
  initialData?: FantasyPickItem;
  onSave: (data: FantasyPickItem) => void;
  matches: Match[];
}

const ROLES = [
  'Batsman',
  'Bowler',
  'All-Rounder',
  'WK-Batsman',
  'Captain'
];

const FORM_OPTIONS = [
  'Excellent',
  'Good',
  'Average',
  'Poor'
];

const FantasyPickForm: React.FC<FantasyPickFormProps> = ({
  initialData,
  onSave,
  matches
}) => {
  const [formData, setFormData] = useState<FantasyPickItem>({
    id: initialData?.id || '',
    player_name: initialData?.player_name || '',
    team: initialData?.team || '',
    role: initialData?.role || '',
    form: initialData?.form || 'Good',
    match: initialData?.match || '',
    match_id: initialData?.match_id || '',
    reason: initialData?.reason || '',
    points_prediction: initialData?.points_prediction || 80,
    image_url: initialData?.image_url || '',
    stats: initialData?.stats || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // If a match is selected, update the match string in formData
    if (selectedMatch) {
      setFormData(prev => ({
        ...prev,
        match: `${selectedMatch.team1} vs ${selectedMatch.team2}`,
        match_id: selectedMatch.id
      }));
    }
  }, [selectedMatch]);

  useEffect(() => {
    // Find the match from the initialData match string if available
    if (initialData?.match && matches.length > 0) {
      const matchString = initialData.match;
      const foundMatch = matches.find(m => 
        `${m.team1} vs ${m.team2}` === matchString
      );
      
      if (foundMatch) {
        setSelectedMatch(foundMatch);
      }
    }
  }, [initialData, matches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user makes changes
    setValidationError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user makes changes
    setValidationError(null);
  };

  const handleMatchSelect = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      setValidationError(null);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    console.log("Image URL received:", imageUrl);
    setFormData({ ...formData, image_url: imageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError(null);

    try {
      // Basic validation
      if (!formData.player_name || !formData.team || !formData.match) {
        throw new Error('Please fill all required fields');
      }

      // Format stats from separate inputs if provided
      if (!formData.stats && formData.role) {
        const statsPlaceholder = formData.role === 'Batsman' || formData.role === 'WK-Batsman'
          ? 'Recent scores not available'
          : formData.role === 'Bowler'
            ? 'Recent bowling figures not available'
            : 'Recent all-round performances not available';
        
        setFormData(prev => ({
          ...prev,
          stats: statsPlaceholder
        }));
      }

      console.log("Submitting fantasy pick with data:", formData);
      await onSave(formData);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setValidationError(error.message || 'Failed to save fantasy pick');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save fantasy pick',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="player_name">Player Name *</Label>
            <Input
              id="player_name"
              name="player_name"
              value={formData.player_name}
              onChange={handleInputChange}
              placeholder="Virat Kohli"
              required
            />
          </div>

          <div>
            <Label htmlFor="team">Team *</Label>
            <Input
              id="team"
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              placeholder="Royal Challengers Bangalore"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select player role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="form">Form *</Label>
            <Select
              value={formData.form}
              onValueChange={(value) => handleSelectChange('form', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select current form" />
              </SelectTrigger>
              <SelectContent>
                {FORM_OPTIONS.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="match">Match *</Label>
            <Select 
              value={selectedMatch?.id || ''} 
              onValueChange={handleMatchSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select match" />
              </SelectTrigger>
              <SelectContent>
                {matches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.team1} vs {match.team2} ({new Date(match.match_time).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="points_prediction">Points Prediction *</Label>
            <Input
              id="points_prediction"
              name="points_prediction"
              type="number"
              min="0"
              max="200"
              value={formData.points_prediction}
              onChange={(e) => setFormData({...formData, points_prediction: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="stats">Recent Performance Stats</Label>
            <Input
              id="stats"
              name="stats"
              value={formData.stats}
              onChange={handleInputChange}
              placeholder="92(48), 77(49), 104(63)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter recent match performances, e.g., for batsmen: "92(48), 77(49)", for bowlers: "3/24, 2/18, 4/29"
            </p>
          </div>

          <div>
            <Label htmlFor="reason">Selection Reason *</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why this player is a good fantasy pick for this match"
              className="min-h-[120px]"
              required
            />
          </div>

          <ImageUploader
            onImageUploaded={handleImageUploaded}
            existingImageUrl={formData.image_url}
            label="Player Image"
          />
        </div>
      </div>

      <Separator />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Saving...
            </>
          ) : initialData?.id ? (
            'Update Fantasy Pick'
          ) : (
            'Create Fantasy Pick'
          )}
        </Button>
      </div>
    </form>
  );
};

export default FantasyPickForm;
