// zx index.mjs ../path/to/Taskfile.yml

import fs from 'node:fs/promises'
import crypto from 'node:crypto'

const taskfilePath = argv._[0]
const taskfileContent = await fs.readFile(taskfilePath, 'utf8')
const taskfileYaml = YAML.parse(taskfileContent)

for (const env of Object.keys(taskfileYaml.env)) {
  await exportValue(env, process.env[env])
}

async function exportValue(key, value) {
  const delimiter = `ghadelimiter_${crypto.randomUUID()}`
  const result = `${key}<<${delimiter}${os.EOL}${value}${os.EOL}${delimiter}${os.EOL}`

  // Hide the secrets from the GitHub Actions logs
  for (const valueLine of value.split('\n')) {
    if (valueLine.length > 2) {
      await echo(`::add-mask::${valueLine}`)
    }
  }

  // Export key=value to the GitHub Actions environment
  await fs.appendFile(process.env.GITHUB_ENV, result, 'utf8')
}