import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetActivity = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetActivity), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const activity = await db.activity.findFirst({ where: { id } })

  if (!activity) throw new NotFoundError()

  return activity
})
