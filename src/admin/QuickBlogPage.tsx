
import React from 'react';
import AdminLayout from '@/admin/AdminLayout';
import BlogUploader from '@/components/admin/BlogUploader';

const QuickBlogPage = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6">Quick Blog Post</h1>
        <p className="text-gray-500 mb-6">
          Use this form to quickly create and publish blog posts to various sections of the site.
        </p>
        
        <BlogUploader />
      </div>
    </AdminLayout>
  );
};

export default QuickBlogPage;
