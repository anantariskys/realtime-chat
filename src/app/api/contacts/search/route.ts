import { NextResponse } from "next/server";
import { dummyUsers } from "@/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const lowerQuery = query.toLowerCase();
  const results = dummyUsers
    .filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.phoneNumber.includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    )
    .map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.image,
      isOnline: true, // Mock status
      phoneNumber: u.phoneNumber,
    }));

  return NextResponse.json(results);
}
