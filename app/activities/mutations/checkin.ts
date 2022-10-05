import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const Checkin = z.object({
  activityId: z.number(),
  tuid: z.number(),
})

export default resolver.pipe(
  resolver.zod(Checkin),
  resolver.authorize(),
  async ({ activityId, tuid }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    await db.activity.update({
      where: { id: activityId },
      data: {
        attendees: {
          connectOrCreate: { where: { tuid }, create: { name: `Student ${tuid}`, tuid } },
        },
      },
    })
  }
)
