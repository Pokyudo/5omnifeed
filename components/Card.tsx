import React from 'react';
import { SocialPost } from '../types';
import { Twitter, Instagram, Linkedin, Globe, Heart, MessageCircle, Share2 } from 'lucide-react';

interface CardProps {
  post: SocialPost;
}

const PlatformIcon = ({ platform }: { platform: SocialPost['platform'] }) => {
  switch (platform) {
    case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
    case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
    case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />;
    case 'news': return <Globe className="w-5 h-5 text-green-500" />;
    default: return <Globe className="w-5 h-5 text-gray-400" />;
  }
};

export const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 select-none">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-3">
          <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-zinc-700" />
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{post.author}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">{post.handle} • {post.timestamp}</p>
          </div>
        </div>
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          <PlatformIcon platform={post.platform} />
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {post.imageUrl && (
          <div className="w-full h-64 sm:h-80 bg-zinc-200 dark:bg-zinc-800 relative mb-4">
            <img 
              src={post.imageUrl} 
              alt="Post Content" 
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}
        
        <div className="px-5 pb-4">
          <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center text-zinc-500 dark:text-zinc-400">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-1">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </div>
        </div>
        <Share2 className="w-5 h-5" />
      </div>
    </div>
  );
};
