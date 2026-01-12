import React, { useState, useEffect, useCallback } from 'react';
import { generateMockFeed } from './services/geminiService';
import { SocialPost, InteractionType } from './types';
import { GestureController } from './components/GestureController';
import { Legend } from './components/Legend';
import { Sparkles, Loader2, RefreshCw, Star } from 'lucide-react';

const App: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<SocialPost[]>([]);
  const [interactionHistory, setInteractionHistory] = useState<{postId: string, type: InteractionType}[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Initialize Feed
  const loadFeed = useCallback(async () => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const newPosts = await generateMockFeed();
      setPosts(prev => [...prev, ...newPosts]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleInteraction = (type: InteractionType) => {
    const currentPost = posts[currentIndex];
    
    // Log interaction
    setInteractionHistory(prev => [...prev, { postId: currentPost.id, type }]);

    // Handle Favorites
    if (type === 'save') {
      setFavorites(prev => [...prev, currentPost]);
      // Small vibration for feedback
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } else {
      // Haptic feedback for swipes
      if (navigator.vibrate) navigator.vibrate(20);
    }

    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      
      // Load more if getting close to end
      if (currentIndex > posts.length - 3 && !loading) {
        loadFeed();
      }
    }, 200); // Slight delay to allow swipe animation to clear visual space
  };

  const handleReset = () => {
      setCurrentIndex(0);
      setPosts([]);
      setInteractionHistory([]);
      loadFeed();
  }

  if (apiKeyMissing) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
           <div className="max-w-md text-center space-y-4">
              <h1 className="text-2xl font-bold text-red-500">API Key Missing</h1>
              <p>Please provide a valid Gemini API Key in the environment variables to use OmniFeed AI.</p>
           </div>
        </div>
     )
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-sans selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between z-50 bg-zinc-950/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">OmniFeed AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
           <button 
            onClick={() => setShowFavorites(!showFavorites)}
            className={`p-2 rounded-full transition-all ${showFavorites ? 'bg-yellow-500/20 text-yellow-500' : 'hover:bg-zinc-800 text-zinc-400'}`}
          >
            <Star className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-lg mx-auto p-4 h-[calc(100vh-80px)]">
        
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center space-y-4 text-zinc-500 animate-pulse">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p>Curating your feed using Gemini...</p>
          </div>
        ) : showFavorites ? (
           <div className="w-full h-full overflow-y-auto space-y-4 pb-20 no-scrollbar">
             <h2 className="text-xl font-bold mb-4 px-2">Saved Posts ({favorites.length})</h2>
             {favorites.length === 0 ? (
               <div className="text-center text-zinc-500 mt-20">No saved posts yet. Draw a circle to save!</div>
             ) : (
                favorites.map(post => (
                  <div key={post.id} className="scale-90 origin-top">
                     <div className="pointer-events-none">
                      {/* Reuse card logic but static */}
                        <div className="w-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                           <div className="p-4 flex items-center gap-3">
                              <img src={post.avatarUrl} className="w-8 h-8 rounded-full"/>
                              <div className="text-sm font-bold">{post.author}</div>
                           </div>
                           {post.imageUrl && <img src={post.imageUrl} className="w-full h-48 object-cover"/>}
                           <div className="p-4 text-sm text-zinc-300">{post.content}</div>
                        </div>
                     </div>
                  </div>
                ))
             )}
           </div>
        ) : (
          <div className="relative w-full aspect-[3/5] max-h-[700px]">
            {/* Render stack of cards. Only render current and next one for performance */}
            {posts.slice(currentIndex, currentIndex + 2).reverse().map((post, index) => {
              // The logic here is tricky because we reversed the slice.
              // If slice is [Current, Next], reverse makes it [Next, Current].
              // So the last element in the map is the Current one (Top).
              const isTop = index === 1 || (posts.slice(currentIndex, currentIndex + 2).length === 1 && index === 0);
              
              return (
                <GestureController 
                  key={post.id} 
                  post={post} 
                  onInteraction={handleInteraction}
                  isTop={isTop}
                />
              );
            })}
            
            {currentIndex >= posts.length && !loading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                  <p className="mb-4">You're all caught up!</p>
                  <button onClick={loadFeed} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors">
                    Load More
                  </button>
               </div>
            )}
          </div>
        )}

      </main>

      <Legend />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950"></div>
    </div>
  );
};

export default App;
