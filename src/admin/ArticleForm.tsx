
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useArticleSubmit } from '@/hooks/useArticleSubmit';
import { useArticleData } from '@/hooks/useArticleData';
import AdminLayout from './AdminLayout';
import ArticleFormHeader from './components/FormSections/ArticleFormHeader';
import ArticleBasicInfo from './components/FormSections/ArticleBasicInfo';
import ArticleContent from './components/FormSections/ArticleContent';
import ArticleContentBlocks from './components/FormSections/ArticleContentBlocks';
import ArticleSeoImages from './components/FormSections/ArticleSeoImages';
import ArticlePublishSection from './components/FormSections/ArticlePublishSection';

const ArticleForm = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('content');
  const { isAdmin, verifyAdmin, refreshAdminSession } = useAdminAuth();
  
  const {
    form,
    isLoading,
    categories,
    contentBlocks,
    setContentBlocks
  } = useArticleData(id);
  
  const {
    handleSubmit,
    isSubmitting,
    saveError,
    setSaveError
  } = useArticleSubmit(contentBlocks, id);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshAdminSession();
        await verifyAdmin();
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    
    checkAuth();
  }, [verifyAdmin, refreshAdminSession]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading article data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ArticleFormHeader 
        id={id} 
        isAdmin={isAdmin} 
        saveError={saveError} 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ArticleBasicInfo form={form} categories={categories} />
            
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
              <TabsTrigger value="seo">SEO & Images</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <ArticleContent form={form} />
            </TabsContent>
            
            <TabsContent value="blocks" className="space-y-6">
              <ArticleContentBlocks 
                blocks={contentBlocks}
                onBlocksChange={setContentBlocks}
              />
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <ArticleSeoImages form={form} />
            </TabsContent>
          </Tabs>
            
          <ArticlePublishSection 
            form={form} 
            isSubmitting={isSubmitting} 
            id={id} 
          />
        </form>
      </Form>
    </AdminLayout>
  );
};

export default ArticleForm;
