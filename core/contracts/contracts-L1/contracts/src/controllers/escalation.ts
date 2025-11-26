/**
 * 升級控制器 (Escalation Controller)
 * 
 * 提供進階升級系統的 REST API 端點
 * Provides REST API endpoints for advanced escalation system
 */

import { Request, Response } from 'express';
import { EscalationEngine } from '../services/escalation/escalation-engine';
import {
  EscalationTrigger,
  EscalationStatus,
  EscalationContext,
  EscalationResolution
} from '../types/escalation';
import { Priority } from '../types/assignment';

export class EscalationController {
  private escalationEngine: EscalationEngine;

  constructor() {
    this.escalationEngine = new EscalationEngine({
      autoRetryLimit: 3,
      enableSmartRouting: true,
      notificationEnabled: true
    });
  }

  /**
   * 創建升級事件
   * POST /api/v1/escalation/create
   */
  async createEscalation(req: Request, res: Response): Promise<void> {
    try {
      const {
        incidentId,
        trigger,
        priority,
        context,
        assignmentId
      } = req.body;

      // 驗證必要欄位
      if (!incidentId || !trigger || !priority || !context) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: incidentId, trigger, priority, context'
        });
        return;
      }

      // 驗證觸發原因
      const validTriggers: EscalationTrigger[] = [
        'AUTO_FIX_FAILED',
        'TIMEOUT_NO_RESPONSE',
        'TIMEOUT_NO_PROGRESS',
        'CRITICAL_SEVERITY',
        'REPEATED_FAILURES',
        'SAFETY_CRITICAL',
        'MANUAL_REQUEST'
      ];

      if (!validTriggers.includes(trigger)) {
        res.status(400).json({
          success: false,
          error: `Invalid trigger. Must be one of: ${validTriggers.join(', ')}`
        });
        return;
      }

      // 驗證優先級
      const validPriorities: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
      if (!validPriorities.includes(priority)) {
        res.status(400).json({
          success: false,
          error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
        });
        return;
      }

      // 創建升級事件
      const escalation = this.escalationEngine.createEscalation(
        incidentId,
        trigger as EscalationTrigger,
        priority as Priority,
        context as EscalationContext,
        assignmentId
      );

      res.status(201).json({
        success: true,
        data: {
          escalation
        }
      });
    } catch (error) {
      console.error('Error creating escalation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create escalation'
      });
    }
  }

  /**
   * 取得升級事件詳情
   * GET /api/v1/escalation/:escalationId
   */
  async getEscalation(req: Request, res: Response): Promise<void> {
    try {
      const { escalationId } = req.params;

      const escalation = this.escalationEngine.getEscalation(escalationId);

      if (!escalation) {
        res.status(404).json({
          success: false,
          error: 'Escalation not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          escalation
        }
      });
    } catch (error) {
      console.error('Error getting escalation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get escalation'
      });
    }
  }

  /**
   * 取得事件的所有升級
   * GET /api/v1/escalation/incident/:incidentId
   */
  async getEscalationsByIncident(req: Request, res: Response): Promise<void> {
    try {
      const { incidentId } = req.params;

      const escalations = this.escalationEngine.getEscalationsByIncident(incidentId);

      res.status(200).json({
        success: true,
        data: {
          escalations,
          count: escalations.length
        }
      });
    } catch (error) {
      console.error('Error getting escalations by incident:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get escalations'
      });
    }
  }

  /**
   * 更新升級狀態
   * POST /api/v1/escalation/:escalationId/status
   */
  async updateEscalationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { escalationId } = req.params;
      const { status, assignedTo } = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: status'
        });
        return;
      }

      const validStatuses: EscalationStatus[] = [
        'PENDING',
        'IN_REVIEW',
        'ASSIGNED',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
      ];

      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
        return;
      }

      const updatedEscalation = this.escalationEngine.updateEscalationStatus(
        escalationId,
        status as EscalationStatus,
        assignedTo
      );

      if (!updatedEscalation) {
        res.status(404).json({
          success: false,
          error: 'Escalation not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          escalation: updatedEscalation
        }
      });
    } catch (error) {
      console.error('Error updating escalation status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update escalation status'
      });
    }
  }

  /**
   * 解決升級事件
   * POST /api/v1/escalation/:escalationId/resolve
   */
  async resolveEscalation(req: Request, res: Response): Promise<void> {
    try {
      const { escalationId } = req.params;
      const resolution = req.body as EscalationResolution;

      if (!resolution || !resolution.solutionType || !resolution.description || !resolution.implementedBy) {
        res.status(400).json({
          success: false,
          error: 'Missing required resolution fields: solutionType, description, implementedBy'
        });
        return;
      }

      const resolvedEscalation = this.escalationEngine.resolveEscalation(
        escalationId,
        resolution
      );

      if (!resolvedEscalation) {
        res.status(404).json({
          success: false,
          error: 'Escalation not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          escalation: resolvedEscalation
        }
      });
    } catch (error) {
      console.error('Error resolving escalation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve escalation'
      });
    }
  }

  /**
   * 進一步升級
   * POST /api/v1/escalation/:escalationId/escalate
   */
  async escalateFurther(req: Request, res: Response): Promise<void> {
    try {
      const { escalationId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: reason'
        });
        return;
      }

      const newEscalation = this.escalationEngine.escalateFurther(
        escalationId,
        reason
      );

      if (!newEscalation) {
        res.status(400).json({
          success: false,
          error: 'Cannot escalate further or escalation not found'
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: {
          escalation: newEscalation
        }
      });
    } catch (error) {
      console.error('Error escalating further:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to escalate further'
      });
    }
  }

  /**
   * 取得可用的客服人員
   * GET /api/v1/escalation/customer-service/available
   */
  async getAvailableCustomerServiceAgents(_req: Request, res: Response): Promise<void> {
    try {
      const agents = this.escalationEngine.getAvailableCustomerServiceAgents();

      res.status(200).json({
        success: true,
        data: {
          agents,
          count: agents.length
        }
      });
    } catch (error) {
      console.error('Error getting available customer service agents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get available agents'
      });
    }
  }

  /**
   * 取得升級統計
   * GET /api/v1/escalation/statistics
   */
  async getEscalationStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      // 驗證和解析日期參數
      let start: Date;
      let end: Date;

      if (startDate) {
        start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          res.status(400).json({
            success: false,
            error: 'Invalid startDate format. Please use ISO 8601 format.'
          });
          return;
        }
      } else {
        // 默認為最近 7 天
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }

      if (endDate) {
        end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          res.status(400).json({
            success: false,
            error: 'Invalid endDate format. Please use ISO 8601 format.'
          });
          return;
        }
      } else {
        end = new Date();
      }

      const statistics = this.escalationEngine.getEscalationStatistics(start, end);

      res.status(200).json({
        success: true,
        data: {
          period: {
            start,
            end
          },
          statistics
        }
      });
    } catch (error) {
      console.error('Error getting escalation statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get statistics'
      });
    }
  }
}
