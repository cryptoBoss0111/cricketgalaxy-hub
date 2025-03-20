
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Youtube, Video } from 'lucide-react';

interface VideoEmbedderProps {
  onVideoUrlAdded: (videoUrl: string, videoType: 'youtube' | 'vimeo' | 'other') => void;
  existingVideoUrl?: string;
}

const VideoEmbedder = ({ onVideoUrlAdded, existingVideoUrl = '' }: VideoEmbedderProps) => {
  const [videoUrl, setVideoUrl] = useState(existingVideoUrl);
  const [isAdding, setIsAdding] = useState(false);
  
  const detectVideoType = (url: string): 'youtube' | 'vimeo' | 'other' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else {
      return 'other';
    }
  };
  
  const handleAddVideo = () => {
    if (!videoUrl) return;
    
    const videoType = detectVideoType(videoUrl);
    onVideoUrlAdded(videoUrl, videoType);
    
    if (!existingVideoUrl) {
      setVideoUrl('');
      setIsAdding(false);
    }
  };

  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderVideoPreview = () => {
    if (!videoUrl) return null;
    
    const videoType = detectVideoType(videoUrl);
    
    if (videoType === 'youtube') {
      const videoId = extractYoutubeVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="relative pb-[56.25%] h-0">
            <iframe 
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    // Default preview for other video types
    return (
      <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center text-gray-500">
        <Video className="mr-2 h-5 w-5" />
        <span>Video Preview Not Available</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {isAdding || videoUrl ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button onClick={handleAddVideo} disabled={!videoUrl}>
              {existingVideoUrl ? 'Update' : 'Add'} Video
            </Button>
          </div>
          
          {videoUrl && renderVideoPreview()}
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setIsAdding(true)}
          className="w-full py-8 flex flex-col gap-2"
        >
          <Youtube className="h-6 w-6" />
          <span>Add Video Embed</span>
        </Button>
      )}
    </div>
  );
};

export default VideoEmbedder;
