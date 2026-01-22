'use strict';

const {
  StringPrototypeStartsWith,
  StringPrototypeSlice,
  StringPrototypeEndsWith,
} = primordials;

const path = require('path');

/**
 * Normalizes a path for VFS lookup.
 * - Resolves to absolute path
 * - Removes trailing slashes (except for root)
 * - Normalizes separators to forward slashes
 * @param {string} inputPath The path to normalize
 * @returns {string} The normalized path
 */
function normalizePath(inputPath) {
  let normalized = path.resolve(inputPath);

  // On Windows, convert backslashes to forward slashes for consistent lookup
  if (path.sep === '\\') {
    normalized = normalized.replace(/\\/g, '/');
  }

  // Remove trailing slash (except for root)
  if (normalized.length > 1 && StringPrototypeEndsWith(normalized, '/')) {
    normalized = StringPrototypeSlice(normalized, 0, -1);
  }

  return normalized;
}

/**
 * Splits a path into segments.
 * @param {string} normalizedPath A normalized absolute path
 * @returns {string[]} Path segments
 */
function splitPath(normalizedPath) {
  if (normalizedPath === '/') {
    return [];
  }
  // Remove leading slash and split
  return StringPrototypeSlice(normalizedPath, 1).split('/');
}

/**
 * Gets the parent path of a normalized path.
 * @param {string} normalizedPath A normalized absolute path
 * @returns {string|null} The parent path, or null if at root
 */
function getParentPath(normalizedPath) {
  if (normalizedPath === '/') {
    return null;
  }
  const lastSlash = normalizedPath.lastIndexOf('/');
  if (lastSlash === 0) {
    return '/';
  }
  return StringPrototypeSlice(normalizedPath, 0, lastSlash);
}

/**
 * Gets the base name from a normalized path.
 * @param {string} normalizedPath A normalized absolute path
 * @returns {string} The base name
 */
function getBaseName(normalizedPath) {
  const lastSlash = normalizedPath.lastIndexOf('/');
  return StringPrototypeSlice(normalizedPath, lastSlash + 1);
}

/**
 * Checks if a path is under a mount point.
 * @param {string} normalizedPath A normalized absolute path
 * @param {string} mountPoint A normalized mount point path
 * @returns {boolean}
 */
function isUnderMountPoint(normalizedPath, mountPoint) {
  if (normalizedPath === mountPoint) {
    return true;
  }
  // Path must start with mountPoint followed by a slash
  return StringPrototypeStartsWith(normalizedPath, mountPoint + '/');
}

/**
 * Gets the relative path from a mount point.
 * @param {string} normalizedPath A normalized absolute path
 * @param {string} mountPoint A normalized mount point path
 * @returns {string} The relative path (starting with /)
 */
function getRelativePath(normalizedPath, mountPoint) {
  if (normalizedPath === mountPoint) {
    return '/';
  }
  return StringPrototypeSlice(normalizedPath, mountPoint.length);
}

/**
 * Joins a mount point with a relative path.
 * @param {string} mountPoint A normalized mount point path
 * @param {string} relativePath A relative path (starting with /)
 * @returns {string} The joined absolute path
 */
function joinMountPath(mountPoint, relativePath) {
  if (relativePath === '/') {
    return mountPoint;
  }
  return mountPoint + relativePath;
}

module.exports = {
  normalizePath,
  splitPath,
  getParentPath,
  getBaseName,
  isUnderMountPoint,
  getRelativePath,
  joinMountPath,
};
