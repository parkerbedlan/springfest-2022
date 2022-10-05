import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteStudent = z.object({
  tuid: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteStudent),
  resolver.authorize(),
  async ({ tuid }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const student = await db.student.deleteMany({ where: { tuid } })

    return student
  }
)
