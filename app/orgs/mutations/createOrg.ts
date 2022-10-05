import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

// const member = z.object({ tuid: z.number(), name: z.string() })

const CreateOrg = z.object({
  name: z.string(),
  studentIds: z.array(z.number()),
})

export default resolver.pipe(
  resolver.zod(CreateOrg),
  resolver.authorize(), // comment out to allow laymen to create an org
  async (input) => {
    // const members = await db.student.createMany({
    //   data: input.members,
    //   skipDuplicates: true,
    // }) // create members who aren't in db yet

    const org = await db.org.create({
      data: {
        name: input.name.trim(),
        members: {
          connect: input.studentIds.map((id) => ({ id })),
        },
      },
    })

    return org
  }
)
