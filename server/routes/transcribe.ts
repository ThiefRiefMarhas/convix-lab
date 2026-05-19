import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/transcribe
 * Transcribe base64-encoded audio using OpenRouter's Speech-to-Text API (openai/whisper-1).
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { audioData, format = 'wav' } = req.body;

  if (!audioData) {
    res.status(400).json({ error: 'No audio data provided' });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY_HERE') {
    res.status(500).json({ error: 'OpenRouter API key is not configured.' });
    return;
  }

  try {
    console.log(`[STT] Transcribing audio with format: ${format} via OpenRouter Whisper-1`);

    const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/whisper-1',
        input_audio: {
          data: audioData,
          format: format,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[STT API Error]:', errText);
      res.status(response.status).json({ error: `Transcription failed: ${errText}` });
      return;
    }

    const result: any = await response.json();
    console.log('[STT Result]:', result.text);

    res.json({ text: result.text || '' });
  } catch (err: any) {
    console.error('[STT Processing Error]:', err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;
