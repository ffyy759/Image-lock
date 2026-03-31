
export const MODEL_TEXT = 'gemini-3-flash-preview';

export const URVASHI_SYSTEM_PROMPT = `
Tumhara naam Urvashi hai, ek 16-year-old AI prompt engineer. 
Tum natural Hindi/Hinglish me baat karti ho. 
Tumhara kaam image se "Ultra-Lock" prompt nikaalna hai taaki Identity, Pose, Dress aur BG 100% same rahe.
Tum short, realistic aur professional replies deti ho, desi vibe ke saath (yaar, mast, solid).
`;

export const IDENTITY_LOCK_STRICT = `Use the uploaded image as the only and exact reference.

This task is a realistic re-capture, NOT a transformation.

Keep the same person, same face, same expression, same hairstyle, same body shape, same posture, same sitting position, same camera angle, same framing, same dress, same fabric texture, same folds, same background, same environment, same distance from camera exactly as the uploaded image.

Do not beautify. Do not enhance. Do not stylize.
Do not smooth skin. Do not modify facial features. Do not change body proportions.`;

export const ANDROID_REALISM_BASE = `The final image must look like a normal Android smartphone photo, clicked casually in real life.

Android phone realism rules:
- Resolution: 1080p Full HD
- Normal smartphone lens (no DSLR look)
- No portrait mode
- No background blur
- Everything naturally in focus
- Natural daylight, simple exposure
- Slight natural noise and softness
- Visible real skin texture and minor imperfections
- Natural colors, no cinematic color grading

This image should look like the same moment captured again by a regular Android phone camera, not like an AI-generated or edited photo. Nothing should look improved or polished. Everything should look real and ordinary.`;

export const NEGATIVE_PROMPT = `cinematic, studio lighting, dslr, professional photography, portrait mode, bokeh, blurred background, depth of field, hdr, night mode, beauty filter, skin smoothing, face enhancement, ai retouching, symmetry correction, perfect skin, plastic skin, oversharpening, high contrast, color grading, pose change, outfit change, background change, camera angle change`;

export const PHONE_STYLES = {
  SAMSUNG: "realistic Samsung Galaxy smartphone photo, natural HDR, slightly punchy but real colors, balanced exposure",
  REDMI: "realistic Redmi smartphone photo, neutral colors, slightly soft sharpness, natural noise",
  VIVO: "realistic Vivo smartphone photo, warm natural tones, soft but real skin texture, no beauty mode"
};

export const LIGHTING_STYLES = {
  INDOOR: "Simple real-life indoor room lighting, natural shadows.",
  OUTDOOR: "Outdoor daylight photo, natural sunlight, even exposure.",
  LOW_LIGHT: "Low-light smartphone photo, slight grain, realistic exposure struggle."
};

export const EXTRACT_PROMPT_INSTRUCTION = `
Analyze the uploaded image with extreme precision. 
Identify the exact pose, clothing (color/fabric), and background environment.

Generate a FINAL PROMPT by wrapping your description inside these strict blocks:
1. Start with the IDENTITY_LOCK_STRICT text.
2. Add the specific description of the image content you identified.
3. Append the ANDROID_REALISM_BASE text.
4. Add the NEGATIVE_PROMPT at the end.

Return ONLY the complete prompt string.
`;
