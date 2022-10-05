import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteActivity = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteActivity), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const activity = await db.activity.deleteMany({ where: { id } })

  return activity
})
