import { GoogleGenAI, Type } from "@google/genai";
import { SocialPost } from "../types";

// Helper to get the API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMockFeed = async (interests: string[] = ['Tech', 'Design', 'AI', 'Startups']): Promise<SocialPost[]> => {
  // const ai = getAiClient();
  
  // const prompt = `
  //   Generate 5 distinct social media posts for a user interested in: ${interests.join(', ')}.
  //   Vary the platforms (twitter, instagram, linkedin, news).
  //   The content should be in Spanish or English (mixed is fine).
  //   Ensure distinct styles:
  //   - Twitter: short, hashtag heavy.
  //   - Linkedin: professional, slightly longer.
  //   - Instagram: visual focused description.
    
  //   Return a JSON array.
  // `;

  // try {
  //   const response = await ai.models.generateContent({
  //     model: 'gemini-3-flash-preview',
  //     contents: prompt,
  //     config: {
  //       responseMimeType: "application/json",
  //       responseSchema: {
  //         type: Type.ARRAY,
  //         items: {
  //           type: Type.OBJECT,
  //           properties: {
  //             id: { type: Type.STRING },
  //             platform: { type: Type.STRING, enum: ['twitter', 'instagram', 'linkedin', 'news'] },
  //             author: { type: Type.STRING },
  //             handle: { type: Type.STRING },
  //             content: { type: Type.STRING },
  //             imageUrl: { type: Type.STRING }, // Just a description for now, we will map to picsum
  //             timestamp: { type: Type.STRING },
  //             likes: { type: Type.INTEGER },
  //             comments: { type: Type.INTEGER },
  //             tags: { type: Type.ARRAY, items: { type: Type.STRING } }
  //           }
  //         }
  //       }
  //     }
  //   });

  //   const data = JSON.parse(response.text || '[]');
    
  //   // Enrich with placeholder images and avatars
  //   return data.map((post: any, index: number) => ({
  //     ...post,
  //     id: post.id || `post-${Date.now()}-${index}`,
  //     avatarUrl: `https://picsum.photos/seed/${post.handle}/100/100`,
  //     imageUrl: post.platform === 'instagram' || post.platform === 'news'
  //       ? `https://picsum.photos/seed/${post.id}/600/800`
  //       : undefined
  //   }));

  // } catch (error) {
  //   console.error("Error generating feed:", error);
    // Fallback data if API fails
    return [
      {
        id: '1',
        platform: 'twitter',
        author: 'Elon Musk Parody',
        handle: '@elon_fake',
        avatarUrl: 'https://picsum.photos/seed/elon/100/100',
        content: 'La IA va a cambiar todo. ¿Están listos? 🚀 #AI #Future',
        timestamp: '2h',
        likes: 1200,
        comments: 300,
        tags: ['Tech', 'AI']
      },
      {
        id: '2',
        platform: 'instagram',
        author: 'Photography Daily',
        handle: '@photo_daily',
        avatarUrl: 'https://picsum.photos/seed/photo/100/100',
        content: 'Golden hour in Paris. Nothing beats this view. 📸✨',
        imageUrl: 'https://picsum.photos/seed/paris/600/800',
        timestamp: '5h',
        likes: 4500,
        comments: 120,
        tags: ['Travel', 'Art']
      }
    ];
  // }
};

export const analyzeUserPreferences = async (history: { postId: string; interaction: string }[]) => {
  // This would be used to refine the next batch of posts
  // Placeholder for future implementation
  console.log("Analyzing history:", history);
};
