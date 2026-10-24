// Smoke test for lib/pc-api against a running PC Lock API.
// Usage: npm run check:pc-api -- <host> <port> <password>   (locks, unlocks and changes the schedule!)
import assert from 'node:assert/strict'
import * as api from '../lib/pc-api'

const [host = '127.0.0.1', port = '8765', password = ''] = process.argv.slice(2)
const pc = { url: host, port: Number(port), password }

async function main() {
  const status = await api.getStatus(pc)
  assert.ok(status, 'PC should be online')
  assert.ok(status.schedule, 'authenticated status includes the schedule')
  console.log('status ok', status)

  assert.equal((await api.lockPc(pc)).locked, true)
  assert.equal((await api.unlockPc(pc)).locked, false)
  console.log('lock/unlock ok')

  const { schedule } = await api.updateSchedule(pc, { enabled: true, start: '21:30', end: '06:45' })
  assert.deepEqual([schedule.start, schedule.end, schedule.enabled], ['21:30', '06:45', true])
  console.log('schedule ok', schedule)

  await assert.rejects(api.lockPc({ ...pc, password: 'wrong' }), /Wrong PC password/)
  console.log('wrong password -> clear error ok')

  assert.equal(await api.getStatus({ ...pc, port: 1 }), null)
  console.log('offline -> null ok')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
