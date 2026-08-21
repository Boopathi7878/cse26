import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Key, Plus, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SignupCode {
  id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

interface SignupCodeManagementProps {
  codes: SignupCode[];
  onCodesChange: () => void;
  userId: string;
}

export const SignupCodeManagement = ({ codes, onCodesChange, userId }: SignupCodeManagementProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("signup_codes").insert({
        code,
        is_active: true,
        created_by: userId,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Signup code has been created successfully.",
      });

      setCode("");
      onCodesChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("signup_codes")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Code ${!currentStatus ? "activated" : "deactivated"}.`,
      });

      onCodesChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("signup_codes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Signup code has been deleted.",
      });

      onCodesChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Create Code Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Plus className="h-5 w-5 text-primary" />
            Create Signup Code
          </CardTitle>
          <CardDescription>Generate codes for new user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Secret Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="ABCD1234"
                  className="bg-background border-border font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomCode}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-emerald hover:opacity-90 text-white"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Code"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Codes List */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Existing Codes</h2>
        {codes.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground">No signup codes created yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {codes.map((signupCode) => (
              <Card key={signupCode.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <code className="text-lg font-mono font-bold text-foreground bg-muted px-3 py-1 rounded">
                          {signupCode.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(signupCode.code, signupCode.id)}
                          className="h-8 w-8"
                        >
                          {copiedId === signupCode.id ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(signupCode.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={signupCode.is_active}
                          onCheckedChange={() => handleToggleActive(signupCode.id, signupCode.is_active)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {signupCode.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(signupCode.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
