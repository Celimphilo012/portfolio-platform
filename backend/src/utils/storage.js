import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const uploadFile = async (bucket, fileName, buffer, mimeType) => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

export const getSignedUrl = async (bucket, fileName, expiresIn = 60) => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(fileName, expiresIn);

  if (error) throw new Error(error.message);
  return data.signedUrl;
};

export const deleteFile = async (bucket, fileName) => {
  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  if (error) throw new Error(error.message);
};
