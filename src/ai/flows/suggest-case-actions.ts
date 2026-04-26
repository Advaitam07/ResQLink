'use server';
/**
 * @fileOverview A Genkit flow for suggesting actions, skills, and priority for a case.
 *
 * - suggestCaseActions - A function that handles the case action suggestion process.
 * - SuggestCaseActionsInput - The input type for the suggestCaseActions function.
 * - SuggestCaseActionsOutput - The return type for the suggestCaseActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCaseActionsInputSchema = z.object({
  description: z.string().describe('The detailed description of the case.'),
  category: z
    .string()
    .describe('The category of the case (e.g., medical, disaster relief, education).'),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The urgency level of the case.'),
});
export type SuggestCaseActionsInput = z.infer<typeof SuggestCaseActionsInputSchema>;

const SuggestCaseActionsOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('A list of recommended action items for the case.'),
  requiredSkills: z
    .array(z.string())
    .describe('A list of skills volunteers should possess to handle this case effectively.'),
  priorityLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The recommended priority level for the case.'),
});
export type SuggestCaseActionsOutput = z.infer<typeof SuggestCaseActionsOutputSchema>;

export async function suggestCaseActions(
  input: SuggestCaseActionsInput
): Promise<SuggestCaseActionsOutput> {
  // Offline Mock Logic to satisfy "no AI API" and "offline" requirements
  const desc = input.description.toLowerCase();
  let skills = ["Communication"];
  let actions = ["Establish community contact", "Initial site assessment"];
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = input.urgency;

  if (input.urgency === 'Critical' || desc.includes('flood') || desc.includes('water')) {
    skills = ["Logistics", "Rescue", "Emergency Medicine"];
    actions = ["Immediate evacuation", "Deploy supply trucks", "Establish distribution point", "Coordinate with local water board"];
    priority = 'Critical';
  } else if (desc.includes('medical') || desc.includes('sick') || desc.includes('injury')) {
    skills = ["Medical", "Nursing"];
    actions = ["Setup mobile clinic", "Inventory medical supplies", "Screen local residents"];
    priority = 'High';
  } else if (desc.includes('food') || desc.includes('hunger')) {
    skills = ["Logistics", "Inventory Management"];
    actions = ["Setup distribution hub", "Procure bulk grains", "Verify recipient list"];
    priority = 'Medium';
  }

  // Simulate minimal delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    suggestedActions: actions,
    requiredSkills: skills,
    priorityLevel: priority
  };
}
