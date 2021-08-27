import { json } from 'https://deno.land/x/sift@0.1.7/mod.ts'

export default function handler(interaction) {
  const { value } = interaction.data.options.find(
    (option) => option.name === 'name',
  )
  return json({
    // Type 4 responds with the below message retaining the user's
    // input at the top.
    type: 4,
    data: {
      content: `Hello, ${value}!`,
    },
  })
}
