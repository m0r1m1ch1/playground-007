import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroConfig, AstroIntegrationLogger } from 'astro';
import sharp from 'sharp';
import { parseFileName } from './utils';
import type { Plugin } from 'vite';

export type Scales = { suffix: string; dpr: number }[];
export type Formats = ('jpg' | 'jpeg' | 'png' | 'webp' | 'avif')[];

export type OptimizeOptions = {
  outputDir?: string;
  scales?: Scales;
  quality?: number;
  formats?: Formats;
};

type Config = OptimizeOptions & Pick<AstroConfig, 'root' | 'srcDir' | 'publicDir'> & { logger: AstroIntegrationLogger };

export default function TrqImageResize({ root, srcDir, publicDir, logger, ...optimizeOptions }: Config): Plugin {
  const virtualModuleId = 'virtual:astro-trq-image';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const IMAGED_DIR = path.join(fileURLToPath(srcDir), 'images');

  return {
    name: 'astro-trq-image',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const config = ${JSON.stringify({ ...optimizeOptions })}`;
      }
    },
    config: async (_, { mode, command }) => {
      if (mode === 'development' && process.env.RESIZE_IMAGES === 'true') {
        deleteAllImages(publicDir, optimizeOptions);
        await optimizeAllImages(srcDir, publicDir, optimizeOptions, logger);
      }
    },
    watchChange: async (id, change) => {
      if (id.startsWith(IMAGED_DIR)) {
        const ext = id.split('.').pop();
        if (ext && ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
          if (change.event === 'delete') {
            deleteImages(id, srcDir, publicDir, optimizeOptions, logger);
          } else {
            await optimizeImage(id, srcDir, publicDir, optimizeOptions, logger);
          }
        } else if (!id.endsWith('/.DS_Store')) {
          if (change.event === 'delete') {
            deleteFile(id, srcDir, publicDir, optimizeOptions, logger);
          } else {
            copyFile(id, srcDir, publicDir, optimizeOptions, logger);
          }
        }
      }
    },
  };
}

const getDirectory = (srcDir: URL, publicDir: URL, outputDir: string) => {
  const _publicDir = fileURLToPath(publicDir);

  return {
    IMAGED_DIR: path.join(fileURLToPath(srcDir), 'images'),
    PUBLIC_DIR: _publicDir,
    OUTPUT_DIR: path.join(_publicDir, outputDir),
  };
};

const getOutputInfo = (imgPath: string, inputDir: string, outputDir: string, scales: Scales) => {
  const maxDpr = Math.max(...scales.map((s) => s.dpr));
  const _imgPath = imgPath.replace(inputDir, outputDir);
  const { nameArray, maxRatio } = parseFileName(_imgPath);

  return {
    baseName: nameArray.join('@'),
    scales: scales.filter((s) => s.dpr <= maxDpr / maxRatio),
  };
};

const getOutputPath = (baseName: string, suffix: string, format: string) =>
  `${baseName}${suffix ? '@' + suffix : ''}.${format}`;

const mkdir = (filePath: string) => {
  const outputDirArray = filePath.split('/');
  outputDirArray.pop();
  const outputDir = outputDirArray.join('/');
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (e) {}
  }
};

const deleteImages = async (
  imgPath: string,
  srcDir: URL,
  publicDir: URL,
  { outputDir = 'images', scales: _scales = [{ suffix: '', dpr: 1 }], formats }: OptimizeOptions,
  logger: AstroIntegrationLogger
) => {
  const { IMAGED_DIR, PUBLIC_DIR, OUTPUT_DIR } = getDirectory(srcDir, publicDir, outputDir);

  if (!fs.existsSync(OUTPUT_DIR)) {
    return;
  }

  const { baseName, scales } = getOutputInfo(imgPath, IMAGED_DIR, OUTPUT_DIR, _scales);

  scales.forEach(({ suffix }) => {
    (formats || [imgPath.split('.').pop() as string]).map((format) => {
      const outputPath = getOutputPath(baseName, suffix, format);
      try {
        fs.rmSync(outputPath);
        logger.info(`${outputPath.replace(PUBLIC_DIR, '')} deleted.`);
      } catch (e) {
        logger.warn(`${outputPath.replace(PUBLIC_DIR, '')} not found.`);
      }
    });
  });

  const originalExt = imgPath.split('.').pop();
  const copyPath = getOutputPath(baseName, 'raw', originalExt as string);
  try {
    fs.rmSync(copyPath);
  } catch (e) {
    logger.warn(`${copyPath.replace(PUBLIC_DIR, '')} not found.`);
  }
};

const optimizeImage = async (
  imgPath: string,
  srcDir: URL,
  publicDir: URL,
  { outputDir = 'images', scales: _scales = [{ suffix: '', dpr: 1 }], quality = 80, formats }: OptimizeOptions,
  logger: AstroIntegrationLogger
) => {
  const { IMAGED_DIR, PUBLIC_DIR, OUTPUT_DIR } = getDirectory(srcDir, publicDir, outputDir);

  const _sharp = sharp(imgPath);
  const metadata = await _sharp.metadata();
  const { baseName, scales } = getOutputInfo(imgPath, IMAGED_DIR, OUTPUT_DIR, _scales);
  mkdir(baseName);

  const tasks = scales.map(({ suffix, dpr }) => {
    const scaledWidth = metadata.width ? Math.floor(metadata.width * dpr) : 0;

    return Promise.all(
      (formats || [imgPath.split('.').pop() as string]).map(async (format) => {
        const outputPath = getOutputPath(baseName, suffix, format);

        await _sharp
          .clone()
          .resize(scaledWidth)
          .toFormat(format as any, { quality })
          .toFile(outputPath)
          .then(() => {
            logger.info(`${outputPath.replace(PUBLIC_DIR, '')} created.`);
          })
          .catch((e) => {
            logger.error(`Failed to create ${outputPath.replace(PUBLIC_DIR, '')}.`);
          });
      })
    );
  });

  const originalExt = imgPath.split('.').pop();
  const copyPath = getOutputPath(baseName, 'raw', originalExt as string);
  fs.copyFileSync(imgPath, copyPath);

  await Promise.all(tasks.flat());
};

const deleteFile = async (
  imgPath: string,
  srcDir: URL,
  publicDir: URL,
  { outputDir = 'images' }: OptimizeOptions,
  logger: AstroIntegrationLogger
) => {
  const { IMAGED_DIR, PUBLIC_DIR, OUTPUT_DIR } = getDirectory(srcDir, publicDir, outputDir);
  const outputPath = imgPath.replace(IMAGED_DIR, OUTPUT_DIR);

  try {
    fs.rmSync(outputPath);
    logger.info(`${outputPath.replace(PUBLIC_DIR, '')} deleted.`);
  } catch (e) {
    logger.warn(`${outputPath.replace(PUBLIC_DIR, '')} not found.`);
  }
};

const copyFile = async (
  imgPath: string,
  srcDir: URL,
  publicDir: URL,
  { outputDir = 'images' }: OptimizeOptions,
  logger: AstroIntegrationLogger
) => {
  const { IMAGED_DIR, PUBLIC_DIR, OUTPUT_DIR } = getDirectory(srcDir, publicDir, outputDir);
  const outputPath = imgPath.replace(IMAGED_DIR, OUTPUT_DIR);
  mkdir(outputPath);

  fs.copyFileSync(imgPath, outputPath);
  logger.info(`${outputPath.replace(PUBLIC_DIR, '')} created.`);
};

const deleteAllImages = (publicDir: URL, { outputDir = 'images' }: OptimizeOptions) => {
  fs.rmSync(`${path.join(fileURLToPath(publicDir), outputDir)}/`, { recursive: true, force: true });
};

const optimizeAllImages = async (
  srcDir: URL,
  publicDir: URL,
  optimizeOptions: OptimizeOptions,
  logger: AstroIntegrationLogger
) => {
  const { IMAGED_DIR } = getDirectory(srcDir, publicDir, optimizeOptions.outputDir || 'images');

  const getFiles = async (dir: string) => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const filePath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        await getFiles(filePath);
      } else {
        const ext = filePath.split('.').pop();
        if (ext && ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
          await optimizeImage(filePath, srcDir, publicDir, optimizeOptions, logger);
        } else if (!filePath.endsWith('/.DS_Store')) {
          copyFile(filePath, srcDir, publicDir, optimizeOptions, logger);
        }
      }
    }
  };

  await getFiles(IMAGED_DIR);
};
