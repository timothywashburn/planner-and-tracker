import { ApiEndpoint } from '../../types';
import UserManager from '../../../controllers/user-manager';
import { Document } from 'mongoose';
import {PANEL_TYPES, PanelType} from "../../../models/panels";

interface Panel {
    panel: PanelType;
    visible: boolean;
}

interface UserConfig {
    id: string;
    name: string;
    timezone: string;
    discordID?: string;
    itemListTracking?: {
        channelId: string;
        messageId: string;
    };
    iosApp?: {
        panels: Panel[];
        itemCategories: string[];
        itemTypes: string[];
    };
}

interface GetUserConfigResponse {
    user: UserConfig;
}

interface MongoosePanelDocument extends Document {
    panel?: PanelType | null;
    visible?: boolean;
}

const isValidPanel = (panel: string | null | undefined): panel is PanelType => {
    return panel != null && PANEL_TYPES.includes(panel as PanelType);
};

export const getUserConfigEndpoint: ApiEndpoint<unknown, GetUserConfigResponse> = {
    path: '/api/account/config',
    method: 'get',
    auth: 'verifiedEmail',
    handler: async (req, res) => {
        try {
            const user = await UserManager.getInstance().getById(req.auth!.userId!);

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }

            if (!user.iosApp?.panels) {
                res.status(500).json({
                    success: false,
                    error: 'No panel configuration found'
                });
                return;
            }

            const transformedPanels = (user.iosApp.panels as MongoosePanelDocument[])
                .map(p => {
                    const { panel, visible } = p.toObject();
                    if (!isValidPanel(panel)) {
                        return null;
                    }
                    return {
                        panel,
                        visible: visible ?? true
                    };
                })
                .filter((p): p is Panel => p !== null);

            if (transformedPanels.length === 0) {
                res.status(500).json({
                    success: false,
                    error: 'No valid panel configuration found'
                });
                return;
            }

            const responseData: GetUserConfigResponse = {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    timezone: user.timezone,
                    discordID: user.discordID || undefined,
                    itemListTracking: user.itemListTracking || undefined,
                    iosApp: {
                        panels: transformedPanels,
                        itemCategories: user.iosApp.itemCategories,
                        itemTypes: user.iosApp.itemTypes
                    }
                }
            };

            res.json({
                success: true,
                data: responseData
            });
        } catch (error) {
            console.error('[config] Error in getUserConfig:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user configuration'
            });
        }
    }
};