const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils");

/**
 * Creates and configures multer upload middleware with memory storage and image filtering.
 *
 * @function multerOptions
 * @returns {multer.Multer} Configured multer instance with memory storage and image-only file filter
 * @description This function sets up multer with:
 * - Memory storage to store files in memory as Buffer objects
 * - File filter that only accepts files with image MIME types
 * - Throws ApiError with 400 status code for non-image files
 */
const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

/**
 * Unified image resizing middleware that handles both single and multiple images
 * @param {Object|Array} config - Configuration for single image or array of configurations for multiple images
 * @param {string} config.fieldName - The name of the form field containing the image
 * @param {string} config.uploadPath - The file system path where processed images will be stored
 * @param {string} config.mimetype - The expected MIME type of the uploaded image
 * @param {number} config.quality - The compression quality for the processed image (0-100)
 * @param {number} config.imageLength - The target length/height for image resizing
 * @param {number} config.imageWidth - The target width for image resizing
 * @param {boolean} [config.isArray=false] - Whether the field accepts multiple images as an array
 * @param {string} [config.customName=""] - Custom name to append to filename
 * @returns {Function} Express middleware function
 */
exports.resizeImages = (config) =>
  asyncHandler(async (req, res, next) => {
    // Handle single image configuration (legacy support)
    if (
      typeof config === "string" ||
      (config && !Array.isArray(config) && !config.fieldName)
    ) {
      // Legacy single image support: resizeImages(uploadPath, mimetype, quality, imageLength, imageWidth, fieldName, customName)
      const [
        uploadPath,
        mimetype,
        quality,
        imageLength,
        imageWidth,
        fieldName = "image",
        customName = "",
      ] = arguments;

      let customNamePrefix = "";
      if (customName) {
        customNamePrefix = `-${customName}`;
      }
      const filename = `${uploadPath}-${uuidv4()}-${Date.now()}${customNamePrefix}.jpeg`;

      if (req.file) {
        await sharp(req.file.buffer)
          .resize(imageLength, imageWidth)
          .toFormat(mimetype)
          .jpeg({ quality: quality })
          .toFile(`uploads/${uploadPath}s/${filename}`);

        // Save image into our db
        req.body[fieldName] = filename;
      }

      return next();
    }

    // Handle new configuration format
    const configs = Array.isArray(config) ? config : [config];

    // Check if we have files to process
    const hasFiles =
      req.file || (req.files && Object.keys(req.files).length > 0);
    if (!hasFiles) {
      return next();
    }

    // Process each field configuration
    await Promise.all(
      configs.map(async (configItem) => {
        const {
          fieldName,
          mimetype,
          quality,
          imageLength,
          imageWidth,
          isArray = false,
          uploadPath,
          customName = "",
        } = configItem;

        const folderPath = uploadPath || `${fieldName}s`;
        let customNamePrefix = "";
        if (customName) {
          customNamePrefix = `-${customName}`;
        }

        // Handle single file upload (from req.file)
        if (req.file && !req.files) {
          const filename = `${
            uploadPath || fieldName
          }-${uuidv4()}-${Date.now()}${customNamePrefix}.jpeg`;

          await sharp(req.file.buffer)
            .resize(imageLength, imageWidth)
            .toFormat(mimetype)
            .jpeg({ quality: quality })
            .toFile(`uploads/${folderPath}s/${filename}`);

          req.body[fieldName] = filename;
          return;
        }

        // Handle multiple files upload (from req.files)
        if (req.files && req.files[fieldName]) {
          if (isArray) {
            // Handle multiple images (array field)
            req.body[fieldName] = [];
            await Promise.all(
              req.files[fieldName].map(async (file, index) => {
                const filename = `${fieldName}-${uuidv4()}-${Date.now()}-${
                  index + 1
                }${customNamePrefix}.jpeg`;

                await sharp(file.buffer)
                  .resize(imageLength, imageWidth)
                  .toFormat(mimetype)
                  .jpeg({ quality: quality })
                  .toFile(`uploads/${folderPath}s/${filename}`);

                req.body[fieldName].push(filename);
              })
            );
          } else {
            // Handle single image from multiple files
            const filename = `${fieldName}-${uuidv4()}-${Date.now()}${customNamePrefix}.jpeg`;

            await sharp(req.files[fieldName][0].buffer)
              .resize(imageLength, imageWidth)
              .toFormat(mimetype)
              .jpeg({ quality: quality })
              .toFile(`uploads/${folderPath}s/${filename}`);

            req.body[fieldName] = filename;
          }
        }
      })
    );

    next();
  });

// Legacy support - alias for backward compatibility
exports.resizeSingleImage = (...args) => exports.resizeImages(...args);
exports.resizeMixOfImages = (configs) => exports.resizeImages(configs);
