"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getSymptomAnalysis } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  error: undefined,
  data: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Analysis
        </>
      )}
    </Button>
  );
}

export function SymptomCheckerForm() {
  const [state, formAction] = useActionState(getSymptomAnalysis, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-8 w-8 text-primary" />
            AI-Driven Symptom Checker
          </CardTitle>
          <CardDescription>
            Describe your symptoms, and our AI will provide a list of possible
            causes. This is for informational purposes only and not a medical
            diagnosis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Your Symptoms</Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              placeholder="e.g., 'I have a sore throat, headache, and a slight fever...'"
              className="min-h-[120px] text-base"
              required
            />
          </div>
          {state.data && (
            <Card className="bg-accent/50 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Possible Causes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-accent-foreground whitespace-pre-line">
                  {state.data}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
