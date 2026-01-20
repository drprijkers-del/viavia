"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Generate a short, readable slug
function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

// Generate a 6-character group code
function generateGroupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude confusing chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export interface CreateGroupData {
  name?: string;
  withCode?: boolean;
}

export async function createGroup(data: CreateGroupData) {
  try {
    let slug = generateSlug();

    // Ensure unique slug
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.group.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    const groupCode = data.withCode ? generateGroupCode() : null;
    const codeHash = groupCode ? await bcrypt.hash(groupCode, 10) : null;

    const group = await db.group.create({
      data: {
        slug,
        name: data.name || null,
        code_hash: codeHash,
      },
    });

    return {
      success: true,
      slug: group.slug,
      code: groupCode, // return only once during creation
    };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      success: false,
      error: "Er is iets misgegaan bij het aanmaken van de groep",
    };
  }
}

export async function verifyGroupCode(slug: string, code: string) {
  try {
    const group = await db.group.findUnique({
      where: { slug },
      select: { code_hash: true },
    });

    if (!group) {
      return { valid: false, error: "Groep niet gevonden" };
    }

    // If no code set, anyone can post
    if (!group.code_hash) {
      return { valid: true };
    }

    // Verify code
    const valid = await bcrypt.compare(code, group.code_hash);
    return { valid, error: valid ? null : "Onjuiste code" };
  } catch (error) {
    console.error("Error verifying group code:", error);
    return { valid: false, error: "Er is iets misgegaan" };
  }
}

export async function getGroup(slug: string) {
  try {
    const group = await db.group.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        created_at: true,
        code_hash: true, // to check if code protection is enabled
      },
    });

    return group;
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
}
