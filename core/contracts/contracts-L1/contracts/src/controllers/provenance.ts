import { Request, Response } from 'express';
import { ProvenanceService } from '../services/provenance';

export class ProvenanceController {
  private provenanceService: ProvenanceService;

  constructor() {
    this.provenanceService = new ProvenanceService();
  }

  /**
   * 創建構建認證
   */
  createAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath, builder, metadata } = req.body;

      if (!filePath) {
        res.status(400).json({
          success: false,
          error: 'filePath is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!builder) {
        res.status(400).json({
          success: false,
          error: 'builder is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const attestation = await this.provenanceService.createBuildAttestation(
        filePath,
        builder,
        metadata
      );

      res.status(201).json({
        success: true,
        data: attestation,
        message: 'Build attestation created successfully'
      });
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        res.status(404).json({
          success: false,
          error: 'File not found',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create attestation',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  /**
   * 驗證認證
   */
  verifyAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { attestation } = req.body;

      if (!attestation) {
        res.status(400).json({
          success: false,
          error: 'attestation is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const isValid = await this.provenanceService.verifyAttestation(attestation);

      res.json({
        success: true,
        data: {
          valid: isValid,
          attestationId: attestation.id,
          timestamp: new Date().toISOString()
        },
        message: isValid ? 'Attestation is valid' : 'Attestation is invalid'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify attestation',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * 獲取文件摘要
   */
  getFileDigest = async (req: Request, res: Response): Promise<void> => {
    try {
      const filePath = req.params.filePath || req.params[0]; // 支援通配符路由

      if (!filePath) {
        res.status(404).json({
          success: false,
          error: 'filePath is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // 解碼URL編碼的路徑
      const decodedPath = decodeURIComponent(filePath);
      const digest = await this.provenanceService.generateFileDigest(decodedPath);

      res.json({
        success: true,
        data: {
          filePath: decodedPath,
          digest,
          timestamp: new Date().toISOString()
        },
        message: 'File digest generated successfully'
      });
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        res.status(404).json({
          success: false,
          error: 'File not found',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate file digest',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  /**
   * 導入認證
   */
  importAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { attestationJson } = req.body;

      if (!attestationJson) {
        res.status(400).json({
          success: false,
          error: 'attestationJson is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const attestation = this.provenanceService.importAttestation(attestationJson);

      res.json({
        success: true,
        data: attestation,
        message: 'Attestation imported successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Invalid JSON data or attestation format',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * 導出認證
   */
  exportAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      // 這裡應該從數據庫獲取認證，現在返回格式化消息
      res.json({
        success: true,
        data: {
          message: `Attestation export for ID: ${id}`,
          format: 'json',
          timestamp: new Date().toISOString()
        },
        message: 'Attestation export endpoint'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export attestation',
        timestamp: new Date().toISOString()
      });
    }
  };
}