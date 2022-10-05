import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

// const member = z.object({ tuid: z.number(), name: z.string() })

const UpdateOrg = z.object({
  id: z.number(),
  name: z.string(),
  studentIds: z.array(z.number()),
})

export default resolver.pipe(resolver.zod(UpdateOrg), async (input) => {
  // const members = await db.student.createMany({
  //   data: input.members,
  //   skipDuplicates: true,
  // }) // create members who aren't in db yet

  const org = await db.org.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name.trim(),
      members: {
        set: [],
        connect: input.studentIds.map((id) => ({ id })),
      },
    },
  })

  return org
})
