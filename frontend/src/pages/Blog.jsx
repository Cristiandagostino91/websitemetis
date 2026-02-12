import React, { useState, useEffect } from 'react';
import { getBlogPosts } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts(true);
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare gli articoli.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Articoli, consigli e approfondimenti sul mondo della nutrizione
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </div>
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Dott.ssa Buoninfante</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center mt-auto"
                >
                  Leggi l'articolo completo
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;