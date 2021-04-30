const { makeFile, runCommand } = require('../common/utils')
const { nanoid } = require('nanoid')

module.exports.runScad = async ({
  file,
  settings: {
    size: { x = 500, y = 500 } = {},
    camera: {
      position = { x: 40, y: 40, z: 40 },
      rotation = { x: 55, y: 0, z: 25 },
      dist = 200,
    } = {},
  } = {}, // TODO add view settings
} = {}) => {
  const tempFile = await makeFile(file, '.scad', nanoid)
  const { x: rx, y: ry, z: rz } = rotation
  const { x: px, y: py, z: pz } = position
  const cameraArg = `--camera=${px},${py},${pz},${rx},${ry},${rz},${dist}`
  const command = `xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" openscad -o /tmp/${tempFile}/output.png ${cameraArg} --imgsize=${x},${y} --colorscheme DeepOcean /tmp/${tempFile}/main.scad`
  console.log('command', command)

  try {
    const result = await runCommand(command, 15000)
    return { result, tempFile }
  } catch (error) {
    return { error, tempFile }
  }
}

module.exports.stlExport = async ({ file } = {}) => {
  const tempFile = await makeFile(file, '.scad', nanoid)

  try {
    const result = await runCommand(
      `openscad -o /tmp/${tempFile}/output.stl /tmp/${tempFile}/main.scad`,
      300000 // lambda will time out before this, we might need to look at background jobs if we do git integration stl generation
    )
    return { result, tempFile }
  } catch (error) {
    return { error, tempFile }
  }
}