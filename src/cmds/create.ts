import { defineCommand } from 'citty'
import consola from 'consola'
import { downloadTemplate } from 'giget'
import { makeDirectory } from 'make-dir'
import { resolve } from 'pathe'

export default defineCommand({
  meta: {
    name: 'create',
    description: 'Create a new Nitro application',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Application name',
      valueHint: 'my-app',
      required: true,
    },
    baseDir: {
      type: 'string',
      description: 'Base directory to create the application in',
      required: false,
      alias: 'd',
    },
    force: {
      type: 'boolean',
      description: 'Force overwrite existing application directory',
      default: false,
      alias: 'f',
    },
    install: {
      type: 'boolean',
      description: 'Install  dependencies after creating the application',
      default: false,
      alias: 'i',
    },
    silent: {
      type: 'boolean',
      description: 'Suppress all output (including errors)',
      default: false,
      alias: 's',
    },
    dryRun: {
      type: 'boolean',
      description: 'Dry run the command without creating anything',
    },
    verbose: {
      type: 'boolean',
      description: 'Output more detailed debugging information',
      default: false,
      alias: 'V',
    },
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  setup() {
    consola.info('Do some setup here')
  },
  cleanup() {
    consola.info('Do some cleanup here')
  },
  async run({ args }) {
    const { name, baseDir, force, silent, dryRun, install } = args

    try {
      // Early exit for dry run
      if (dryRun) {
        consola.info('Dry run mode - no changes will be made')
        return
      }

      // Create target directory if args.baseDir is provided
      if (baseDir) {
        await makeDirectory(resolve('.tmp')).catch((err) => {
          throw new Error(`Failed to create target directory: ${err.message}`)
        })
      }

      // Construct target directory path
      const basePath = baseDir ? `${baseDir}/${name}` : name
      const targetDir = resolve(basePath)

      // Download and extract template from template repository
      if (!silent && install) {
        consola.info('Installing dependencies...')
      }

      const { source, dir } = await downloadTemplate('github:unjs/nitro-starter', {
        dir: targetDir,
        cwd: targetDir,
        forceClean: force,
        install,
        silent,
      })

      // Log success messages
      if (!silent) {
        consola.info(`Template source: ${source}`)
        consola.info(`Output directory: ${dir}`)
        consola.success(`Application "${name}" has been created at ${targetDir}`)
      }
    } catch (error) {
      if (!silent) {
        consola.error('Failed to create application:', error)
      }
      process.exit(1)
    }
  },
})