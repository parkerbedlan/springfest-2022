import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateStudent = z.object({
  tuid: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateStudent),
  resolver.authorize(),
  async ({ tuid, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const student = await db.student.update({ where: { tuid }, data })

    return student
  }
)
