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
    FormMessage
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/utils/app";
import Cookies from 'js-cookie'

// Validation schema
const formSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    avatar: z
        .custom<FileList>()
        .refine((files) => files && files.length > 0, "Avatar is required")
});

type FormData = z.infer<typeof formSchema>;

export default function CreateGroupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            avatar: undefined
        }
    });

    const onSubmit = async (inputValues: FormData) => {
        async function postData() {
            try {
                const formData = new FormData();
                formData.append("name", inputValues.name);
                if (inputValues.avatar && inputValues.avatar.length > 0) {
                    formData.append("avatar", inputValues.avatar[0]);
                }

                await api.post(`/api/groups/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        setLoading(true);
        await postData();
        setLoading(false);
        router.push("/dashboard");
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Create Group</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Group Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter group name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Avatar Upload */}
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                    />
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
                            onClick={() => router.push("/dashboard")}
                        >
                            Return
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
