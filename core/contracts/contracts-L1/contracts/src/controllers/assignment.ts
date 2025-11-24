/**
 * 自動分派控制器 (Assignment Controller)
 * Handles auto-assignment API requests
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { AutoAssignmentEngine } from '../services/assignment/auto-assignment-engine';
import { ResponsibilityGovernance } from '../services/assignment/responsibility-governance';
import { Incident, Priority, ProblemType, AssignmentStatus } from '../types/assignment';

// 驗證 Schema
const incidentSchema = z.object({
  type: z.enum(['FRONTEND_ERROR', 'BACKEND_API', 'DATABASE_ISSUE', 'PERFORMANCE', 'SECURITY', 'INFRASTRUCTURE']),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  description: z.string().min(1),
  affectedFiles: z.array(z.string()).optional(),
  errorMessage: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'])
});

const reassignSchema = z.object({
  newOwnerId: z.string().min(1)
});

export class AssignmentController {
  private engine: AutoAssignmentEngine;
  private governance: ResponsibilityGovernance;

  constructor() {
    this.engine = new AutoAssignmentEngine();
    this.governance = new ResponsibilityGovernance();
  }

  /**
   * 創建新分派
   * POST /api/v1/assignment/assign
   */
  assignResponsibility = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = incidentSchema.parse(req.body);

      const incident: Incident = {
        id: `incident-${Date.now()}`,
        type: validatedData.type as ProblemType,
        priority: validatedData.priority as Priority,
        description: validatedData.description,
        affectedFiles: validatedData.affectedFiles,
        errorMessage: validatedData.errorMessage,
        createdAt: new Date()
      };

      const assignment = await this.engine.assignResponsibility(incident);

      res.status(201).json({
        success: true,
        data: {
          assignment,
          incident
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      } else if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 更新分派狀態
   * POST /api/v1/assignment/status/:id
   */
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateStatusSchema.parse(req.body);

      const assignment = await this.engine.updateAssignmentStatus(
        id,
        validatedData.status as AssignmentStatus
      );

      res.json({
        success: true,
        data: assignment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      } else if (error instanceof Error) {
        // Check if it's a not found error
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message
          });
        } else {
          res.status(500).json({
            success: false,
            error: error.message
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 查詢分派狀態
   * GET /api/v1/assignment/status/:id
   */
  getAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = this.engine.getAssignment(id);

      if (!assignment) {
        res.status(404).json({
          success: false,
          error: `Assignment ${id} not found`
        });
        return;
      }

      res.json({
        success: true,
        data: assignment
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 查詢工作負載
   * GET /api/v1/assignment/workload
   */
  getWorkload = async (_req: Request, res: Response): Promise<void> => {
    try {
      const workloadStats = this.engine.getWorkloadStatistics();
      const workloadArray = Array.from(workloadStats.entries()).map(([, metrics]) => metrics);

      res.json({
        success: true,
        data: workloadArray
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 重新分派責任
   * POST /api/v1/assignment/reassign/:id
   */
  reassign = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = reassignSchema.parse(req.body);

      const assignment = await this.engine.reassignResponsibility(
        id,
        validatedData.newOwnerId
      );

      res.json({
        success: true,
        data: assignment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      } else if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 升級分派
   * POST /api/v1/assignment/escalate/:id
   */
  escalate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = this.engine.getAssignment(id);

      if (!assignment) {
        res.status(404).json({
          success: false,
          error: `Assignment ${id} not found`
        });
        return;
      }

      // 更新為升級狀態
      const updatedAssignment = await this.engine.updateAssignmentStatus(id, 'ESCALATED');

      res.json({
        success: true,
        data: updatedAssignment,
        message: 'Assignment escalated successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 獲取所有分派
   * GET /api/v1/assignment/all
   */
  getAllAssignments = async (_req: Request, res: Response): Promise<void> => {
    try {
      const assignments = this.engine.getAllAssignments();

      res.json({
        success: true,
        data: assignments,
        count: assignments.length
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };

  /**
   * 獲取效能報告
   * GET /api/v1/assignment/report
   */
  getPerformanceReport = async (_req: Request, res: Response): Promise<void> => {
    try {
      const assignments = this.engine.getAllAssignments();
      const report = this.governance.generatePerformanceReport(assignments);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Unknown error occurred'
        });
      }
    }
  };
}
