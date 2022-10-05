import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetStudent = z.object({
  // This accepts type of undefined, but is required at runtime
  tuid: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetStudent), resolver.authorize(), async ({ tuid }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const student = await db.student.findFirst({ where: { tuid } })

  if (!student) throw new NotFoundError()

  return student
})
