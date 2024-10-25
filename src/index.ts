import { runMain as _runMain, defineCommand } from 'citty'
import pkg from '../package.json' assert { type: 'json' }

const main = defineCommand({
  meta: {
    name: 'nitrolux',
    version: pkg.version,
    description: pkg.description,
  },
  args: {
    name: {
      type: 'positional',
      description: 'Application name',
      valueHint: 'my-app',
      required: true,
    },
    verbose: {
      type: 'boolean',
      description: 'Use friendly greeting',
      default: false,
      alias: 'V',
    },
  },
  run({ args }) {
    console.info(`${args.friendly ? 'Howdy,' : 'Creating application:'} ${args.name}`)
  },
})

const runMain = () => _runMain(main)

export { runMain }
