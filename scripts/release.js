const BumpVersion =
  require('capacitor-set-version/dist/commands/set/index').default;
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('auto-changelog/src/run');
const { versionBump } = require('@jsdevtools/version-bump-prompt');
const ezSpawn = require('@jsdevtools/ez-spawn');

const basePath = resolve(__dirname, '..');
const packageJson = resolve(basePath, 'package.json');
const versionFilePath = resolve(basePath, '.versionrc');

const versionFile = JSON.parse(
  readFileSync(versionFilePath).toString('utf-8'),
);

async function bumpVersion() {
  await versionBump({
    preid: 'build',
    noVerify: true,
    commit: 'chore(release): bump version to %s',
    tag: true,
    push: false,
    files: versionFile.files,
  });
}

async function bumpCapacitorVersion() {
  try {
    if (!existsSync(resolve(basePath, 'android')) && !existsSync(resolve(basePath, 'ios')))
      return;

    const versionName = JSON.parse(
      readFileSync(packageJson).toString('utf-8'),
    ).version;

    versionFile.versionCode = Number(versionFile.versionCode || 0) + 1;

    writeFileSync(versionFilePath, JSON.stringify(versionFile, null, 2), {
      encoding: 'utf-8',
    });

    await BumpVersion.run([
      basePath,
      '-v',
      versionName,
      '-b',
      versionFile.versionCode.toString(),
    ]);

  } catch (e) {
    console.error(e);
  }
}

async function generateChangelog() {
  await run(['-l', '1000', '-t', 'scripts/conventional.hbs']);
}

bumpVersion().then(bumpCapacitorVersion).then(generateChangelog).then(async () => {
  const androidFiles = existsSync(resolve(basePath, 'android')) ? ['android'] : [];
  const iosFiles = existsSync(resolve(basePath, 'ios')) ? ['ios'] : [];

  const filesToCommit = ['.versionrc', 'CHANGELOG.md', ...androidFiles, ...iosFiles];

  await ezSpawn.async('git', ['commit', '--amend', '--no-verify', '--no-edit', ...filesToCommit]);
});
