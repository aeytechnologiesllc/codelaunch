import { NextRequest, NextResponse } from "next/server";
import { appConfig } from "@/lib/config";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const context = await getCurrentUserContext();

    if (!context || !context.isAdmin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const service = createSupabaseServiceClient();
    const formData = await req.formData();
    const projectId = formData.get("projectId");
    const category = formData.get("category");
    const file = formData.get("file");

    if (typeof projectId !== "string" || !projectId || !(file instanceof File)) {
      return NextResponse.json({ error: "Project and file are required." }, { status: 400 });
    }

    const bucket = appConfig.projectFilesBucket;
    const bucketLookup = await service.storage.getBucket(bucket);

    if (bucketLookup.error && bucketLookup.error.message.toLowerCase().includes("not found")) {
      const createBucket = await service.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024,
      });

      if (createBucket.error) {
        throw createBucket.error;
      }
    } else if (bucketLookup.error) {
      throw bucketLookup.error;
    }

    const safeName = sanitizeFileName(file.name || "upload.bin");
    const storagePath = `${projectId}/${Date.now()}-${safeName}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const upload = await service.storage.from(bucket).upload(storagePath, bytes, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

    if (upload.error) {
      throw upload.error;
    }

    const publicUrl = service.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;

    const { data, error } = await service
      .from("project_files")
      .insert({
        project_id: projectId,
        name: safeName,
        file_url: publicUrl,
        file_type: typeof category === "string" && category.trim() ? category.trim() : file.type || "File",
        file_size: file.size,
        uploaded_by: context.profile.id,
        uploaded_by_profile_id: context.profile.id,
        uploaded_by_label: context.profile.full_name || context.profile.email || "CodeLaunch Team",
        category: typeof category === "string" && category.trim() ? category.trim() : "General",
        storage_path: storagePath,
        size_bytes: file.size,
      })
      .select("id, name, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, file: data });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
