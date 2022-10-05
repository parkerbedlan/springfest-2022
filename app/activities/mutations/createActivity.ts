import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateActivity = z.object({
  name: z.string(),
  date: z.string(),
})

export default resolver.pipe(resolver.zod(CreateActivity), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const activity = await db.activity.create({ data: input })

  return activity
})
