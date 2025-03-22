import React from "react";
import { createUser } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form schema with validation
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be no more than 20 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createUser({
        name: values.username,
        email: values.email,
        password: values.password,
        role: "student",
      });

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-leetcode-bg-medium">
      <div className="w-full max-w-md">
        <Card className="border-leetcode-bg-light bg-leetcode-bg-dark">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <UserPlus className="h-10 w-10 text-leetcode-blue" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-leetcode-text-primary">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center text-leetcode-text-secondary">
              Enter your details to join AlgoStruct
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-leetcode-text-primary">
                        Username
                      </FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
                        <FormControl>
                          <Input
                            placeholder="johndoe"
                            className="pl-10 bg-leetcode-bg-medium border-leetcode-bg-light"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-leetcode-text-primary">
                        Email
                      </FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            className="pl-10 bg-leetcode-bg-medium border-leetcode-bg-light"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-leetcode-text-primary">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 bg-leetcode-bg-medium border-leetcode-bg-light"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-leetcode-text-primary">
                        Confirm Password
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 bg-leetcode-bg-medium border-leetcode-bg-light"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-leetcode-blue hover:bg-leetcode-blue/90"
                >
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full text-leetcode-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-leetcode-blue hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
