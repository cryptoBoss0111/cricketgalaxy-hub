
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  LayoutGrid,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Youtube,
  GripVertical,
  Plus,
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import VideoEmbedder from './VideoEmbedder';

export type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'video' | 'heading';
  content: string;
  metadata?: Record<string, any>;
};

interface ContentBlockManagerProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
}

const ContentBlockManager: React.FC<ContentBlockManagerProps> = ({ blocks, onBlocksChange }) => {
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

  const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type,
      content: '',
      metadata: {}
    };
    
    const newBlocks = [...blocks, newBlock];
    onBlocksChange(newBlocks);
    setActiveBlockIndex(newBlocks.length - 1);
  };

  const updateBlockContent = (index: number, content: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { ...updatedBlocks[index], content };
    onBlocksChange(updatedBlocks);
  };

  const updateBlockMetadata = (index: number, metadata: Record<string, any>) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { 
      ...updatedBlocks[index], 
      metadata: { ...updatedBlocks[index].metadata, ...metadata } 
    };
    onBlocksChange(updatedBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onBlocksChange(newBlocks);
    setActiveBlockIndex(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    
    onBlocksChange(newBlocks);
    setActiveBlockIndex(newIndex);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <Card 
            key={block.id}
            className={`border p-4 ${activeBlockIndex === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActiveBlockIndex(index)}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 flex flex-col items-center gap-1 p-1">
                <GripVertical className="h-4 w-4 text-gray-400" />
                {block.type === 'text' && <AlignLeft className="h-4 w-4 text-gray-400" />}
                {block.type === 'heading' && <Type className="h-4 w-4 text-gray-400" />}
                {block.type === 'image' && <ImageIcon className="h-4 w-4 text-gray-400" />}
                {block.type === 'video' && <Youtube className="h-4 w-4 text-gray-400" />}
              </div>
              
              <div className="flex-grow space-y-3">
                {block.type === 'text' && (
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlockContent(index, e.target.value)}
                    placeholder="Enter text content here..."
                    className="min-h-[150px]"
                  />
                )}
                
                {block.type === 'heading' && (
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlockContent(index, e.target.value)}
                    placeholder="Enter heading text here..."
                    className="text-xl font-bold min-h-[60px]"
                  />
                )}
                
                {block.type === 'image' && (
                  <ImageUploader
                    existingImageUrl={block.content}
                    onImageUploaded={(imageUrl) => updateBlockContent(index, imageUrl)}
                    label="Block Image"
                  />
                )}
                
                {block.type === 'video' && (
                  <VideoEmbedder
                    existingVideoUrl={block.content}
                    onVideoUrlAdded={(videoUrl, videoType) => {
                      updateBlockContent(index, videoUrl);
                      updateBlockMetadata(index, { videoType });
                    }}
                  />
                )}
              </div>
              
              <div className="flex-shrink-0 flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeBlock(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="border border-dashed p-4">
        <p className="text-sm text-gray-500 mb-3">Add Content Block</p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => addBlock('heading')}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            <span>Heading</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addBlock('text')}
            className="flex items-center gap-2"
          >
            <AlignLeft className="h-4 w-4" />
            <span>Text</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addBlock('image')}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addBlock('video')}
            className="flex items-center gap-2"
          >
            <Youtube className="h-4 w-4" />
            <span>Video</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContentBlockManager;
