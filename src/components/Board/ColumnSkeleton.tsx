import React from 'react';
import { Skeleton } from '../UI/Skeleton';
import { motion } from 'framer-motion';

const ColumnSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-[300px] min-w-[300px] glass-effect rounded-lg shadow-soft-xl mx-2 overflow-hidden"
    >
      <div className="p-3 bg-background/50">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </div>

      <div className="p-3 space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-4 space-y-3"
          >
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <div className="flex -space-x-2">
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="w-6 h-6 rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ColumnSkeleton;
