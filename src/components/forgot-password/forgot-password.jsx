"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Send, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useApiMutation } from "@/hooks/useApiMutation";
import { LOGIN } from "@/constants/apiConstants";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { trigger: submitStudent, loading: submitLoading } = useApiMutation();

  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await submitStudent({
        url: LOGIN.forgotpassword,
        method: "POST",
        data: form,
      });

      if (res?.code === 201) {
        toast.success(res.message || "Reset link sent successfully");
        setForm({ username: "", email: "" });
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-semibold">
            Forgot your password?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            We’ll send a reset link to your registered email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send reset link
                </>
              )}
            </Button>

            {/* Back to login */}
            <div className="pt-2 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
