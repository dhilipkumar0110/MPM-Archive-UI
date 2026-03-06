'use server';
/**
 * @fileOverview A Genkit flow for generating SQL WHERE clauses based on natural language input
 * or selected schema elements.
 *
 * - generateWhereClause - A function that handles the WHERE clause generation process.
 * - GenerateWhereClauseInput - The input type for the generateWhereClause function.
 * - GenerateWhereClauseOutput - The return type for the generateWhereClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const ColumnSchema = z.object({
  name: z.string().describe('The name of the database column.'),
  type: z.string().describe('The SQL data type of the column (e.g., INT, VARCHAR, DATE, BOOLEAN).'),
  description: z.string().optional().describe('An optional description or example of the column usage.'),
});

const GenerateWhereClauseInputSchema = z.object({
  naturalLanguageDescription: z.string().describe('A natural language description of the desired WHERE clause condition.'),
  tableSchema: z.array(ColumnSchema).describe('An array of objects describing the columns of the table, including their name, type, and an optional description.'),
  databaseType: z.enum(['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'SQLite']).describe('The type of the database to ensure correct SQL dialect.'),
});
export type GenerateWhereClauseInput = z.infer<typeof GenerateWhereClauseInputSchema>;

// Output Schema
const GenerateWhereClauseOutputSchema = z.object({
  whereClause: z.string().describe('The generated SQL WHERE clause.'),
  explanation: z.string().describe('An explanation of the generated WHERE clause and how it meets the requirements.'),
});
export type GenerateWhereClauseOutput = z.infer<typeof GenerateWhereClauseOutputSchema>;

// Wrapper function
export async function generateWhereClause(input: GenerateWhereClauseInput): Promise<GenerateWhereClauseOutput> {
  return aiWhereClauseGenerationFlow(input);
}

// Prompt definition
const generateWhereClausePrompt = ai.definePrompt({
  name: 'generateWhereClausePrompt',
  input: {
    schema: GenerateWhereClauseInputSchema.extend({
      tableSchema: z.string().describe('The stringified table schema.')
    })
  },
  output: {schema: GenerateWhereClauseOutputSchema},
  prompt: `You are an expert SQL query builder specializing in creating precise WHERE clauses.
Your task is to generate a SQL WHERE clause based on a natural language description and a given table schema.
The generated WHERE clause must be syntactically correct for the specified database type.
Also, provide a clear explanation of the WHERE clause.

Table Schema:
\`\`\`json
{{{tableSchema}}}
\`\`\`

Database Type: {{{databaseType}}}

Natural Language Description: "{{{naturalLanguageDescription}}}"

Instructions:
1. Generate only the WHERE clause (do not include SELECT, FROM, or other SQL parts).
2. Ensure the WHERE clause uses correct column names and data types as defined in the table schema.
3. Use appropriate operators and functions for the specified Database Type (e.g., date functions, string functions, case sensitivity).
4. For string comparisons, prefer LIKE with wildcards (%) for partial matches unless exact match is specified.
5. Wrap string literals in single quotes.
6. Provide an explanation that clarifies how the WHERE clause addresses the natural language description.

Example Output Format:
\`\`\`json
{
  "whereClause": "status = 'completed' AND created_at < '2023-01-01'",
  "explanation": "Filters records where the status is 'completed' and the creation date is before January 1st, 2023."
}
\`\`\`
`,
});

// Flow definition
const aiWhereClauseGenerationFlow = ai.defineFlow(
  {
    name: 'aiWhereClauseGenerationFlow',
    inputSchema: GenerateWhereClauseInputSchema,
    outputSchema: GenerateWhereClauseOutputSchema,
  },
  async (input) => {
    // Manually stringify the table schema to avoid relying on non-existent Handlebars helpers
    const {output} = await generateWhereClausePrompt({
      ...input,
      tableSchema: JSON.stringify(input.tableSchema, null, 2)
    });
    
    if (!output) {
      throw new Error('Failed to generate WHERE clause.');
    }
    return output;
  }
);
