import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}