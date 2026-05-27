import { client } from '@/lib/orpc'
import { redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// This page is for the /workspace route (no workspace ID in URL).
// It reads the active org from the session and redirects to the correct workspace.
const WorkspacePage = async () => {
  const { getOrganization } = getKindeServerSession()
  const org = await getOrganization()

  if (!org?.orgCode) {
    // No active workspace in session — let the user pick one
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-muted-foreground">Select a workspace to get started.</h1>
      </div>
    )
  }

  const { channels } = await client.channel.list()

  if (channels.length > 0) {
    return redirect(`/workspace/${org.orgCode}/channel/${channels[0].id}`)
  }

  return redirect(`/workspace/${org.orgCode}`)
}

export default WorkspacePage
