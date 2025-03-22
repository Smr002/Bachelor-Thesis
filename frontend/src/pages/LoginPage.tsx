import React from "react";
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
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form schema with validation
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Login attempt:", values);

    // This is a placeholder - replace with actual authentication
    toast({
      title: "Login Successful",
      description: "Welcome back to AlgoStruct!",
    });

    // Redirect to home page after "login"
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-leetcode-bg-medium">
      <div className="w-full max-w-md">
        <Card className="border-leetcode-bg-light bg-leetcode-bg-dark">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <LogIn className="h-10 w-10 text-leetcode-blue" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-leetcode-text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-leetcode-text-secondary">
              Enter your credentials to access your account
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
                <Button
                  type="submit"
                  className="w-full bg-leetcode-blue hover:bg-leetcode-blue/90"
                >
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-leetcode-text-secondary">
              <Link
                to="/forgot-password"
                className="hover:text-leetcode-blue underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="text-sm text-center text-leetcode-text-secondary">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-leetcode-blue hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
