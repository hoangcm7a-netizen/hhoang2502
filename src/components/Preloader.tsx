import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Thời gian hiển thị loading (ví dụ: 1.5 giây)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-b-2 border-accent rounded-full animate-spin animate-reverse"></div>
              <div className="absolute text-sm font-mono text-primary font-bold">H</div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="text-sm font-mono tracking-widest text-muted-foreground"
            >
              INITIALIZING...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
