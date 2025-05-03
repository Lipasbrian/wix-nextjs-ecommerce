import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary"; // Add this import

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
    console.error("⚠️ Cloudinary credentials missing! Image uploads will fail.");
}

async function uploadToStorage(avatar: Blob): Promise<string> {
    try {
        // Convert blob to base64
        const buffer = Buffer.from(await avatar.arrayBuffer());
        const base64Data = `data:${avatar.type};base64,${buffer.toString("base64")}`;

        // Upload to cloudinary with improved error handling
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
                base64Data,
                {
                    folder: "avatars",
                    transformation: [{ width: 400, height: 400, crop: "fill" }],
                    format: 'webp', // Optimize as WebP for better performance
                    quality: 'auto:good', // Use Cloudinary's auto quality optimization
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(new Error('Failed to upload image to cloud storage'));
                    } else if (!result) {
                        reject(new Error('No result from Cloudinary'));
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // Return the secure URL
        return result.secure_url;
    } catch (error) {
        console.error('Error in uploadToStorage:', error);
        throw new Error('Image upload failed');
    }
}

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse multipart form data
        const formData = await request.formData();
        const avatar = formData.get('avatar');

        if (!avatar || !(avatar instanceof Blob)) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (avatar.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(avatar.type)) {
            return NextResponse.json({
                error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images."
            }, { status: 400 });
        }

        // Upload the image to storage
        const imageUrl = await uploadToStorage(avatar);

        // Update the user in the database - using the same field name as in your schema
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                image: imageUrl, // This will match your updated schema
            },
        });

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return NextResponse.json(
            { error: "Failed to upload avatar" },
            { status: 500 }
        );
    }
}