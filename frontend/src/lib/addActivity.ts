export async function addActivity(
  userId: number,
  activity_type: string,
  description: string,
  exp_amount: number
) {
  await fetch(`http://localhost:4000/api/db/characters/${userId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      activity_type,
      description,
      exp_amount,
    }),
  })
}