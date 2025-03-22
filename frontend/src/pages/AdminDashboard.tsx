
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, List, Users, Brain, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionsManager } from '@/components/admin/QuestionsManager';
import { UsersManager } from '@/components/admin/UsersManager';
import { QuizCreator } from '@/components/admin/QuizCreator';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('questions');
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-leetcode-blue mr-3" />
        <h1 className="text-3xl font-bold text-leetcode-text-primary">Admin Dashboard</h1>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <Card className="bg-leetcode-bg-medium border-leetcode-bg-light">
          <CardHeader className="pb-2">
            <TabsList className="bg-leetcode-bg-dark border border-leetcode-bg-light grid grid-cols-3 h-auto p-1">
              <TabsTrigger 
                value="questions"
                className="data-[state=active]:bg-leetcode-blue data-[state=active]:text-white py-2"
                onClick={() => setActiveTab('questions')}
              >
                <List className="h-4 w-4 mr-2" />
                <span>Questions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="data-[state=active]:bg-leetcode-blue data-[state=active]:text-white py-2"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quizzes"
                className="data-[state=active]:bg-leetcode-blue data-[state=active]:text-white py-2"
                onClick={() => setActiveTab('quizzes')}
              >
                <Brain className="h-4 w-4 mr-2" />
                <span>Quizzes</span>
              </TabsTrigger>
            </TabsList>
            <CardDescription className="pt-4 text-leetcode-text-secondary">
              Manage all aspects of your learning platform from this dashboard.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="questions" className="p-6 pt-2 m-0">
              <QuestionsManager />
            </TabsContent>
            <TabsContent value="users" className="p-6 pt-2 m-0">
              <UsersManager />
            </TabsContent>
            <TabsContent value="quizzes" className="p-6 pt-2 m-0">
              <QuizCreator />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
};

export default AdminDashboard;
