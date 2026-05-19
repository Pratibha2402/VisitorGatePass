import { fetchEmployeebyUsername } from "@/app/api";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const res = await fetchEmployeebyUsername(params.username);
  return Response.json(res);
}
