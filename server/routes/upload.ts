import { Router, Response } from 'express';
import multer from 'multer';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, incrementUsage, getUserProfile } from '../services/supabase-admin.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

/**
 * POST /api/upload
 * Upload a file (PDF/image) to Supabase Storage.
 * Extracts text from PDFs for AI context.
 */
router.post('/', requireAuth, upload.single('file') as any, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const file = (req as any).file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  // Check file size limit from profile
  const profile = await getUserProfile(userId);
  const maxSize = (profile?.max_file_size_mb || 10) * 1024 * 1024;
  if (file.size > maxSize) {
    res.status(400).json({ error: `File too large. Max ${profile?.max_file_size_mb || 10}MB.` });
    return;
  }

  try {
    // Upload to Supabase Storage
    const storagePath = `${userId}/${Date.now()}_${file.originalname}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('user-uploads')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      res.status(500).json({ error: 'Failed to upload file.' });
      return;
    }

    // Extract text from PDF
    let extractedText = '';
    if (file.mimetype === 'application/pdf') {
      try {
        const pdfModule: any = await import('pdf-parse');
        const pdfParse = pdfModule.default || pdfModule;
        const data = await pdfParse(file.buffer);
        extractedText = (data.text || '').substring(0, 10000);
      } catch (err) {
        console.error('PDF parse error:', err);
        extractedText = '(Could not extract text from PDF)';
      }
    }

    // Save file metadata to DB
    const conversationId = req.body?.conversationId || null;

    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('file_uploads')
      .insert({
        user_id: userId,
        conversation_id: conversationId,
        file_name: file.originalname,
        file_type: file.mimetype,
        file_size_bytes: file.size,
        storage_path: storagePath,
        extracted_text: extractedText || null,
      })
      .select('id, file_name, file_type, file_size_bytes')
      .single();

    if (dbError || !fileRecord) {
      res.status(500).json({ error: 'Failed to save file metadata.' });
      return;
    }

    await incrementUsage(userId, 'files_total');

    res.json({
      id: fileRecord.id,
      fileName: fileRecord.file_name,
      fileType: fileRecord.file_type,
      fileSize: fileRecord.file_size_bytes,
      hasText: !!extractedText,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process upload.' });
  }
});

export default router;
