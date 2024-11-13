import axios from 'axios';
import { TestContext } from '../../main';

interface TasksResponse {
    success: boolean;
    data: {
        tasks: Array<{
            id: string;
            name: string;
            completed: boolean;
            dueDate?: string;
            notes?: string;
        }>;
    };
    error?: string;
}

export async function runGetTasksTest(context: TestContext) {
    if (!context.authToken) {
        throw new Error('no auth token available');
    }

    const response = await axios.get<TasksResponse>(
        `${context.baseUrl}/api/tasks?userId=${context.userId}`,
        {
            headers: {
                Authorization: `Bearer ${context.authToken}`
            }
        }
    );

    if (!response.data.success) {
        throw new Error('failed to fetch tasks');
    }

    if (!Array.isArray(response.data.data.tasks)) {
        throw new Error('invalid tasks response format');
    }
}