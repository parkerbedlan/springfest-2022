import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateActivity = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateActivity),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const activity = await db.activity.update({ where: { id }, data })

    return activity
  }
)
