
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-cricket-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Never Miss A Story</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter to receive daily cricket news updates directly in your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button className="bg-cricket-accent hover:bg-cricket-accent/90">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
