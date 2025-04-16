import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        // Verify file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return new NextResponse("Invalid file type", { status: 400 });
        }

        // Get file as buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Create unique filename
        const filename = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`;

        // Define path to save the file (public directory)
        const path = join(process.cwd(), "public/uploads", filename);

        // Write file to disk
        await writeFile(path, buffer);

        // Return the path that can be used to access the file
        return NextResponse.json({
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return new NextResponse("Error uploading file", { status: 500 });
    }
}