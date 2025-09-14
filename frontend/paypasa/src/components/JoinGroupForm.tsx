"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/utils/app";
import { toast } from "sonner"; // Import sonner toast
import Cookies from "js-cookie";

// Validation schema
const formSchema = z.object({
  group: z.string().min(3, "Enter valid Groupid."),
});

type FormData = z.infer<typeof formSchema>;

interface JoinGroupFormProps {
  onClose: () => void; // Prop to close the dialog
}

export default function JoinGroupForm({ onClose }: JoinGroupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group: "",
    },
  });

  const onSubmit = async (inputValues: FormData) => {
    setLoading(true);
    try {
      await api.post(`/api/groupusers/`, { group: inputValues.group });
      toast.success("Successfully joined the group!"); // Show success toast
      form.reset(); // Optional: Reset the form
      onClose(); // Close the dialog
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      toast.error("Failed to join the group. Please try again."); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Join Group</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Group Identification</FormLabel>
                <FormControl>
                  <Input placeholder="Groupid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose(); // Close dialog on cancel
                router.push("/dashboard");
              }}
            >
              Return
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}