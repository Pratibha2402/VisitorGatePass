"use server";
export default async function getCentralSession(options: any) {
  const url = process.env.CENTERAL_AUTH_URL as string;
  const response = await fetch(url, options);
  const jsonResponse = await response.json();
  return jsonResponse;
}
