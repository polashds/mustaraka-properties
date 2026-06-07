"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost, updatePost } from "@/lib/admin-actions";

const PostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["Draft", "Published"]),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
});

type PostFormValues = z.infer<typeof PostFormSchema>;

interface Props {
  mode: "create" | "edit";
  postId?: number;
  defaultValues?: Partial<PostFormValues>;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="font-body text-xs text-red-400 mt-1">{msg}</p>;
}

const inputCls =
  "w-full bg-brand-bg border border-gold/20 px-4 py-2.5 font-body text-sm text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-gold/50 transition-colors";

const selectCls =
  "w-full bg-brand-bg border border-gold/20 px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-gold/50 transition-colors cursor-pointer";

export default function PostForm({ mode, postId, defaultValues }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: { status: "Draft", ...defaultValues },
  });

  const titleValue = watch("title");

  function handleTitleBlur() {
    if (mode === "create" && !watch("slug")) {
      setValue("slug", slugify(titleValue || ""), { shouldValidate: true });
    }
  }

  async function onSubmit(data: PostFormValues) {
    setSubmitting(true);
    setServerError("");

    const fd = new FormData();
    (Object.keys(data) as Array<keyof PostFormValues>).forEach((k) => {
      const v = data[k];
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });

    let result;
    if (mode === "create") {
      result = await createPost(fd);
    } else if (mode === "edit" && postId !== undefined) {
      result = await updatePost(postId, fd);
    }

    if (result?.errors) setServerError("Please fix the errors above.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Core */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-5">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">Post Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Title *</Label>
            <input
              {...register("title")}
              onBlur={handleTitleBlur}
              className={inputCls}
              placeholder="Market Insights Q2 2026"
            />
            <FieldError msg={errors.title?.message} />
          </div>
          <div>
            <Label>Slug *</Label>
            <input {...register("slug")} className={inputCls} placeholder="market-insights-q2-2026" />
            <FieldError msg={errors.slug?.message} />
          </div>
        </div>

        <div>
          <Label>Excerpt</Label>
          <textarea
            {...register("excerpt")}
            rows={2}
            className={`${inputCls} resize-none`}
            placeholder="Short description shown in listing cards (optional)…"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Category</Label>
            <input
              {...register("category")}
              className={inputCls}
              placeholder="Market Insights"
            />
          </div>
          <div>
            <Label>Featured Image URL</Label>
            <input
              {...register("featuredImage")}
              className={inputCls}
              placeholder="https://images.unsplash.com/…"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-3">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">Body (Markdown)</h2>
        <textarea
          {...register("body")}
          rows={20}
          className={`${inputCls} resize-y font-mono text-xs`}
          placeholder={"# Heading\n\nYour markdown content here…\n\n## Sub-heading\n\nParagraph text with **bold** and _italic_."}
        />
        <FieldError msg={errors.body?.message} />
      </section>

      {/* Status */}
      <section className="bg-brand-surface border border-gold/15 p-6">
        <h2 className="font-heading font-light text-brand-text text-xl mb-4">Status</h2>
        <div className="w-48">
          <select {...register("status")} className={selectCls}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </section>

      {serverError && <p className="font-body text-sm text-red-400">{serverError}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : mode === "create" ? "Publish Post" : "Save Changes"}
        </button>
        <a
          href="/admin/blog"
          className="font-body text-xs text-brand-muted hover:text-brand-text tracking-[0.15em] uppercase transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
