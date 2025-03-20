
import { Card } from '@/components/ui/card';
import ContentBlockManager, { ContentBlock } from '@/admin/components/ContentBlockManager';

interface ArticleContentBlocksProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
}

const ArticleContentBlocks = ({ blocks, onBlocksChange }: ArticleContentBlocksProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Content Blocks</h3>
        <p className="text-sm text-gray-500">
          Add rich content blocks to your article. These will appear after the main content.
        </p>
      </div>
      
      <ContentBlockManager 
        blocks={blocks}
        onBlocksChange={onBlocksChange}
      />
    </Card>
  );
};

export default ArticleContentBlocks;
