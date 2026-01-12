import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { Card } from './Card';
import { SocialPost, InteractionType } from '../types';
import { Check, X, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface GestureControllerProps {
  post: SocialPost;
  onInteraction: (type: InteractionType) => void;
  isTop: boolean;
}

export const GestureController: React.FC<GestureControllerProps> = ({ post, onInteraction, isTop }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const isDraggingRef = useRef(false);

  // Rotation based on X movement for realistic feel
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // Opacity for overlays
  const opacityRight = useTransform(x, [50, 150], [0, 1]); // Relevant
  const opacityLeft = useTransform(x, [-50, -150], [0, 1]); // Irrelevant
  const opacityUp = useTransform(y, [-50, -150], [0, 1]); // Relevant & Like
  const opacityDown = useTransform(y, [50, 150], [0, 1]); // Irrelevant & Dislike

  const handleDragStart = (event: any, info: PanInfo) => {
    isDraggingRef.current = true;
    setDragStart({ x: info.point.x, y: info.point.y });
    pointsRef.current = [{ x: info.point.x, y: info.point.y }];
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (isDraggingRef.current) {
      pointsRef.current.push({ x: info.point.x, y: info.point.y });
    }
  };

  const detectCircle = (points: { x: number; y: number }[]) => {
    if (points.length < 20) return false;

    // Basic bounding box check
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    
    // Must be somewhat large to be a deliberate circle
    if (width < 50 || height < 50) return false;

    // Check closure: End point should be close to Start point
    const start = points[0];
    const end = points[points.length - 1];
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

    // Loose closure check (within 100px)
    if (distance > 100) return false;

    // Check if we actually went "around" roughly. 
    // Simplified: Check if we have points in all 4 quadrants relative to center
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    
    let q1 = false, q2 = false, q3 = false, q4 = false;
    points.forEach(p => {
      if (p.x > centerX && p.y < centerY) q1 = true;
      if (p.x < centerX && p.y < centerY) q2 = true;
      if (p.x < centerX && p.y > centerY) q3 = true;
      if (p.x > centerX && p.y > centerY) q4 = true;
    });

    return q1 && q2 && q3 && q4;
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    isDraggingRef.current = false;
    const threshold = 100;
    const { offset } = info;

    // 1. Check for Circle Gesture First
    if (detectCircle(pointsRef.current)) {
      await controls.start({ scale: 1.1, transition: { duration: 0.2 } });
      await controls.start({ scale: 0, opacity: 0, transition: { duration: 0.3 } });
      onInteraction('save');
      return;
    }

    // 2. Check Directional Swipes
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal
      if (offset.x > threshold) {
        // Right: Relevant
        await controls.start({ x: 500, opacity: 0 });
        onInteraction('relevant');
      } else if (offset.x < -threshold) {
        // Left: Irrelevant
        await controls.start({ x: -500, opacity: 0 });
        onInteraction('irrelevant');
      } else {
        controls.start({ x: 0, y: 0 });
      }
    } else {
      // Vertical
      if (offset.y < -threshold) {
        // Up: Relevant & Like
        await controls.start({ y: -500, opacity: 0 });
        onInteraction('relevant_like');
      } else if (offset.y > threshold) {
        // Down: Irrelevant & Dislike
        await controls.start({ y: 500, opacity: 0 });
        onInteraction('irrelevant_dislike');
      } else {
        controls.start({ x: 0, y: 0 });
      }
    }
    
    // Reset points
    pointsRef.current = [];
  };

  if (!isTop) {
    return (
      <div className="absolute top-0 left-0 w-full h-full transform scale-95 opacity-50 pointer-events-none">
        <Card post={post} />
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Free drag but snaps back if not triggered
      dragElastic={0.6}
      style={{ x, y, rotate, zIndex: 10 }}
      animate={controls}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full h-full touch-none cursor-grab active:cursor-grabbing"
    >
      <Card post={post} />

      {/* Overlays for feedback */}
      <motion.div style={{ opacity: opacityRight }} className="absolute inset-0 flex items-center justify-center pointer-events-none bg-green-500/20 rounded-3xl z-20 border-4 border-green-500">
        <div className="bg-green-500 text-white p-4 rounded-full">
          <Check size={48} strokeWidth={3} />
        </div>
      </motion.div>

      <motion.div style={{ opacity: opacityLeft }} className="absolute inset-0 flex items-center justify-center pointer-events-none bg-red-500/20 rounded-3xl z-20 border-4 border-red-500">
         <div className="bg-red-500 text-white p-4 rounded-full">
          <X size={48} strokeWidth={3} />
        </div>
      </motion.div>

      <motion.div style={{ opacity: opacityUp }} className="absolute inset-0 flex items-center justify-center pointer-events-none bg-blue-500/20 rounded-3xl z-20 border-4 border-blue-500">
         <div className="bg-blue-500 text-white p-4 rounded-full">
          <ThumbsUp size={48} strokeWidth={3} />
        </div>
      </motion.div>

      <motion.div style={{ opacity: opacityDown }} className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gray-500/20 rounded-3xl z-20 border-4 border-gray-500">
         <div className="bg-gray-500 text-white p-4 rounded-full">
          <ThumbsDown size={48} strokeWidth={3} />
        </div>
      </motion.div>
    </motion.div>
  );
};
