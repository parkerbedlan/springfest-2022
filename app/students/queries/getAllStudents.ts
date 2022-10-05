import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

export default resolver.pipe(resolver.zod(z.object({})), async (_, ctx) => {
  const students = await db.student.findMany({
    select: { id: true, name: true, tuid: ctx.session.$isAuthorized() },
  })
  return students
})
