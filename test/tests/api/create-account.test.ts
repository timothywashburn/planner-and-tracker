import axios from 'axios';
import { TestContext } from '../../main';

interface CreateAccountResponse {
    success: boolean;
    data: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}

export async function runCreateAccountTest(context: TestContext) {
    const response = await axios.post<CreateAccountResponse>(
        `${context.baseUrl}/api/auth/register`,
        context.account
    );

    if (!response.data.success) {
        throw new Error('account creation failed');
    }

    context.userId = response.data.data.id;
}