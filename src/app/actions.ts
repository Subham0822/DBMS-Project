'use server';

import { symptomChecker } from '@/ai/flows/ai-symptom-checker';
import { z } from 'zod';

const symptomSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in more detail.' }),
});

export async function getSymptomAnalysis(prevState: any, formData: FormData) {
  const validatedFields = symptomSchema.safeParse({
    symptoms: formData.get('symptoms'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.symptoms?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await symptomChecker({ symptoms: validatedFields.data.symptoms });
    return {
      data: result.likelyCauses,
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
