import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface DotButtonProps {
  selected: boolean
  onClick: () => void
}

export function DotButton({ selected, onClick }: DotButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative w-4 h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900',
        selected
          ? 'bg-primary scale-110 shadow-lg shadow-primary/25'
          : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
      )}
      type="button"
      onClick={onClick}
      aria-label={`Go to slide ${selected ? 'current' : ''}`}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )
}