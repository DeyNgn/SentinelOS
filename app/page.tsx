import { allConnectorStatuses } from '@/lib/connectors';
import { getDb, getOperations } from '@/lib/data';
import { OperatorHome } from '@/components/OperatorHome';

export const dynamic = 'force-dynamic';

export default async function OperatorPage() {
  const db = getDb();
  const [connectors] = await Promise.all([allConnectorStatuses()]);
  const agents = db.agents.all();
  const agentNames = new Map(agents.map((agent) => [agent.id, agent.name]));
  const openTasks = db.agentTasks.all().filter((task) => task.status !== 'done');
  const recentRun = db.agentRuns.recent(1)[0] ?? null;

  return (
    <OperatorHome
      boardUrl={process.env.PAPERCLIP_API_URL ?? null}
      context={{
        operations: getOperations().map(({ id, name, shops }) => ({ id, name, shops })),
        agents: {
          active: agents.filter((agent) => agent.status === 'active').length,
          total: agents.length,
        },
        tasks: {
          open: openTasks.length,
          items: openTasks.slice(0, 4).map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            agent: agentNames.get(task.agentId) ?? task.agentId,
          })),
        },
        connectors: {
          connected: connectors.filter((connector) => connector.state === 'connected').length,
          total: connectors.length,
          errors: connectors.filter((connector) => connector.state === 'error').length,
        },
        latestRun: recentRun
          ? {
              agent: agentNames.get(recentRun.agentId) ?? recentRun.agentId,
              summary: recentRun.summary,
              ok: recentRun.ok,
              startedAt: recentRun.startedAt,
            }
          : null,
      }}
    />
  );
}
