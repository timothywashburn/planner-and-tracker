import axios from 'axios';
import { TestContext } from '../../../main';

interface GetThoughtsResponse {
    success: boolean;
    data: {
        thoughts: Array<{
            id: string;
            content: string;
        }>;
    };
    error?: string;
}

export async function runGetThoughtsTest(context: TestContext) {
    const response = await axios.get<GetThoughtsResponse>(
        `${context.baseUrl}/api/thoughts`,
        {
            headers: {
                Authorization: `Bearer ${context.authToken}`
            }
        }
    );

    if (!response.data.success) throw new Error('failed to fetch thoughts');
    if (!Array.isArray(response.data.data.thoughts)) throw new Error('invalid thoughts response format');
    if (response.data.data.thoughts.length !== 1) throw new Error(`expected 1 thought, found ${response.data.data.thoughts.length}`);
}