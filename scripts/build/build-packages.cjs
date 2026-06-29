// scripts/build/build-packages.js
const {execSync} = require('child_process');
const path = require('path');
const fs = require('fs');

// 定义包构建顺序
const BUILD_ORDER = [
  // 'utils',
  // 'hooks',
  // 'theme',
  // 'locale',
  // 'icons',
  'components',
];

const PACKAGE_NAMES = {
  // utils: '@element-mage-plus/utils',
  // hooks: '@element-mage-plus/hooks',
  // theme: '@element-mage-plus/theme',
  // locale: '@element-mage-plus/locale',
  // icons: '@element-mage-plus/icons',
  components: '@element-mage-plus/components',
};

// 获取包路径
function getPackagePath(pkgName) {
  return path.resolve(__dirname, `../../packages/${pkgName}`);
}

// 获取包版本
function getPackageVersion(pkgPath) {
  const packageJsonPath = path.join(pkgPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  } catch (error) {
    console.error(`读取 ${packageJsonPath} 失败:`, error.message);
    return null;
  }
}

// 清理历史文件(包括 tgz 文件)
function cleanPackage(pkgName, pkgPath) {
  console.log(`\n 清理 ${PACKAGE_NAMES[pkgName] || pkgName} 历史文件...`);

  const distPath = path.join(pkgPath, 'dist');
  const packageName = PACKAGE_NAMES[pkgName] || pkgName;
  const version = getPackageVersion(pkgPath);

  try {
    // 1. 删除 dist 目录
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, {recursive: true, force: true});
      console.log(`  ✓ 已删除 dist 目录`);
    }

    // 2. 删除 tgz 文件
    const files = fs.readdirSync(pkgPath);
    let tgzCount = 0;

    // 构建 tgz 文件匹配模式
    // 例如: element-mage-plus-components-2026.1.1.tgz
    const packageNameForFile = packageName.replace('@', '').replace('/', '-');
    const tgzPattern = new RegExp(`^${packageNameForFile}-.*\\.tgz$`);

    files.forEach(file => {
      if (file.endsWith('.tgz')) {
        // 如果指定了版本，只删除匹配的版本
        if (version && file.includes(version)) {
          const filePath = path.join(pkgPath, file);
          fs.unlinkSync(filePath);
          tgzCount++;
        } else if (!version) {
          // 如果没有版本信息，删除所有 tgz 文件
          const filePath = path.join(pkgPath, file);
          fs.unlinkSync(filePath);
          tgzCount++;
        }
      }
    });

    console.log(`  ✓ 已删除 ${tgzCount} 个 tgz 文件`);

    // 3. 删除 node_modules/.vite 缓存（可选）
    // const viteCachePath = path.join(pkgPath, 'node_modules/.vite');
    // if (fs.existsSync(viteCachePath)) {
    //   fs.rmSync(viteCachePath, {recursive: true, force: true});
    //   console.log(`  ✓ 已清理 Vite 缓存`);
    // }

    console.log(`✓ ${PACKAGE_NAMES[pkgName] || pkgName} 清理完成`);
    return true;
  } catch (error) {
    console.error(`✗ 清理 ${PACKAGE_NAMES[pkgName] || pkgName} 失败:`, error.message);
    return false;
  }
}

// 生成 tgz 文件
function packPackage(pkgName, pkgPath) {
  console.log(`\n 生成 ${PACKAGE_NAMES[pkgName] || pkgName} 的 tgz 文件...`);

  try {
    // 使用 npm pack 生成 tgz 文件
    const packageName = PACKAGE_NAMES[pkgName] || pkgName;
    const version = getPackageVersion(pkgPath);

    // 运行 npm pack
    const result = execSync('npm pack', {
      cwd: pkgPath,
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    // npm pack 输出文件名
    const tgzFile = result.trim();
    if (tgzFile && tgzFile.endsWith('.tgz')) {
      console.log(`  ✓ 已生成 ${tgzFile}`);

      // 可以选择重命名文件以包含更清晰的版本信息
      // 例如: element-mage-plus-components-2026.1.1.tgz
      if (version) {
        const baseName = packageName.replace('@', '').replace('/', '-');
        const newFileName = `${baseName}-${version}.tgz`;
        const oldPath = path.join(pkgPath, tgzFile);
        const newPath = path.join(pkgPath, newFileName);

        // 如果文件名不匹配，重命名
        if (tgzFile !== newFileName && fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`  ✓ 已重命名为 ${newFileName}`);
        }
      }

      return true;
    } else {
      console.error(`✗ 生成 tgz 文件失败：未找到输出文件`);
      return false;
    }
  } catch (error) {
    console.error(`✗ 生成 tgz 文件失败:`, error.message);
    return false;
  }
}

// 构建单个包
function buildPackage(pkgName) {
  const pkgPath = getPackagePath(pkgName);

  if (!fs.existsSync(pkgPath)) {
    console.error(`✗ 包 ${pkgName} 不存在`);
    return false;
  }

  console.log(`\n\n========== 开始处理 ${PACKAGE_NAMES[pkgName] || pkgName} ==========`);

  // 1. 清理历史文件
  if (!cleanPackage(pkgName, pkgPath)) {
    return false;
  }

  // 2. 构建
  console.log(`\n 构建 ${PACKAGE_NAMES[pkgName] || pkgName}...`);
  try {
    execSync(`pnpm build`, {
      cwd: pkgPath,
      stdio: 'inherit',
      encoding: 'utf-8',
    });
    console.log(`✓ ${PACKAGE_NAMES[pkgName] || pkgName} 构建完成`);
  } catch (error) {
    console.error(`✗ ${PACKAGE_NAMES[pkgName] || pkgName} 构建失败`);
    return false;
  }

  // 3. 生成 tgz 文件
  if (!packPackage(pkgName, pkgPath)) {
    console.error(`✗ ${PACKAGE_NAMES[pkgName] || pkgName} 生成 tgz 失败，但构建已成功`);
    return false;
  }

  console.log(`\n✓ ${PACKAGE_NAMES[pkgName] || pkgName} 处理完成`);
  return true;
}

// 构建所有包
function buildAllPackages() {
  console.log('\n===== 开始构建所有包 =====\n');

  let successCount = 0;
  let failCount = 0;
  const builtPackages = [];

  for (const pkg of BUILD_ORDER) {
    const success = buildPackage(pkg);
    if (success) {
      successCount++;
      builtPackages.push(pkg);
    } else {
      failCount++;
      break;
    }
  }

  console.log('\n\n===== 构建报告 =====');
  console.log(`  总包数: ${BUILD_ORDER.length}`);
  console.log(`  (1) 成功: ${successCount}`);
  console.log(`  (2) 失败: ${failCount}`);

  if (successCount > 0) {
    console.log(`\n  成功构建的包:`);
    builtPackages.forEach(pkg => {
      const pkgPath = getPackagePath(pkg);
      const version = getPackageVersion(pkgPath);
      const packageName = PACKAGE_NAMES[pkg] || pkg;
      const baseName = packageName.replace('@', '').replace('/', '-');
      const tgzFile = `${baseName}-${version}.tgz`;
      console.log(`    ✓ ${packageName} -> ${tgzFile}`);
    });
  }

  console.log('\n===== 构建结束 =====\n');

  return failCount === 0;
}

// 主程序入口
const success = buildAllPackages();
process.exit(success ? 0 : 1);
