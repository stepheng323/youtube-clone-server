import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { AWS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../config/constants';
import { respondWithSuccess } from '../helper/responseHandler';
import { catchAsync } from '../utils/catchAsync';
import Video from '../models/video';

const s3 = new S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'us-west-2',
});

export const getPresignedUrl = catchAsync(async (req, res, next) => {
  const { id } = req.auth;

  const key = `${id}/${uuidv4()}.mp4`;
  const params = {
    Bucket: 'youtube-clone-2',
    Key: key,
    ContentType: 'video/mp4',
  };
  const url = await s3.getSignedUrl('putObject', params);
  return respondWithSuccess(res, 200, 'presigned url generated successfully', { url, key });
});

export const getVideoThumbnailPresignedUrl = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const key = `${id}/${uuidv4()}.jpg`;
  const params = {
    Bucket: 'youtube-clone-2',
    Key: key,
    ContentType: 'image/jpg',
  };
  const url = await s3.getSignedUrl('putObject', params);
  return respondWithSuccess(res, 200, 'presigned url generated successfully', { url, key });
});

export const uploadVideoDetails = catchAsync(async (req, res, next) => {
  const {
    thumbnail, title, description, channel, 
  } = req.body;
  const { id } = req.auth;
  const video = Video.create({
    thumbnail, title, description, channel,
  });
});
