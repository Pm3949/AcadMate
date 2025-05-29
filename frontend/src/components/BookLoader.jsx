import React from 'react';
import { BookOpenIcon } from "lucide-react";
import { motion} from "framer-motion";
function EnhancedBookLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-16 w-16">
        <motion.div
          className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity
          }}
        />
        <BookOpenIcon className="absolute inset-0 m-auto h-8 w-8 text-blue-500 opacity-75" />
      </div>
      <motion.p 
        className="text-blue-600 font-medium"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading subjects...
      </motion.p>
    </div>
  );
}

export default EnhancedBookLoader;