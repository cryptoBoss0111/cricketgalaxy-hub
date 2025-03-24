import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import { getArticleById } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import ArticleCard from '@/components/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
];

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string>(FALLBACK_IMAGES[0]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const articleData = await getArticleById(id);
        
        if (articleData) {
          setArticle(articleData);
          console.log("Article data:", articleData);
          
          if (articleData.cover_image) {
            setMainImage(articleData.cover_image);
            setImageLoading(true);
            setImageFailed(false);
          }
          
          const { getArticlesByCategory } = await import('@/integrations/supabase/client');
          const relatedData = await getArticlesByCategory(articleData.category);
          
          const filtered = relatedData
            .filter(relatedArticle => relatedArticle.id !== id)
            .slice(0, 3);
            
          setRelatedArticles(filtered);
        } else {
          toast({
            title: "Article not found",
            description: "The article you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error loading article",
          description: "There was a problem loading this article. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
    
    window.scrollTo(0, 0);
  }, [id, toast]);
  
  const handleImageError = () => {
    console.error(`Image load failed: ${mainImage}`);
    setImageFailed(true);
    
    const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    if (mainImage !== randomFallback) {
      setMainImage(randomFallback);
      setImageLoading(true);
    } else {
      setImageLoading(false);
    }
  };
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${mainImage}`);
    setImageLoading(false);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateReadTime = (content: string) => {
    if (!content) return '1 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };
  
  if (loading) {
    return (
      <>
        <LiveMatchesBar />
        <Navbar />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-64 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!article) {
    return (
      <>
        <LiveMatchesBar />
        <Navbar />
        <main className="min-h-screen py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/cricket-news">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <LiveMatchesBar />
      <Navbar />
      <main>
        <section className="py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                to={`/${article.category.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`} 
                className="inline-flex items-center text-cricket-accent hover:underline mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to {article.category}
              </Link>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-6">
                <span className="flex items-center">
                  <User className="mr-1 h-4 w-4" /> CricketExpress Staff
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" /> {formatDate(article.published_at || article.created_at)}
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> {calculateReadTime(article.content)}
                </span>
                <Badge variant="outline" className="bg-gray-100">
                  {article.category}
                </Badge>
              </div>
              
              {article.excerpt && (
                <p className="text-lg text-gray-700 font-medium mb-6">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-lg relative">
                {imageLoading && (
                  <Skeleton className="w-full h-[400px] object-cover absolute inset-0" />
                )}
                <img 
                  src={mainImage}
                  alt={article.title}
                  className="w-full h-auto max-h-[600px] object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ opacity: imageLoading ? 0 : 1 }}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.trim().length === 0) return null;
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
              
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t">
                  <span className="text-sm font-medium flex items-center">
                    <Tag className="mr-2 h-4 w-4" /> Tags:
                  </span>
                  {article.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        
        {relatedArticles.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-heading font-bold mb-8 text-center">
                More {article.category} Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map(relatedArticle => (
                  <ArticleCard
                    key={relatedArticle.id}
                    id={relatedArticle.id}
                    title={relatedArticle.title}
                    excerpt={relatedArticle.excerpt || relatedArticle.meta_description || ''}
                    imageUrl={relatedArticle.featured_image || relatedArticle.cover_image || FALLBACK_IMAGES[0]}
                    category={relatedArticle.category}
                    author="CricketExpress Staff"
                    date={formatDate(relatedArticle.published_at || relatedArticle.created_at)}
                    timeToRead={calculateReadTime(relatedArticle.content)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default ArticleDetail;
