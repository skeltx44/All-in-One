import { API_BASE_URL } from "@/lib/api";

export async function addActivity(
  userId: number,
  activity_type: string,
  description: string,
  exp_amount: number
) {
  await fetch(`${API_BASE_URL}/api/db/characters/${userId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      activity_type,
      description,
      exp_amount,
    }),
  })
}