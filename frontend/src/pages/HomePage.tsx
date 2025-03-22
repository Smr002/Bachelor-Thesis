
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Coffee, Book, BookOpen, Trophy, Brain, Zap, CheckCircle, Database, FileCode, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'structures' | 'quizzes' | 'compiler'>('structures');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const featureItems = [
    {
      icon: <Database className="h-12 w-12 text-leetcode-blue" />,
      title: "Java Data Structures",
      description: "Interactive lessons on arrays, linked lists, trees, graphs and more implemented in Java.",
      color: "from-leetcode-blue/20 to-leetcode-blue/10"
    },
    {
      icon: <Brain className="h-12 w-12 text-leetcode-yellow" />,
      title: "Pop Quizzes",
      description: "Test your knowledge with timed quizzes on Java concepts and data structure operations.",
      color: "from-leetcode-yellow/20 to-leetcode-yellow/10"
    },
    {
      icon: <Coffee className="h-12 w-12 text-leetcode-red" />,
      title: "Java Compiler",
      description: "Write, compile and test your Java code directly in the browser with instant feedback.",
      color: "from-leetcode-red/20 to-leetcode-red/10"
    },
    {
      icon: <Layers className="h-12 w-12 text-leetcode-green" />,
      title: "Algorithm Visualizer",
      description: "Watch your Java algorithms run step-by-step with our interactive visualization tool.",
      color: "from-leetcode-green/20 to-leetcode-green/10"
    }
  ];

  const testimonialsData = [
    {
      name: "Alex Johnson",
      title: "CS Student",
      quote: "This platform helped me ace my Java Data Structures class. The visualizations make complex concepts crystal clear.",
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    {
      name: "Sarah Chen",
      title: "Software Engineer",
      quote: "The interactive compiler is perfect for quick prototyping of data structure implementations.",
      avatar: "https://i.pravatar.cc/100?img=5"
    },
    {
      name: "Michael Rodriguez",
      title: "Bootcamp Instructor",
      quote: "I recommend this to all my students. The quizzes are especially helpful for reinforcing key Java concepts.",
      avatar: "https://i.pravatar.cc/100?img=3"
    }
  ];

  const tabContent = {
    structures: (
      <div className="bg-leetcode-bg-dark rounded-lg p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Java Data Structures Library</h3>
        <div className="bg-leetcode-bg-medium rounded-md p-4 font-mono text-sm mb-6 overflow-x-auto">
          <pre className="text-leetcode-text-primary">
            <code>{`// Binary Search Tree implementation in Java
public class BinarySearchTree<T extends Comparable<T>> {
    private Node<T> root;
    
    private static class Node<T> {
        private T data;
        private Node<T> left;
        private Node<T> right;
        
        public Node(T data) {
            this.data = data;
        }
    }
    
    public void insert(T data) {
        root = insertRec(root, data);
    }
    
    private Node<T> insertRec(Node<T> root, T data) {
        if (root == null) {
            return new Node<>(data);
        }
        
        if (data.compareTo(root.data) < 0) {
            root.left = insertRec(root.left, data);
        } else if (data.compareTo(root.data) > 0) {
            root.right = insertRec(root.right, data);
        }
        
        return root;
    }
}`}</code>
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-leetcode-bg-medium p-4 rounded-md">
            <FileCode className="h-5 w-5 text-leetcode-green mb-2" />
            <h4 className="font-medium mb-1">Complete Implementations</h4>
            <p className="text-sm text-leetcode-text-secondary">Full Java code for all standard data structures</p>
          </div>
          <div className="bg-leetcode-bg-medium p-4 rounded-md">
            <CheckCircle className="h-5 w-5 text-leetcode-blue mb-2" />
            <h4 className="font-medium mb-1">Time Complexity</h4>
            <p className="text-sm text-leetcode-text-secondary">Analysis for all operations</p>
          </div>
        </div>
      </div>
    ),
    quizzes: (
      <div className="bg-leetcode-bg-dark rounded-lg p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Interactive Java Quizzes</h3>
        <div className="bg-leetcode-bg-medium rounded-md p-6 mb-6">
          <p className="text-lg mb-4">What is the time complexity of binary search?</p>
          <div className="space-y-2">
            {["O(1)", "O(log n)", "O(n)", "O(n log n)"].map((option, index) => (
              <div key={index} className={`p-3 rounded-md cursor-pointer transition ${index === 1 ? 'bg-leetcode-green/20 border border-leetcode-green' : 'bg-leetcode-bg-light hover:bg-leetcode-bg-light/70'}`}>
                {option} {index === 1 && <CheckCircle className="h-4 w-4 text-leetcode-green inline ml-2" />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center text-leetcode-text-secondary">
            <Trophy className="h-4 w-4 mr-1" /> Score: 4/5
          </div>
          <div className="flex items-center text-leetcode-text-secondary">
            <Zap className="h-4 w-4 mr-1" /> Streak: 3 days
          </div>
        </div>
      </div>
    ),
    compiler: (
      <div className="bg-leetcode-bg-dark rounded-lg p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Java Online Compiler</h3>
        <div className="bg-leetcode-bg-medium rounded-md p-4 font-mono text-sm mb-6 overflow-hidden">
          <div className="flex justify-between items-center mb-2 border-b border-leetcode-bg-light pb-2">
            <span className="text-leetcode-text-secondary">Main.java</span>
            <Button variant="outline" size="sm" className="bg-leetcode-bg-light border-leetcode-bg-light text-xs">
              <Zap className="h-3 w-3 mr-1" /> Run
            </Button>
          </div>
          <pre className="text-leetcode-text-primary overflow-x-auto">
            <code>{`public class Main {
    public static void main(String[] args) {
        // Create a linked list
        LinkedList<Integer> list = new LinkedList<>();
        
        // Add elements
        list.add(10);
        list.add(20);
        list.add(30);
        
        // Print the list
        System.out.println("Linked List: " + list);
        
        // Remove an element
        list.remove(1);
        
        // Print the updated list
        System.out.println("After removal: " + list);
    }
}`}</code>
          </pre>
        </div>
        <div className="bg-leetcode-bg-light rounded-md p-4">
          <p className="text-sm text-leetcode-text-secondary mb-2">Output:</p>
          <pre className="text-leetcode-green text-sm">
            <code>{`Linked List: [10, 20, 30]
After removal: [10, 30]`}</code>
          </pre>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen flex flex-col bg-leetcode-bg-dark">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden pb-16">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-leetcode-blue rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-leetcode-green rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-leetcode-blue via-leetcode-green to-leetcode-yellow rounded-full blur-lg opacity-70"></div>
                  <div className="relative bg-leetcode-bg-medium p-4 rounded-full inline-flex">
                    <Coffee className="h-12 w-12 text-leetcode-blue" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-leetcode-blue via-leetcode-green to-leetcode-yellow bg-clip-text text-transparent">
                Master Java Data Structures
              </h1>
              <p className="text-xl md:text-2xl text-leetcode-text-secondary max-w-3xl mx-auto mb-10">
                Interactive learning platform for Java developers to practice data structures, algorithms, and ace technical interviews
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-leetcode-blue hover:bg-leetcode-blue/90 text-white">
                  Start Coding Now
                </Button>
                <Link to="/problems">
                  <Button size="lg" variant="outline" className="border-leetcode-blue text-leetcode-blue hover:bg-leetcode-blue/10">
                    Explore Problems
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="text-center mb-12"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
                Everything You Need to Master Java
              </motion.h2>
              <motion.p variants={itemVariants} className="text-leetcode-text-secondary max-w-2xl mx-auto">
                Our platform provides all the tools and resources you need to become proficient in Java data structures and algorithms.
              </motion.p>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featureItems.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${feature.color} p-6 rounded-lg shadow-md border border-leetcode-bg-light`}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-leetcode-text-secondary">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-16 px-4 bg-leetcode-bg-medium">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Try Our Interactive Tools</h2>
              <p className="text-leetcode-text-secondary max-w-2xl mx-auto">
                Experience our learning platform with these interactive demos.
              </p>
            </div>
            
            <div className="bg-leetcode-bg-light rounded-xl p-4 mb-8">
              <div className="flex border-b border-leetcode-bg-medium">
                <button
                  onClick={() => setActiveTab('structures')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'structures' ? 'border-b-2 border-leetcode-blue text-leetcode-blue' : 'text-leetcode-text-secondary'}`}
                >
                  Data Structures
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'quizzes' ? 'border-b-2 border-leetcode-blue text-leetcode-blue' : 'text-leetcode-text-secondary'}`}
                >
                  Pop Quizzes
                </button>
                <button
                  onClick={() => setActiveTab('compiler')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'compiler' ? 'border-b-2 border-leetcode-blue text-leetcode-blue' : 'text-leetcode-text-secondary'}`}
                >
                  Java Compiler
                </button>
              </div>
              
              <div className="p-4">
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Users Say</h2>
              <p className="text-leetcode-text-secondary max-w-2xl mx-auto">
                Hear from students and professionals who have accelerated their Java learning with our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="bg-leetcode-bg-medium p-6 rounded-lg border border-leetcode-bg-light">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-leetcode-text-secondary">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-leetcode-text-secondary italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-leetcode-bg-medium">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Advance Your Java Skills?</h2>
            <p className="text-leetcode-text-secondary mb-8">
              Join thousands of developers who are mastering Java data structures and algorithms on our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-leetcode-green hover:bg-leetcode-green/90 text-white w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline" className="border-leetcode-text-secondary text-leetcode-text-secondary hover:bg-leetcode-bg-light w-full sm:w-auto">
                  Browse Problems
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
